// Using built-in fetch for Node.js 18+
async function testAPI() {
  try {
    // First, let's login to get a token
    console.log('Logging in...');
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'prof.agarwal',
        password: 'Password123'
      })
    });

    const loginData = await loginResponse.json();
    console.log('Login response:', loginData);

    if (!loginData.success) {
      console.log('Login failed');
      return;
    }

    const token = loginData.data.token;
    console.log('Token received:', token.substring(0, 20) + '...');

    // Test the faculty dashboard to see faculty subjects
    console.log('Fetching faculty dashboard...');
    const dashboardResponse = await fetch('http://localhost:5000/api/faculty/dashboard', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    const dashboardData = await dashboardResponse.json();
    console.log('Faculty dashboard response:', JSON.stringify(dashboardData, null, 2));

    // Now test the faculty students with attendance endpoint
    console.log('Fetching students with attendance...');
    const studentsResponse = await fetch('http://localhost:5000/api/faculty/students/with-attendance', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    const studentsData = await studentsResponse.json();
    console.log('Students with attendance response:', JSON.stringify(studentsData, null, 2));

  } catch (error) {
    console.error('Error testing API:', error);
  }
}

testAPI();