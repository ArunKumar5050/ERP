const axios = require('axios');

async function testFacultyEndpoints() {
  console.log('Testing Faculty Endpoints...\n');
  
  try {
    // Test the faculty students endpoint
    console.log('1. Testing /api/faculty/students endpoint...');
    const studentsResponse = await axios.get('http://localhost:5000/api/faculty/students');
    console.log('   Status:', studentsResponse.status);
    console.log('   Success:', studentsResponse.data.success);
    console.log('   Student Count:', studentsResponse.data.count);
    if (studentsResponse.data.data && studentsResponse.data.data.length > 0) {
      console.log('   Sample Student:', studentsResponse.data.data[0].name);
    }
    console.log('   ✅ Faculty students endpoint working\n');
  } catch (error) {
    console.log('   ❌ Faculty students endpoint failed:', error.message, '\n');
  }
  
  try {
    // Test the dropout at-risk endpoint
    console.log('2. Testing /api/dropout/at-risk endpoint...');
    const atRiskResponse = await axios.get('http://localhost:5000/api/dropout/at-risk');
    console.log('   Status:', atRiskResponse.status);
    console.log('   Success:', atRiskResponse.data.success);
    console.log('   At-Risk Count:', atRiskResponse.data.count);
    if (atRiskResponse.data.data && atRiskResponse.data.data.length > 0) {
      console.log('   Sample At-Risk Student:', atRiskResponse.data.data[0].name);
    }
    console.log('   ✅ Dropout at-risk endpoint working\n');
  } catch (error) {
    console.log('   ❌ Dropout at-risk endpoint failed:', error.message, '\n');
    console.log('   This is expected if the AI service is not running.\n');
  }
  
  console.log('Endpoint testing complete.');
}

testFacultyEndpoints();