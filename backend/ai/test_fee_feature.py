"""
Test script to verify the fee details feature in the dropout prediction model
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from dropout_prediction import DropoutPredictionModel
import numpy as np

def test_fee_feature():
    """Test the fee details feature"""
    print("Testing Fee Details Feature in Dropout Prediction Model")
    print("=" * 50)
    
    # Create model instance
    model = DropoutPredictionModel()
    
    # Load existing model or train a new one with sample data
    if not model.load_model():
        print("No existing model found. Generating sample data and training...")
        # Generate sample data that includes fee details
        sample_data = generate_sample_data_with_fees()
        model.train_model(sample_data)
    
    # Test cases with different fee scenarios
    test_cases = [
        {
            'attendance': 90,
            'cgpa': 8.5,
            'backlogs': 0,
            'assignments_submitted': 12,
            'pending_fee_ratio': 0.0  # No pending fees
        },
        {
            'attendance': 75,
            'cgpa': 7.0,
            'backlogs': 1,
            'assignments_submitted': 8,
            'pending_fee_ratio': 0.3  # 30% of fees pending
        },
        {
            'attendance': 60,
            'cgpa': 5.5,
            'backlogs': 3,
            'assignments_submitted': 5,
            'pending_fee_ratio': 0.7  # 70% of fees pending
        },
        {
            'attendance': 40,
            'cgpa': 3.0,
            'backlogs': 5,
            'assignments_submitted': 2,
            'pending_fee_ratio': 0.9  # 90% of fees pending
        }
    ]
    
    test_names = [
        'Good Student - No Pending Fees',
        'Average Student - Some Pending Fees',
        'At-Risk Student - High Pending Fees',
        'High Risk Student - All Factors Poor'
    ]
    
    print("\nPrediction Results:")
    print("-" * 30)
    
    for i, case in enumerate(test_cases):
        result = model.predict_dropout_risk(case)
        print(f"\n{test_names[i]}:")
        print(f"  Risk Score: {result['risk_score']:.2f}")
        print(f"  Risk Level: {result['risk_level']}")
        print("  Top Reasons:")
        for j, reason in enumerate(result['top_reasons'], 1):
            print(f"    {j}. {reason['factor']}: {reason['description']}")

def generate_sample_data_with_fees(n_samples=1000):
    """
    Generate sample data for training the model that includes fee details
    """
    np.random.seed(42)
    
    # Generate base features
    attendance = np.random.normal(75, 15, n_samples)
    attendance = np.clip(attendance, 0, 100)
    
    cgpa = np.random.normal(7.0, 1.5, n_samples)
    cgpa = np.clip(cgpa, 0, 10)
    
    backlogs = np.random.poisson(1, n_samples)
    backlogs = np.clip(backlogs, 0, 10)
    
    assignments_submitted = np.random.poisson(8, n_samples)
    assignments_submitted = np.clip(assignments_submitted, 0, 15)
    
    # Generate fee data
    pending_fee_ratio = np.random.beta(2, 5, n_samples)  # Most students have low pending fees
    pending_fee_ratio = np.clip(pending_fee_ratio, 0, 1)
    
    # Create dropout labels based on realistic patterns
    # Higher probability of dropout with lower attendance, CGPA, more backlogs, higher pending fees
    dropout_prob = (
        (100 - attendance) / 100 * 0.3 +
        (10 - cgpa) / 10 * 0.2 +
        backlogs / 10 * 0.2 +
        (15 - assignments_submitted) / 15 * 0.1 +
        pending_fee_ratio * 0.2  # 20% weight to pending fees
    )
    
    dropout = np.random.binomial(1, dropout_prob, n_samples)
    
    # Create DataFrame
    import pandas as pd
    data = pd.DataFrame({
        'attendance': attendance,
        'cgpa': cgpa,
        'backlogs': backlogs,
        'assignments_submitted': assignments_submitted,
        'pending_fee_ratio': pending_fee_ratio,
        'dropout': dropout
    })
    
    return data

if __name__ == "__main__":
    test_fee_feature()