const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  student_id: {
    type: String,
    required: [true, 'Student ID is required'],
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true
  },
  father_name: {
    type: String,
    required: [true, 'Father name is required'],
    trim: true
  },
  roll_no: {
    type: String,
    required: [true, 'Roll number is required'],
    unique: true,
    trim: true
  },
  branch: {
    type: String,
    required: [true, 'Branch is required'],
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
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email']
  },
  phone_no: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  father_phone: {
    type: String,
    required: [true, 'Father phone number is required'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  date_of_birth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  blood_group: {
    type: String,
    required: [true, 'Blood group is required'],
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    trim: true
  },
  batch: {
    type: String,
    required: [true, 'Batch is required'],
    trim: true
  },
  mentor_name: {
    type: String,
    required: [true, 'Mentor name is required'],
    trim: true
  },
  join_date: {
    type: Date,
    required: [true, 'Join date is required']
  },
  // Add user reference
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Indexes for better performance
StudentSchema.index({ student_id: 1 });
StudentSchema.index({ roll_no: 1 });
StudentSchema.index({ email: 1 });
StudentSchema.index({ branch: 1, batch: 1, semester: 1 });

// Virtual for age
StudentSchema.virtual('age').get(function() {
  if (this.date_of_birth) {
    const today = new Date();
    const birthDate = new Date(this.date_of_birth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }
  return null;
});

module.exports = mongoose.model('Student', StudentSchema);