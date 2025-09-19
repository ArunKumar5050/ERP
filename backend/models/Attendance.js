const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'Student reference is required']
  },
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty',
    required: [true, 'Faculty reference is required']
  },
  subject: {
    subjectCode: { type: String, required: true },
    subjectName: { type: String, required: true },
    credits: { type: Number, required: true }
  },
  date: {
    type: Date,
    required: [true, 'Attendance date is required']
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'late', 'excused'],
    required: [true, 'Attendance status is required']
  },
  classType: {
    type: String,
    enum: ['Lecture', 'Practical', 'Tutorial'],
    default: 'Lecture'
  },
  period: {
    type: Number,
    min: 1,
    max: 8,
    required: [true, 'Period number is required']
  },
  timeSlot: {
    startTime: { type: String, required: true },
    endTime: { type: String, required: true }
  },
  roomNumber: {
    type: String,
    required: [true, 'Room number is required']
  },
  markedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty',
    required: true
  },
  markedAt: {
    type: Date,
    default: Date.now
  },
  remarks: {
    type: String,
    maxlength: [500, 'Remarks cannot exceed 500 characters']
  },
  isModified: {
    type: Boolean,
    default: false
  },
  modificationHistory: [{
    modifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' },
    previousStatus: { type: String },
    newStatus: { type: String },
    reason: { type: String },
    modifiedAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

// Compound indexes for better performance
AttendanceSchema.index({ student: 1, date: -1 });
AttendanceSchema.index({ faculty: 1, date: -1 });
AttendanceSchema.index({ 'subject.subjectCode': 1, date: -1 });
AttendanceSchema.index({ date: -1, status: 1 });

// Ensure unique attendance record per student per subject per period per date
AttendanceSchema.index({ 
  student: 1, 
  'subject.subjectCode': 1, 
  date: 1, 
  period: 1 
}, { unique: true });

// Static method to get attendance summary for a student
AttendanceSchema.statics.getStudentAttendanceSummary = async function(studentId, subjectCode = null) {
  const matchCondition = { student: new mongoose.Types.ObjectId(studentId) };
  if (subjectCode) {
    matchCondition['subject.subjectCode'] = subjectCode;
  }

  const pipeline = [
    { $match: matchCondition },
    {
      $group: {
        _id: '$subject.subjectCode',
        subjectName: { $first: '$subject.subjectName' },
        totalClasses: { $sum: 1 },
        presentCount: {
          $sum: {
            $cond: [{ $eq: ['$status', 'present'] }, 1, 0]
          }
        },
        absentCount: {
          $sum: {
            $cond: [{ $eq: ['$status', 'absent'] }, 1, 0]
          }
        },
        lateCount: {
          $sum: {
            $cond: [{ $eq: ['$status', 'late'] }, 1, 0]
          }
        },
        excusedCount: {
          $sum: {
            $cond: [{ $eq: ['$status', 'excused'] }, 1, 0]
          }
        }
      }
    },
    {
      $addFields: {
        attendancePercentage: {
          $round: [
            {
              $multiply: [
                { $divide: ['$presentCount', '$totalClasses'] },
                100
              ]
            },
            2
          ]
        }
      }
    },
    { $sort: { _id: 1 } }
  ];

  return await this.aggregate(pipeline);
};

// Static method to get faculty attendance overview
AttendanceSchema.statics.getFacultyAttendanceOverview = async function(facultyId, startDate, endDate) {
  const matchCondition = { 
    faculty: new mongoose.Types.ObjectId(facultyId),
    date: { $gte: startDate, $lte: endDate }
  };

  const pipeline = [
    { $match: matchCondition },
    {
      $group: {
        _id: {
          subjectCode: '$subject.subjectCode',
          date: '$date'
        },
        subjectName: { $first: '$subject.subjectName' },
        totalStudents: { $sum: 1 },
        presentStudents: {
          $sum: {
            $cond: [{ $eq: ['$status', 'present'] }, 1, 0]
          }
        },
        absentStudents: {
          $sum: {
            $cond: [{ $eq: ['$status', 'absent'] }, 1, 0]
          }
        }
      }
    },
    {
      $addFields: {
        attendancePercentage: {
          $round: [
            {
              $multiply: [
                { $divide: ['$presentStudents', '$totalStudents'] },
                100
              ]
            },
            2
          ]
        }
      }
    },
    { $sort: { '_id.date': -1, '_id.subjectCode': 1 } }
  ];

  return await this.aggregate(pipeline);
};

// Method to modify attendance with history tracking
AttendanceSchema.methods.modifyAttendance = function(newStatus, modifiedBy, reason) {
  if (this.status !== newStatus) {
    this.modificationHistory.push({
      modifiedBy: modifiedBy,
      previousStatus: this.status,
      newStatus: newStatus,
      reason: reason,
      modifiedAt: new Date()
    });
    
    this.status = newStatus;
    this.isModified = true;
  }
  
  return this.save();
};

// Virtual to check if attendance is critical (below 75%)
AttendanceSchema.virtual('isCritical').get(function() {
  return this.attendancePercentage < 75;
});

module.exports = mongoose.model('Attendance', AttendanceSchema);