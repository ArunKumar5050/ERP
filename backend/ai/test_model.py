"""
Test script for the dropout prediction model
"""
import pandas as pd
import numpy as np
from dropout_prediction import DropoutPredictionModel, generate_sample_data

def test_model():
    print("=== Dropout Prediction Model Test ===")
    
    # Create model instance
    model = DropoutPredictionModel('test_model.pkl')
    
    # Generate sample data
    print("Generating sample data...")
    data = generate_sample_data(100)
    print(f"Generated {len(data)} sample records")
    
    # Train model
    print("Training model...")
    model.train_model(data)
    
    # Test prediction
    print("\nTesting prediction with sample student...")
    sample_student = {
        'attendance': 65.0,
        'cgpa': 2.8,
        'backlogs': 3,
        'assignments_submitted': 5
    }
    
    result = model.predict_dropout_risk(sample_student)
    
    print(f"Risk Score: {result['risk_score']:.3f}")
    print(f"Risk Level: {result['risk_level']}")
    print("Top Reasons:")
    for i, reason in enumerate(result['top_reasons'], 1):
        print(f"  {i}. {reason['factor']}: {reason['description']} (Impact: {reason['impact']})")
    
    # Test with another student
    print("\nTesting with high-performing student...")
    good_student = {
        'attendance': 95.0,
        'cgpa': 8.5,
        'backlogs': 0,
        'assignments_submitted': 12
    }
    
    result = model.predict_dropout_risk(good_student)
    
    print(f"Risk Score: {result['risk_score']:.3f}")
    print(f"Risk Level: {result['risk_level']}")
    print("Top Reasons:")
    for i, reason in enumerate(result['top_reasons'], 1):
        print(f"  {i}. {reason['factor']}: {reason['description']} (Impact: {reason['impact']})")
    
    print("\n=== Test Complete ===")

if __name__ == "__main__":
    test_model()