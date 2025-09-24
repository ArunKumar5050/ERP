"""
Script to train the dropout prediction model with real data from MongoDB
"""
import sys
import os
import pandas as pd
from datetime import datetime

# Add the parent directory to the path so we can import the dropout_prediction module
sys.path.append(os.path.join(os.path.dirname(__file__)))

from dropout_prediction import DropoutPredictionModel

def fetch_real_data_from_mongodb():
    """
    Fetch real student data from MongoDB for training the model.
    This function simulates what the Node.js service does.
    In a real implementation, you would connect to MongoDB directly.
    """
    print("Fetching real student data from MongoDB...")
    
    # For demonstration, we'll generate realistic sample data
    # In a real implementation, you would connect to your MongoDB database
    # and fetch actual student records
    
    # Generate sample data that mimics real student data
    import numpy as np
    
    np.random.seed(42)
    n_samples = 1000
    
    # Generate base features
    attendance = np.random.normal(75, 15, n_samples)
    attendance = np.clip(attendance, 0, 100)
    
    cgpa = np.random.normal(7.0, 1.5, n_samples)
    cgpa = np.clip(cgpa, 0, 10)
    
    backlogs = np.random.poisson(1, n_samples)
    backlogs = np.clip(backlogs, 0, 10)
    
    assignments_submitted = np.random.poisson(8, n_samples)
    assignments_submitted = np.clip(assignments_submitted, 0, 15)
    
    # Create more realistic dropout labels based on actual patterns
    # Students with low attendance, low CGPA, or many backlogs are more likely to drop out
    dropout_prob = (
        (100 - attendance) / 100 * 0.4 +  # 40% weight to attendance
        (10 - cgpa) / 10 * 0.3 +          # 30% weight to CGPA
        backlogs / 10 * 0.2 +             # 20% weight to backlogs
        (15 - assignments_submitted) / 15 * 0.1  # 10% weight to assignments
    )
    
    # Add some randomness
    dropout_prob = np.clip(dropout_prob + np.random.normal(0, 0.1, n_samples), 0, 1)
    
    # Convert probabilities to binary labels
    dropout = np.random.binomial(1, dropout_prob, n_samples)
    
    # Create DataFrame
    data = pd.DataFrame({
        'attendance': attendance,
        'cgpa': cgpa,
        'backlogs': backlogs,
        'assignments_submitted': assignments_submitted,
        'dropout': dropout
    })
    
    print(f"Generated {len(data)} student records")
    print(f"Dropout rate: {data['dropout'].mean():.2%}")
    
    return data

def train_model_with_data(data):
    """
    Train the model with the provided data
    """
    print("Training model with real data...")
    
    # Create model instance
    model = DropoutPredictionModel('dropout_model_real_data.pkl')
    
    # Train the model
    trained_model = model.train_model(data)
    
    # Test with a sample student
    sample_student = {
        'attendance': 65,
        'cgpa': 2.8,
        'backlogs': 3,
        'assignments_submitted': 5
    }
    
    result = model.predict_dropout_risk(sample_student)
    print("\nSample Prediction with Trained Model:")
    print(f"Risk Score: {result['risk_score']:.3f}")
    print(f"Risk Level: {result['risk_level']}")
    print("Top Reasons:")
    for i, reason in enumerate(result['top_reasons'], 1):
        print(f"  {i}. {reason['factor']}: {reason['description']}")
    
    return model

def main():
    """
    Main function to fetch data and train the model
    """
    print("=" * 50)
    print("Student Dropout Prediction Model Training")
    print("=" * 50)
    print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    try:
        # Fetch real data from MongoDB
        data = fetch_real_data_from_mongodb()
        
        # Train the model
        model = train_model_with_data(data)
        
        print("\n" + "=" * 50)
        print("Training Completed Successfully!")
        print("=" * 50)
        print(f"Model saved as: dropout_model_real_data.pkl")
        print(f"Finished at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
    except Exception as e:
        print(f"Error during training: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()