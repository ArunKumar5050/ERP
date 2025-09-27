const mongoose = require('mongoose');
const { Attendance, Faculty, Subject } = require('./backend/models');
require('dotenv').config();

async function testDirectDB() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/erp_system');
    console.log('Connected to MongoDB');

    // Find a faculty member
    const faculty = await Faculty.findOne({ employeeId: 'FAC001' });
    console.log('Faculty:', faculty._id);
    console.log('Faculty subjects:', faculty.subjects.map(s => s.subjectCode));

    // Get subject codes
    const subjectCodes = faculty.subjects.map(subject => subject.subjectCode);
    console.log('Subject codes:', subjectCodes);

    // Find subjects that match these codes
    const subjects = await Subject.find({ subject_code: { $in: subjectCodes } });
    console.log('Matching subjects:', subjects.map(s => ({ id: s._id, code: s.subject_code })));

    // Try to find attendance records for this faculty
    console.log('Looking for attendance records...');
    const attendanceRecords = await Attendance.find({ faculty_id: faculty._id }).limit(5);
    console.log('Found attendance records:', attendanceRecords.length);
    
    if (attendanceRecords.length > 0) {
      console.log('Sample attendance record:', {
        id: attendanceRecords[0]._id,
        faculty_id: attendanceRecords[0].faculty_id,
        subject_id: attendanceRecords[0].subject_id,
        student_id: attendanceRecords[0].student_id,
        subject_code: attendanceRecords[0].subject_id ? 
          (await Subject.findById(attendanceRecords[0].subject_id)).subject_code : 'Unknown'
      });
    }

    // Try the aggregation query step by step
    console.log('Testing aggregation query...');
    const pipeline = [
      {
        $match: {
          faculty_id: faculty._id
        }
      },
      {
        $lookup: {
          from: 'subjects',
          localField: 'subject_id',
          foreignField: '_id',
          as: 'subject'
        }
      },
      {
        $unwind: '$subject'
      },
      {
        $match: {
          'subject.subject_code': { $in: subjectCodes }
        }
      }
    ];

    const result = await Attendance.aggregate(pipeline).limit(5);
    console.log('Aggregation result:', result.length);
    if (result.length > 0) {
      console.log('Sample result:', {
        student_id: result[0].student_id,
        subject_code: result[0].subject.subject_code,
        total_classes: result[0].total_classes,
        present_classes: result[0].present_classes
      });
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

testDirectDB();