const mongoose = require('mongoose');
const { Student, Faculty, Attendance } = require('./backend/models');

async function testStudents() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/erp_system');
    console.log('Connected to MongoDB');
    
    // Fetch all students
    const students = await Student.find({}).limit(5);
    console.log('Students found:', students.length);
    if (students.length > 0) {
      console.log('Sample student:', students[0].toObject());
    }
    
    // Fetch faculty
    const faculty = await Faculty.findOne({}).populate('user');
    console.log('Faculty found:', faculty ? faculty.toObject() : null);
    
    // Check if faculty has subjects
    if (faculty && faculty.subjects) {
      console.log('Faculty subjects:', faculty.subjects.map(s => s.subjectCode));
      
      // Try to find attendance records for this faculty
      const attendanceRecords = await Attendance.find({ faculty: faculty._id }).limit(5);
      console.log('Attendance records for faculty:', attendanceRecords.length);
      if (attendanceRecords.length > 0) {
        console.log('Sample attendance record:', attendanceRecords[0].toObject());
      }
    }
    
    // Close connection
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
  }
}

testStudents();