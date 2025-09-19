const mongoose = require('mongoose');
require('dotenv').config();
const { Student, Attendance } = require('./models');

const testDashboard = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/erp_system');
    console.log('🔗 Connected to MongoDB');

    // Find a test student (no population needed since we have direct fields)
    const testStudent = await Student.findOne();
    if (!testStudent) {
      console.log('❌ No students found');
      return;
    }

    console.log(`\n📊 Testing dashboard for: ${testStudent.name}`);
    console.log(`   Student ID: ${testStudent.student_id}`);
    console.log(`   Email: ${testStudent.email}`);
    console.log(`   Branch: ${testStudent.branch}, Semester: ${testStudent.semester}`);

    // Test attendance summary
    console.log('\n📋 Testing attendance summary...');
    try {
      const attendanceSummary = await Attendance.getStudentAttendanceSummary(testStudent._id);
      console.log(`   ✅ Attendance summary retrieved: ${attendanceSummary.length} subjects`);
      
      if (attendanceSummary.length > 0) {
        const totalClasses = attendanceSummary.reduce((sum, subject) => sum + subject.total_classes, 0);
        const totalPresent = attendanceSummary.reduce((sum, subject) => sum + subject.present_classes + subject.late_classes, 0);
        const overallAttendance = totalClasses > 0 ? Math.round((totalPresent / totalClasses) * 100) : 0;
        
        console.log(`   📈 Overall Attendance: ${overallAttendance}%`);
        console.log(`   📚 Total Classes: ${totalClasses}`);
        console.log(`   ✅ Present: ${totalPresent}`);
        
        attendanceSummary.forEach(subject => {
          console.log(`      - ${subject.subject_code} (${subject.subject_name}): ${subject.attendance_percentage}%`);
        });
      }
    } catch (error) {
      console.log('   ❌ Attendance summary error:', error.message);
    }

    // Test recent attendance
    console.log('\n📅 Testing recent attendance...');
    try {
      const recentAttendance = await Attendance.find({ student_id: testStudent._id })
        .populate('subject_id', 'subject_code subject_name')
        .populate('faculty_id', 'user')
        .sort({ updatedAt: -1 })
        .limit(5);
      
      console.log(`   ✅ Recent attendance retrieved: ${recentAttendance.length} records`);
      recentAttendance.forEach(record => {
        console.log(`      - ${record.subject_id.subject_code}: ${record.present_classes}/${record.total_classes} classes`);
      });
    } catch (error) {
      console.log('   ❌ Recent attendance error:', error.message);
    }

    console.log('\n🎉 Dashboard test completed!');

  } catch (error) {
    console.error('❌ Test error:', error);
  } finally {
    await mongoose.disconnect();
  }
};

testDashboard();