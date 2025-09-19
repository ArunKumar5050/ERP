const mongoose = require('mongoose');

const FacultySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  employeeId: {
    type: String,
    required: [true, 'Employee ID is required'],
    unique: true,
    trim: true
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true
  },
  designation: {
    type: String,
    required: [true, 'Designation is required'],
    enum: ['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer', 'Lab Assistant'],
    trim: true
  },
  qualification: {
    type: String,
    required: [true, 'Qualification is required'],
    trim: true
  },
  specialization: {
    type: String,
    trim: true
  },
  experience: {
    type: Number,
    min: [0, 'Experience cannot be negative'],
    default: 0
  },
  dateOfJoining: {
    type: Date,
    required: [true, 'Date of joining is required']
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
  subjects: [{
    subjectCode: { type: String, required: true },
    subjectName: { type: String, required: true },
    credits: { type: Number, required: true },
    semester: { type: Number, required: true },
    course: { type: String, required: true },
    classSchedule: [{
      day: { 
        type: String, 
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        required: true
      },
      startTime: { type: String, required: true },
      endTime: { type: String, required: true },
      roomNumber: { type: String, required: true },
      classType: { 
        type: String, 
        enum: ['Lecture', 'Practical', 'Tutorial'],
        default: 'Lecture'
      }
    }]
  }],
  officeHours: [{
    day: { 
      type: String, 
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      required: true
    },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    location: { type: String, required: true }
  }],
  personalInfo: {
    emergencyContact: {
      name: { type: String, trim: true },
      relationship: { type: String, trim: true },
      phone: { type: String, trim: true }
    },
    bloodGroup: { type: String, trim: true },
    maritalStatus: { 
      type: String, 
      enum: ['single', 'married', 'divorced', 'widowed'],
      default: 'single'
    }
  },
  salary: {
    basic: { type: Number, min: 0 },
    allowances: { type: Number, min: 0, default: 0 },
    total: { type: Number, min: 0 }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'on_leave', 'retired'],
    default: 'active'
  },
  permissions: {
    canMarkAttendance: { type: Boolean, default: true },
    canViewReports: { type: Boolean, default: true },
    canManageStudents: { type: Boolean, default: false },
    canManageGrades: { type: Boolean, default: true }
  }
}, {
  timestamps: true
});

// Indexes for better performance
FacultySchema.index({ employeeId: 1 });
FacultySchema.index({ department: 1 });
FacultySchema.index({ designation: 1 });
FacultySchema.index({ status: 1 });

// Virtual for age
FacultySchema.virtual('age').get(function() {
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

// Virtual for years of service
FacultySchema.virtual('yearsOfService').get(function() {
  if (this.dateOfJoining) {
    const today = new Date();
    const joiningDate = new Date(this.dateOfJoining);
    let years = today.getFullYear() - joiningDate.getFullYear();
    const monthDiff = today.getMonth() - joiningDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < joiningDate.getDate())) {
      years--;
    }
    
    return years;
  }
  return 0;
});

// Virtual for complete address
FacultySchema.virtual('fullAddress').get(function() {
  const addr = this.address;
  if (!addr) return '';
  
  const parts = [addr.street, addr.city, addr.state, addr.pincode, addr.country].filter(Boolean);
  return parts.join(', ');
});

// Method to get today's schedule
FacultySchema.methods.getTodaySchedule = function() {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  let todayClasses = [];
  
  this.subjects.forEach(subject => {
    subject.classSchedule.forEach(schedule => {
      if (schedule.day === today) {
        todayClasses.push({
          subject: subject.subjectName,
          subjectCode: subject.subjectCode,
          ...schedule
        });
      }
    });
  });
  
  // Sort by start time
  return todayClasses.sort((a, b) => {
    const timeA = new Date(`1970-01-01 ${a.startTime}`);
    const timeB = new Date(`1970-01-01 ${b.startTime}`);
    return timeA - timeB;
  });
};

// Method to get total students taught
FacultySchema.methods.getTotalStudentsCount = async function() {
  const Student = mongoose.model('Student');
  const subjectCodes = this.subjects.map(subject => subject.subjectCode);
  
  const count = await Student.countDocuments({
    'subjects.subjectCode': { $in: subjectCodes },
    'academicInfo.status': 'active'
  });
  
  return count;
};

module.exports = mongoose.model('Faculty', FacultySchema);