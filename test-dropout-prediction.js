const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const { Student, AcademicDetails, Attendance } = require('./backend/models');

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/erp_system');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Test data extraction
const testFeatureExtraction = async () => {
  try {
    // Fetch a sample student
    const student = await Student.findOne({});
    
    if (!student) {
      console.log('No students found in database');
      return;
    }
    
    console.log('Testing feature extraction for student:', student.name);
    
    // Get academic details (for CGPA)
    const academicSummary = await AcademicDetails.getStudentAcademicSummary(student._id);
    console.log('Academic Summary:', academicSummary.length, 'semesters');
    
    // Calculate overall CGPA
    const cgpa = await AcademicDetails.calculateOverallCGPA(student._id);
    console.log('Overall CGPA:', cgpa);
    
    // Get attendance data
    const attendanceSummary = await Attendance.getStudentAttendanceSummary(student._id);
    console.log('Attendance Records:', attendanceSummary.length, 'subjects');
    
    // Calculate average attendance percentage
    let totalAttendance = 0;
    let attendanceCount = 0;
    
    attendanceSummary.forEach(subject => {
      totalAttendance += subject.attendance_percentage || 0;
      attendanceCount++;
    });
    
    const avgAttendance = attendanceCount > 0 ? totalAttendance / attendanceCount : 0;
    console.log('Average Attendance:', avgAttendance.toFixed(2) + '%');
    
    // Count backlogs (subjects with grade 'F')
    const backlogs = await AcademicDetails.countDocuments({
      student_id: student._id,
      grade: 'F'
    });
    console.log('Backlogs:', backlogs);
    
    // Count assignments submitted (using academic details as proxy)
    const assignmentsSubmitted = academicSummary.length;
    console.log('Assignments Submitted:', assignmentsSubmitted);
    
    console.log('\n--- Feature Extraction Test Complete ---');
    
  } catch (error) {
    console.error('Error in feature extraction test:', error);
  }
};

// Run tests
const runTests = async () => {
  const connection = await connectDB();
  
  await testFeatureExtraction();
  
  // Close connection
  await connection.disconnect();
  console.log('Disconnected from MongoDB');
};

runTests();