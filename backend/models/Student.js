const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  studentId: {
    type: String,
    required: [true, 'Student ID is required'],
    unique: true,
    trim: true
  },
  rollNumber: {
    type: String,
    required: [true, 'Roll number is required'],
    unique: true,
    trim: true
  },
  course: {
    type: String,
    required: [true, 'Course is required'],
    trim: true
  },
  batch: {
    type: String,
    required: [true, 'Batch is required'],
    trim: true
  },
  semester: {
    type: Number,
    required: [true, 'Current semester is required'],
    min: [1, 'Semester must be at least 1'],
    max: [8, 'Semester cannot exceed 8']
  },
  section: {
    type: String,
    required: [true, 'Section is required'],
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: [true, 'Gender is required']
  },
  address: {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    pincode: { type: String, trim: true },
    country: { type: String, default: 'India', trim: true }
  },
  emergencyContact: {
    name: { type: String, trim: true },
    relationship: { type: String, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true }
  },
  academicInfo: {
    admissionDate: { type: Date, required: true },
    expectedGraduation: { type: Date },
    currentCGPA: { type: Number, min: 0, max: 10, default: 0 },
    totalCredits: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['active', 'inactive', 'graduated', 'dropped'],
      default: 'active'
    }
  },
  subjects: [{
    subjectCode: { type: String, required: true },
    subjectName: { type: String, required: true },
    credits: { type: Number, required: true },
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' },
    semester: { type: Number, required: true }
  }],
  hostelInfo: {
    isHostelResident: { type: Boolean, default: false },
    hostelName: { type: String },
    roomNumber: { type: String },
    roomType: { type: String, enum: ['single', 'double', 'triple'] }
  }
}, {
  timestamps: true
});

// Indexes for better performance
StudentSchema.index({ studentId: 1 });
StudentSchema.index({ rollNumber: 1 });
StudentSchema.index({ course: 1, batch: 1, semester: 1 });
StudentSchema.index({ 'academicInfo.status': 1 });

// Virtual for age
StudentSchema.virtual('age').get(function() {
  if (this.dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }
  return null;
});

// Virtual for complete address
StudentSchema.virtual('fullAddress').get(function() {
  const addr = this.address;
  if (!addr) return '';
  
  const parts = [addr.street, addr.city, addr.state, addr.pincode, addr.country].filter(Boolean);
  return parts.join(', ');
});

// Method to get current semester subjects
StudentSchema.methods.getCurrentSemesterSubjects = function() {
  return this.subjects.filter(subject => subject.semester === this.semester);
};

// Method to calculate overall attendance percentage
StudentSchema.methods.getOverallAttendancePercentage = async function() {
  const Attendance = mongoose.model('Attendance');
  const attendanceRecords = await Attendance.find({ student: this._id });
  
  if (attendanceRecords.length === 0) return 0;
  
  const totalPresent = attendanceRecords.filter(record => record.status === 'present').length;
  return Math.round((totalPresent / attendanceRecords.length) * 100);
};

module.exports = mongoose.model('Student', StudentSchema);