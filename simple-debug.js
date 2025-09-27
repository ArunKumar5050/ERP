// Simple debug script to check the data structure
async function debugAPI() {
  try {
    // Login
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
    if (!loginData.success) {
      console.log('Login failed');
      return;
    }

    const token = loginData.data.token;
    console.log('Login successful');

    // Get faculty profile to check subjects
    console.log('Fetching faculty profile...');
    const profileResponse = await fetch('http://localhost:5000/api/auth/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    const profileData = await profileResponse.json();
    console.log('Faculty subjects:', profileData.data.profile.subjects.map(s => ({
      code: s.subjectCode,
      name: s.subjectName
    })));

    // Check a few attendance records directly
    console.log('Checking attendance collection structure...');
    // We can't directly access the database, but we can check if there are any attendance records
    // by trying to access a specific endpoint or by checking the seeder data
    
  } catch (error) {
    console.error('Error:', error);
  }
}

debugAPI().then(() => console.log('Debug complete'));