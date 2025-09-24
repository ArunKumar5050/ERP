/**
 * End-to-end test for the dropout prediction system
 */
const axios = require('axios');

// Test the main backend API
async function testBackendAPI() {
  console.log('Testing Main Backend API...');
  
  try {
    // Test health check
    const healthResponse = await axios.get('http://localhost:5000/api/health');
    console.log('✅ Main Backend Health Check:', healthResponse.data.message);
    
    // Test dropout API endpoints (these will fail if AI service is not running)
    try {
      const featureImportance = await axios.get('http://localhost:5000/api/dropout/feature-importance');
      console.log('✅ Dropout Feature Importance API accessible');
    } catch (error) {
      console.log('⚠️  Dropout Feature Importance API not accessible (AI service may not be running)');
    }
    
  } catch (error) {
    console.log('❌ Main Backend API test failed:', error.message);
  }
}

// Test the AI service API
async function testAIService() {
  console.log('\nTesting AI Service API...');
  
  try {
    // Test health check
    const healthResponse = await axios.get('http://localhost:5001/health');
    console.log('✅ AI Service Health Check:', healthResponse.data.message);
    
    // Test prediction with sample data
    const sampleStudent = {
      attendance: 75.0,
      cgpa: 3.2,
      backlogs: 1,
      assignments_submitted: 8
    };
    
    const predictionResponse = await axios.post('http://localhost:5001/predict', sampleStudent);
    console.log('✅ AI Prediction API working');
    console.log('   Sample Prediction Risk Score:', predictionResponse.data.data.risk_score.toFixed(3));
    console.log('   Sample Prediction Risk Level:', predictionResponse.data.data.risk_level);
    
  } catch (error) {
    console.log('❌ AI Service API test failed:', error.message);
  }
}

// Run all tests
async function runAllTests() {
  console.log('=== End-to-End Test for Dropout Prediction System ===\n');
  
  await testBackendAPI();
  await testAIService();
  
  console.log('\n=== Test Complete ===');
}

runAllTests();