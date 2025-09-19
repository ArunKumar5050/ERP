const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
  subject_id: {
    type: String,
    required: [true, 'Subject ID is required'],
    unique: true,
    trim: true
  },
  subject_code: {
    type: String,
    required: [true, 'Subject code is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  subject_name: {
    type: String,
    required: [true, 'Subject name is required'],
    trim: true
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true
  },
  credits: {
    type: Number,
    required: [true, 'Credits are required'],
    min: [1, 'Credits must be at least 1'],
    max: [6, 'Credits cannot exceed 6']
  },
  semester: {
    type: Number,
    required: [true, 'Semester is required'],
    min: [1, 'Semester must be at least 1'],
    max: [8, 'Semester cannot exceed 8']
  },
  subject_type: {
    type: String,
    enum: ['Core', 'Elective', 'Lab', 'Project', 'Internship'],
    required: [true, 'Subject type is required']
  },
  theory_hours: {
    type: Number,
    default: 0,
    min: [0, 'Theory hours cannot be negative']
  },
  practical_hours: {
    type: Number,
    default: 0,
    min: [0, 'Practical hours cannot be negative']
  },
  total_hours: {
    type: Number,
    required: [true, 'Total hours is required'],
    min: [1, 'Total hours must be at least 1']
  },
  is_active: {
    type: Boolean,
    default: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  prerequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  }],
  syllabus_topics: [{
    topic: {
      type: String,
      required: true,
      trim: true
    },
    hours: {
      type: Number,
      required: true,
      min: [1, 'Topic hours must be at least 1']
    }
  }],
  assessment_pattern: {
    internal_marks: {
      type: Number,
      default: 40,
      min: [0, 'Internal marks cannot be negative'],
      max: [100, 'Internal marks cannot exceed 100']
    },
    external_marks: {
      type: Number,
      default: 60,
      min: [0, 'External marks cannot be negative'],
      max: [100, 'External marks cannot exceed 100']
    },
    practical_marks: {
      type: Number,
      default: 0,
      min: [0, 'Practical marks cannot be negative'],
      max: [100, 'Practical marks cannot exceed 100']
    }
  }
}, {
  timestamps: true
});

// Indexes for better performance
SubjectSchema.index({ subject_id: 1 });
SubjectSchema.index({ subject_code: 1 });
SubjectSchema.index({ department: 1, semester: 1 });
SubjectSchema.index({ subject_type: 1 });
SubjectSchema.index({ is_active: 1 });

// Pre-save middleware to calculate total hours
SubjectSchema.pre('save', function(next) {
  if (this.theory_hours !== undefined && this.practical_hours !== undefined) {
    this.total_hours = this.theory_hours + this.practical_hours;
  }
  next();
});

// Virtual for full subject identifier
SubjectSchema.virtual('full_identifier').get(function() {
  return `${this.subject_code} - ${this.subject_name}`;
});

// Static method to get subjects by semester and department
SubjectSchema.statics.getSubjectsBySemesterAndDepartment = async function(semester, department) {
  return await this.find({
    semester: semester,
    department: department,
    is_active: true
  }).sort({ subject_code: 1 });
};

// Static method to get core subjects for a semester
SubjectSchema.statics.getCoreSubjects = async function(semester, department) {
  return await this.find({
    semester: semester,
    department: department,
    subject_type: 'Core',
    is_active: true
  }).sort({ subject_code: 1 });
};

// Method to check if subject has prerequisites
SubjectSchema.methods.hasPrerequisites = function() {
  return this.prerequisites && this.prerequisites.length > 0;
};

// Method to calculate total assessment marks
SubjectSchema.methods.getTotalAssessmentMarks = function() {
  const assessment = this.assessment_pattern;
  return assessment.internal_marks + assessment.external_marks + assessment.practical_marks;
};

module.exports = mongoose.model('Subject', SubjectSchema);