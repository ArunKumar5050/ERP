const axios = require('axios');

async function testAttendanceEndpoints() {
  console.log('Testing Attendance Endpoints...\n');
  
  try {
    // Test the basic students endpoint
    console.log('1. Testing /api/faculty/students endpoint...');
    const studentsResponse = await axios.get('http://localhost:5000/api/faculty/students');
    console.log('   Status:', studentsResponse.status);
    console.log('   Success:', studentsResponse.data.success);
    console.log('   Student Count:', studentsResponse.data.count);
    if (studentsResponse.data.data && studentsResponse.data.data.length > 0) {
      console.log('   Sample Student:', studentsResponse.data.data[0].name);
    }
    console.log('   ✅ Basic students endpoint working\n');
  } catch (error) {
    console.log('   ❌ Basic students endpoint failed:', error.message, '\n');
  }
  
  try {
    // Test the students with attendance endpoint
    console.log('2. Testing /api/faculty/students/with-attendance endpoint...');
    const attendanceResponse = await axios.get('http://localhost:5000/api/faculty/students/with-attendance');
    console.log('   Status:', attendanceResponse.status);
    console.log('   Success:', attendanceResponse.data.success);
    console.log('   Student Count:', attendanceResponse.data.count);
    if (attendanceResponse.data.data && attendanceResponse.data.data.length > 0) {
      console.log('   Sample Student with Attendance:', {
        name: attendanceResponse.data.data[0].name,
        attendance: attendanceResponse.data.data[0].attendance,
        totalClasses: attendanceResponse.data.data[0].totalClasses
      });
    }
    console.log('   ✅ Students with attendance endpoint working\n');
  } catch (error) {
    console.log('   ❌ Students with attendance endpoint failed:', error.message, '\n');
    console.log('   This is expected if the user is not authenticated.\n');
  }
  
  console.log('Endpoint testing complete.');
}

testAttendanceEndpoints();