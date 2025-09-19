const mongoose = require('mongoose');

const AcademicDetailsSchema = new mongoose.Schema({
  academic_id: {
    type: String,
    required: [true, 'Academic ID is required'],
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
  // Assessment marks breakdown
  internal_marks: {
    type: Number,
    min: [0, 'Internal marks cannot be negative'],
    max: [100, 'Internal marks cannot exceed 100']
  },
  external_marks: {
    type: Number,
    min: [0, 'External marks cannot be negative'],
    max: [100, 'External marks cannot exceed 100']
  },
  practical_marks: {
    type: Number,
    default: 0,
    min: [0, 'Practical marks cannot be negative'],
    max: [100, 'Practical marks cannot exceed 100']
  },
  total_marks: {
    type: Number,
    required: [true, 'Total marks are required'],
    min: [0, 'Total marks cannot be negative'],
    max: [100, 'Total marks cannot exceed 100']
  },
  grade: {
    type: String,
    required: [true, 'Grade is required'],
    enum: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'],
    trim: true
  },
  grade_point: {
    type: Number,
    required: [true, 'Grade point is required'],
    min: [0, 'Grade point cannot be negative'],
    max: [10, 'Grade point cannot exceed 10'],
    validate: {
      validator: function(v) {
        return Number(v.toFixed(2)) === v;
      },
      message: 'Grade point should have at most 2 decimal places'
    }
  },
  credits_earned: {
    type: Number,
    required: [true, 'Credits earned is required'],
    min: [0, 'Credits earned cannot be negative']
  },
  // Additional academic information
  exam_type: {
    type: String,
    enum: ['Regular', 'Supplementary', 'Improvement'],
    default: 'Regular'
  },
  exam_date: {
    type: Date
  },
  result_status: {
    type: String,
    enum: ['Pass', 'Fail', 'Absent', 'Pending'],
    default: 'Pending'
  },
  remarks: {
    type: String,
    maxlength: [500, 'Remarks cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

// Indexes for better performance
AcademicDetailsSchema.index({ student_id: 1, semester_no: 1 });
AcademicDetailsSchema.index({ subject_id: 1 });
AcademicDetailsSchema.index({ academic_id: 1 });
AcademicDetailsSchema.index({ academic_year: 1 });
AcademicDetailsSchema.index({ result_status: 1 });

// Compound index to ensure unique record per student per subject per semester
AcademicDetailsSchema.index({ 
  student_id: 1, 
  subject_id: 1, 
  semester_no: 1,
  exam_type: 1
}, { unique: true });

// Pre-save middleware to calculate total marks and validate
AcademicDetailsSchema.pre('save', function(next) {
  // Calculate total marks
  this.total_marks = (this.internal_marks || 0) + (this.external_marks || 0) + (this.practical_marks || 0);
  
  // Auto-calculate grade and grade point if total marks is available
  if (this.total_marks !== undefined) {
    this.calculateGradeFromMarks();
  }
  
  // Set result status based on grade
  if (this.grade) {
    this.result_status = this.grade === 'F' ? 'Fail' : 'Pass';
  }
  
  next();
});

// Static method to get academic summary for a student
AcademicDetailsSchema.statics.getStudentAcademicSummary = async function(studentId) {
  const pipeline = [
    { 
      $match: { student_id: new mongoose.Types.ObjectId(studentId) } 
    },
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
      $group: {
        _id: '$semester_no',
        semesterGPA: { $avg: '$grade_point' },
        totalCredits: { $sum: '$credits_earned' },
        subjects: { $push: {
          subject_code: '$subject.subject_code',
          subject_name: '$subject.subject_name',
          internal_marks: '$internal_marks',
          external_marks: '$external_marks',
          practical_marks: '$practical_marks',
          total_marks: '$total_marks',
          grade: '$grade',
          grade_point: '$grade_point',
          credits_earned: '$credits_earned',
          result_status: '$result_status'
        }}
      }
    },
    { $sort: { _id: 1 } }
  ];

  return await this.aggregate(pipeline);
};

// Static method to calculate overall CGPA for a student
AcademicDetailsSchema.statics.calculateOverallCGPA = async function(studentId) {
  const pipeline = [
    { $match: { 
      student_id: new mongoose.Types.ObjectId(studentId),
      result_status: 'Pass'
    }},
    {
      $group: {
        _id: null,
        totalGradePoints: { $sum: { $multiply: ['$grade_point', '$credits_earned'] } },
        totalCredits: { $sum: '$credits_earned' }
      }
    },
    {
      $project: {
        cgpa: {
          $cond: {
            if: { $gt: ['$totalCredits', 0] },
            then: { $round: [{ $divide: ['$totalGradePoints', '$totalCredits'] }, 2] },
            else: 0
          }
        }
      }
    }
  ];

  const result = await this.aggregate(pipeline);
  return result[0]?.cgpa || 0;
};

// Static method to get subject-wise performance
AcademicDetailsSchema.statics.getSubjectWisePerformance = async function(studentId, semesterNo = null) {
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
      $project: {
        semester_no: 1,
        subject_code: '$subject.subject_code',
        subject_name: '$subject.subject_name',
        subject_type: '$subject.subject_type',
        credits: '$subject.credits',
        internal_marks: 1,
        external_marks: 1,
        practical_marks: 1,
        total_marks: 1,
        grade: 1,
        grade_point: 1,
        result_status: 1,
        exam_type: 1
      }
    },
    { $sort: { semester_no: 1, subject_code: 1 } }
  ];

  return await this.aggregate(pipeline);
};

// Method to calculate grade and grade point from total marks
AcademicDetailsSchema.methods.calculateGradeFromMarks = function() {
  const marks = this.total_marks;
  
  if (marks >= 90) {
    this.grade = 'A+';
    this.grade_point = 10;
  } else if (marks >= 80) {
    this.grade = 'A';
    this.grade_point = 9;
  } else if (marks >= 70) {
    this.grade = 'B+';
    this.grade_point = 8;
  } else if (marks >= 60) {
    this.grade = 'B';
    this.grade_point = 7;
  } else if (marks >= 50) {
    this.grade = 'C+';
    this.grade_point = 6;
  } else if (marks >= 40) {
    this.grade = 'C';
    this.grade_point = 5;
  } else if (marks >= 35) {
    this.grade = 'D';
    this.grade_point = 4;
  } else {
    this.grade = 'F';
    this.grade_point = 0;
  }
};

module.exports = mongoose.model('AcademicDetails', AcademicDetailsSchema);