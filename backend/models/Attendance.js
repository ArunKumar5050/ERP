const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  attendance_id: {
    type: String,
    required: [true, 'Attendance ID is required'],
    unique: true,
    trim: true
  },
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'Student reference is required']
  },
  subject_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: [true, 'Subject reference is required']
  },
  faculty_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty',
    required: [true, 'Faculty reference is required']
  },
  semester_no: {
    type: Number,
    required: [true, 'Semester number is required'],
    min: [1, 'Semester must be at least 1'],
    max: [8, 'Semester cannot exceed 8']
  },
  academic_year: {
    type: String,
    required: [true, 'Academic year is required'],
    match: [/^\d{4}-\d{4}$/, 'Academic year format should be YYYY-YYYY']
  },
  total_classes: {
    type: Number,
    required: [true, 'Total classes is required'],
    min: [0, 'Total classes cannot be negative'],
    default: 0
  },
  present_classes: {
    type: Number,
    required: [true, 'Present classes is required'],
    min: [0, 'Present classes cannot be negative'],
    default: 0
  },
  absent_classes: {
    type: Number,
    required: [true, 'Absent classes is required'],
    min: [0, 'Absent classes cannot be negative'],
    default: 0
  },
  late_classes: {
    type: Number,
    default: 0,
    min: [0, 'Late classes cannot be negative']
  },
  excused_classes: {
    type: Number,
    default: 0,
    min: [0, 'Excused classes cannot be negative']
  },
  // Detailed attendance records
  attendance_records: [{
    date: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ['Present', 'Absent', 'Late', 'Excused'],
      required: true
    },
    class_type: {
      type: String,
      enum: ['Theory', 'Practical', 'Tutorial'],
      default: 'Theory'
    },
    period: {
      type: Number,
      min: 1,
      max: 8
    },
    time_slot: {
      start_time: String,
      end_time: String
    },
    room_number: String,
    marked_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Faculty'
    },
    marked_at: {
      type: Date,
      default: Date.now
    },
    remarks: {
      type: String,
      maxlength: [200, 'Remarks cannot exceed 200 characters']
    }
  }]
}, {
  timestamps: true
});

// Compound indexes for better performance
AttendanceSchema.index({ student_id: 1, subject_id: 1, semester_no: 1 }, { unique: true });
AttendanceSchema.index({ attendance_id: 1 });
AttendanceSchema.index({ subject_id: 1 });
AttendanceSchema.index({ faculty_id: 1 });
AttendanceSchema.index({ academic_year: 1 });
AttendanceSchema.index({ 'attendance_records.date': 1 });

// Pre-save middleware to ensure data consistency
AttendanceSchema.pre('save', function(next) {
  // Calculate totals from attendance records if records exist
  if (this.attendance_records && this.attendance_records.length > 0) {
    let present = 0, absent = 0, late = 0, excused = 0;
    
    this.attendance_records.forEach(record => {
      switch (record.status) {
        case 'Present':
          present++;
          break;
        case 'Absent':
          absent++;
          break;
        case 'Late':
          late++;
          break;
        case 'Excused':
          excused++;
          break;
      }
    });
    
    this.present_classes = present;
    this.absent_classes = absent;
    this.late_classes = late;
    this.excused_classes = excused;
    this.total_classes = present + absent + late + excused;
  } else {
    // Ensure total_classes = sum of all attendance types
    this.total_classes = this.present_classes + this.absent_classes + this.late_classes + this.excused_classes;
  }
  
  next();
});

// Virtual for attendance percentage
AttendanceSchema.virtual('attendance_percentage').get(function() {
  if (this.total_classes === 0) return 0;
  return Math.round(((this.present_classes + this.late_classes) / this.total_classes) * 100);
});

// Virtual for strict attendance percentage (only present)
AttendanceSchema.virtual('strict_attendance_percentage').get(function() {
  if (this.total_classes === 0) return 0;
  return Math.round((this.present_classes / this.total_classes) * 100);
});

// Virtual to check if attendance is below minimum (75%)
AttendanceSchema.virtual('is_below_minimum').get(function() {
  return this.attendance_percentage < 75;
});

// Static method to get attendance summary for a student
AttendanceSchema.statics.getStudentAttendanceSummary = async function(studentId, semesterNo = null) {
  const matchCondition = { student_id: new mongoose.Types.ObjectId(studentId) };
  if (semesterNo) {
    matchCondition.semester_no = semesterNo;
  }

  const pipeline = [
    { $match: matchCondition },
    {
      $lookup: {
        from: 'subjects',
        localField: 'subject_id',
        foreignField: '_id',
        as: 'subject'
      }
    },
    { $unwind: '$subject' },
    {
      $addFields: {
        attendance_percentage: {
          $cond: {
            if: { $gt: ['$total_classes', 0] },
            then: { $round: [{ $multiply: [{ $divide: [{ $add: ['$present_classes', '$late_classes'] }, '$total_classes'] }, 100] }, 2] },
            else: 0
          }
        },
        strict_attendance_percentage: {
          $cond: {
            if: { $gt: ['$total_classes', 0] },
            then: { $round: [{ $multiply: [{ $divide: ['$present_classes', '$total_classes'] }, 100] }, 2] },
            else: 0
          }
        }
      }
    },
    {
      $project: {
        semester_no: 1,
        subject_code: '$subject.subject_code',
        subject_name: '$subject.subject_name',
        total_classes: 1,
        present_classes: 1,
        absent_classes: 1,
        late_classes: 1,
        excused_classes: 1,
        attendance_percentage: 1,
        strict_attendance_percentage: 1,
        is_below_minimum: { $lt: ['$attendance_percentage', 75] }
      }
    },
    { $sort: { semester_no: 1, subject_code: 1 } }
  ];

  return await this.aggregate(pipeline);
};

// Static method to get subject-wise attendance for faculty
AttendanceSchema.statics.getFacultyAttendanceOverview = async function(facultyId, semesterNo, academicYear) {
  const matchCondition = { 
    faculty_id: new mongoose.Types.ObjectId(facultyId),
    semester_no: semesterNo,
    academic_year: academicYear
  };

  const pipeline = [
    { $match: matchCondition },
    {
      $lookup: {
        from: 'subjects',
        localField: 'subject_id',
        foreignField: '_id',
        as: 'subject'
      }
    },
    { $unwind: '$subject' },
    {
      $lookup: {
        from: 'students',
        localField: 'student_id',
        foreignField: '_id',
        as: 'student'
      }
    },
    { $unwind: '$student' },
    {
      $group: {
        _id: '$subject_id',
        subject_code: { $first: '$subject.subject_code' },
        subject_name: { $first: '$subject.subject_name' },
        total_students: { $sum: 1 },
        avg_attendance: { 
          $avg: {
            $cond: {
              if: { $gt: ['$total_classes', 0] },
              then: { $multiply: [{ $divide: [{ $add: ['$present_classes', '$late_classes'] }, '$total_classes'] }, 100] },
              else: 0
            }
          }
        },
        students_below_75: {
          $sum: {
            $cond: [
              { 
                $lt: [
                  {
                    $cond: {
                      if: { $gt: ['$total_classes', 0] },
                      then: { $multiply: [{ $divide: [{ $add: ['$present_classes', '$late_classes'] }, '$total_classes'] }, 100] },
                      else: 0
                    }
                  }, 
                  75
                ]
              }, 
              1, 
              0
            ]
          }
        }
      }
    },
    {
      $addFields: {
        avg_attendance: { $round: ['$avg_attendance', 2] }
      }
    },
    { $sort: { subject_code: 1 } }
  ];

  return await this.aggregate(pipeline);
};

// Method to add attendance record
AttendanceSchema.methods.addAttendanceRecord = function(attendanceRecord) {
  this.attendance_records.push(attendanceRecord);
  return this.save();
};

// Method to update attendance for a specific date
AttendanceSchema.methods.updateAttendanceRecord = function(date, newStatus, remarks = '') {
  const record = this.attendance_records.find(r => 
    r.date.toDateString() === new Date(date).toDateString()
  );
  
  if (record) {
    record.status = newStatus;
    record.remarks = remarks;
    return this.save();
  } else {
    throw new Error('Attendance record not found for the specified date');
  }
};

// Method to get attendance for a date range
AttendanceSchema.methods.getAttendanceByDateRange = function(startDate, endDate) {
  return this.attendance_records.filter(record => {
    const recordDate = new Date(record.date);
    return recordDate >= new Date(startDate) && recordDate <= new Date(endDate);
  });
};

module.exports = mongoose.model('Attendance', AttendanceSchema);