const http = require('http');

// Test health endpoint
const healthOptions = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/health',
  method: 'GET'
};

console.log('Testing health endpoint...');

const healthReq = http.request(healthOptions, res => {
  console.log(`Health Status: ${res.statusCode}`);
  res.on('data', d => {
    process.stdout.write(d);
  });
});

healthReq.on('error', error => {
  console.error('Health check error:', error);
});

healthReq.end();

// Test login and fee endpoint
setTimeout(() => {
  console.log('\n\nTesting login...');
  
  const loginOptions = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const loginReq = http.request(loginOptions, res => {
    console.log(`Login Status: ${res.statusCode}`);
    let data = '';
    res.on('data', chunk => {
      data += chunk;
    });
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        console.log('Login response:', response);
        
        if (response.success && response.data.token) {
          console.log('\nTesting fee endpoint...');
          
          const feeOptions = {
            hostname: 'localhost',
            port: 5000,
            path: '/api/fee/student',
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${response.data.token}`
            }
          };

          const feeReq = http.request(feeOptions, res => {
            console.log(`Fee Status: ${res.statusCode}`);
            let feeData = '';
            res.on('data', chunk => {
              feeData += chunk;
            });
            res.on('end', () => {
              try {
                const feeResponse = JSON.parse(feeData);
                console.log('Fee response:', JSON.stringify(feeResponse, null, 2));
              } catch (e) {
                console.error('Error parsing fee response:', e);
                console.log('Raw fee data:', feeData);
              }
            });
          });

          feeReq.on('error', error => {
            console.error('Fee request error:', error);
          });

          feeReq.end();
        }
      } catch (e) {
        console.error('Error parsing login response:', e);
        console.log('Raw login data:', data);
      }
    });
  });

  loginReq.on('error', error => {
    console.error('Login request error:', error);
  });

  // Send login data
  const loginData = JSON.stringify({
    username: 'student002',
    password: 'Password123'
  });

  loginReq.write(loginData);
  loginReq.end();
}, 2000);