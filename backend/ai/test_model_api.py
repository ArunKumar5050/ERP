"""
Test script to verify the model API is working correctly
"""
import requests
import time

def test_model_api():
    """
    Test the model API endpoints
    """
    base_url = "http://localhost:5001"
    
    print("Testing Dropout Prediction Model API")
    print("=" * 40)
    
    # Test 1: Health check
    print("1. Testing health check endpoint...")
    try:
        response = requests.get(f"{base_url}/health")
        if response.status_code == 200:
            data = response.json()
            print(f"   Status: {data['status']}")
            print("   ✅ Health check passed")
        else:
            print(f"   ❌ Health check failed with status {response.status_code}")
    except Exception as e:
        print(f"   ❌ Health check failed: {str(e)}")
    
    # Test 2: Feature importance (if model is loaded)
    print("\n2. Testing feature importance endpoint...")
    try:
        response = requests.get(f"{base_url}/feature-importance")
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                print("   ✅ Feature importance retrieved")
                # Show top 3 features
                features = data.get('data', {})
                sorted_features = sorted(features.items(), key=lambda x: x[1], reverse=True)
                print("   Top features:")
                for feature, importance in sorted_features[:3]:
                    print(f"     {feature}: {importance:.3f}")
            else:
                print(f"   ⚠️  Feature importance error: {data.get('error', 'Unknown error')}")
        else:
            print(f"   ⚠️  Feature importance failed with status {response.status_code}")
    except Exception as e:
        print(f"   ⚠️  Feature importance test failed: {str(e)}")
    
    # Test 3: Prediction with sample data
    print("\n3. Testing prediction endpoint...")
    sample_data = {
        "attendance": 75.0,
        "cgpa": 3.2,
        "backlogs": 1,
        "assignments_submitted": 8
    }
    
    try:
        response = requests.post(f"{base_url}/predict", json=sample_data)
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                result = data.get('data', {})
                print(f"   ✅ Prediction successful")
                print(f"   Risk Score: {result.get('risk_score', 0):.3f}")
                print(f"   Risk Level: {result.get('risk_level', 'Unknown')}")
                print("   Top Reasons:")
                for i, reason in enumerate(result.get('top_reasons', [])[:3], 1):
                    print(f"     {i}. {reason.get('factor', 'Unknown')}: {reason.get('description', '')}")
            else:
                print(f"   ❌ Prediction error: {data.get('error', 'Unknown error')}")
        else:
            print(f"   ❌ Prediction failed with status {response.status_code}")
    except Exception as e:
        print(f"   ❌ Prediction test failed: {str(e)}")
    
    # Test 4: Training endpoint (with sample data)
    print("\n4. Testing training endpoint...")
    # Generate sample training data
    training_data = []
    import numpy as np
    np.random.seed(42)
    
    for i in range(100):
        attendance = np.random.normal(75, 15)
        attendance = max(0, min(100, attendance))
        
        cgpa = np.random.normal(7.0, 1.5)
        cgpa = max(0, min(10, cgpa))
        
        backlogs = max(0, np.random.poisson(1))
        assignments = max(0, np.random.poisson(8))
        
        # Create dropout label
        dropout_prob = (
            (100 - attendance) / 100 * 0.4 +
            (10 - cgpa) / 10 * 0.3 +
            min(backlogs / 5, 1) * 0.3
        )
        dropout = 1 if np.random.random() < dropout_prob else 0
        
        training_data.append({
            "attendance": attendance,
            "cgpa": cgpa,
            "backlogs": backlogs,
            "assignments_submitted": assignments,
            "dropout": dropout
        })
    
    try:
        response = requests.post(f"{base_url}/train", json=training_data)
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                print("   ✅ Training successful")
                print(f"   Message: {data.get('message', '')}")
            else:
                print(f"   ⚠️  Training error: {data.get('error', 'Unknown error')}")
        else:
            print(f"   ⚠️  Training failed with status {response.status_code}")
    except Exception as e:
        print(f"   ⚠️  Training test failed: {str(e)}")
    
    print("\n" + "=" * 40)
    print("API Testing Complete")

if __name__ == "__main__":
    test_model_api()