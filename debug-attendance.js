const mongoose = require('mongoose');
const { Attendance, Faculty, Student, User } = require('./backend/models');
require('dotenv').config();

async function debugAttendance() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/erp_system');
    console.log('Connected to MongoDB');

    // Find the faculty member
    const faculty = await Faculty.findOne({ employeeId: 'FAC001' }).populate('user');
    console.log('Faculty:', faculty.user.firstName, faculty.user.lastName);
    console.log('Faculty subjects:', faculty.subjects.map(s => s.subjectCode));

    // Get subject codes
    const subjectCodes = faculty.subjects.map(subject => subject.subjectCode);
    console.log('Subject codes:', subjectCodes);

    // Find attendance records for this faculty and these subjects
    const attendanceRecords = await Attendance.find({
      faculty_id: faculty._id,
      'subject.subjectCode': { $in: subjectCodes }
    }).limit(5);

    console.log('Attendance records found:', attendanceRecords.length);
    if (attendanceRecords.length > 0) {
      console.log('Sample attendance record:', {
        student: attendanceRecords[0].student_id,
        subject: attendanceRecords[0].subject_id,
        faculty: attendanceRecords[0].faculty_id,
        subjectCode: attendanceRecords[0].subject.subjectCode
      });
    }

    // Try the aggregation query
    const attendanceData = await Attendance.aggregate([
      {
        $match: {
          faculty_id: faculty._id,
          'subject.subjectCode': { $in: subjectCodes }
        }
      },
      {
        $group: {
          _id: '$student_id',
          totalClasses: { $sum: 1 },
          presentCount: {
            $sum: {
              $cond: [{ $eq: ['$status', 'present'] }, 1, 0]
            }
          }
        }
      }
    ]);

    console.log('Aggregated attendance data:', attendanceData.length);
    console.log('Sample aggregated data:', attendanceData.slice(0, 3));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

debugAttendance();