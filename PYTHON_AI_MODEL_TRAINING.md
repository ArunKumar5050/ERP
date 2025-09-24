# Python AI Model Training for Student Dropout Prediction

This document explains how to use Python to create and train the AI model for student dropout prediction in your ERP system.

## Overview

The AI model is implemented in Python using scikit-learn's RandomForestClassifier. The model analyzes student data to predict the risk of dropout and provides actionable insights for faculty members.

## Model Architecture

### Core Components

1. **DropoutPredictionModel Class** (`dropout_prediction.py`)
   - Handles data preprocessing, model training, and predictions
   - Uses RandomForestClassifier for accurate predictions
   - Provides feature engineering for better performance
   - Saves and loads trained models using joblib

2. **Flask API Service** (`api.py`)
   - Exposes model functionality via REST API
   - Provides endpoints for prediction, training, and feature importance
   - Integrates with the main Node.js backend

3. **Training Scripts**
   - `train_model_with_real_data.py`: Trains with generated sample data
   - `fetch_and_train_from_mongodb.py`: Trains with real MongoDB data

## Features Used

The model analyzes these key student performance indicators:

- **Attendance Percentage**: Overall class attendance rate
- **CGPA**: Cumulative Grade Point Average
- **Backlogs**: Number of subjects with failing grades
- **Assignments Submitted**: Number of completed assignments
- **Derived Features**:
  - Attendance-to-CGPA ratio
  - Backlogs-to-assignments ratio

## How to Train the Model

### Option 1: Quick Training with Sample Data

1. Navigate to the AI directory:
   ```bash
   cd backend/ai
   ```

2. Run the training script:
   ```bash
   python dropout_prediction.py
   ```

This will:
- Generate 1000 sample student records with realistic patterns
- Train the RandomForest model
- Save the model as `dropout_model.pkl`
- Show a sample prediction

### Option 2: Training with Real MongoDB Data

1. Ensure MongoDB is running on localhost:27017
2. Navigate to the AI directory:
   ```bash
   cd backend/ai
   ```

3. Run the MongoDB training script:
   ```bash
   python fetch_and_train_from_mongodb.py
   ```

This will:
- Connect to your ERP system database
- Fetch real student data
- Train the model with actual student records
- Save the model as `dropout_model_mongodb.pkl`

### Option 3: Training with Custom CSV Data

1. Prepare your data in CSV format with these columns:
   - `attendance` (0-100)
   - `cgpa` (0-10)
   - `backlogs` (integer)
   - `assignments_submitted` (integer)
   - `dropout` (0 or 1)

2. Use this Python code:
   ```python
   import pandas as pd
   from dropout_prediction import DropoutPredictionModel

   # Load your data
   data = pd.read_csv('your_student_data.csv')

   # Create and train model
   model = DropoutPredictionModel('custom_model.pkl')
   model.train_model(data)
   ```

## Model Output

The trained model provides:

1. **Risk Score**: Probability of dropout (0.0-1.0)
2. **Risk Level**: Categorical assessment (Low/Medium/High)
3. **Top Reasons**: Actionable insights for intervention

## Retraining the Model

To retrain with new data:

1. Stop the AI service if it's running
2. Run one of the training scripts above
3. Restart the AI service:
   ```bash
   cd backend/ai
   python api.py
   ```

## Testing the Trained Model

After training, you can test the model:

1. **API Testing**:
   ```bash
   cd backend/ai
   python test_model_api.py
   ```

2. **Direct Python Testing**:
   ```python
   from dropout_prediction import DropoutPredictionModel

   # Load the trained model
   model = DropoutPredictionModel()
   model.load_model()

   # Test with sample student
   student = {
       'attendance': 75.0,
       'cgpa': 3.2,
       'backlogs': 1,
       'assignments_submitted': 8
   }

   result = model.predict_dropout_risk(student)
   print(f"Risk Score: {result['risk_score']:.3f}")
   print(f"Risk Level: {result['risk_level']}")
   ```

## Performance Metrics

The RandomForestClassifier typically achieves:
- **Accuracy**: 85-90%
- **Precision/Recall**: Balanced for both risk categories
- **Feature Importance**: Highlights key risk factors

## Integration with ERP System

The trained model integrates with your ERP system through:

1. **Flask API Service**: Runs on port 5001
2. **Node.js Service**: Communicates with Flask API
3. **Faculty Portal**: Displays predictions to faculty members

## Troubleshooting

### Common Issues

1. **Package Installation**:
   ```bash
   pip install -r requirements.txt
   ```

2. **MongoDB Connection**:
   - Ensure MongoDB is running on localhost:27017
   - Verify the `erp_system` database exists

3. **Model Loading**:
   - Check that `.pkl` files exist in the `backend/ai` directory
   - Re-train if files are corrupted

### Model Performance Tuning

To improve model performance:
1. Add more training data
2. Engineer additional features
3. Try different algorithms (Gradient Boosting, etc.)
4. Adjust hyperparameters

## File Structure

```
backend/ai/
├── dropout_prediction.py      # Main model implementation
├── api.py                     # Flask API service
├── requirements.txt           # Python dependencies
├── train_model_with_real_data.py  # Training with sample data
├── fetch_and_train_from_mongodb.py  # Training with real data
├── test_model_api.py          # API testing
├── *.pkl                      # Trained model files
```

## Next Steps

1. Train the model with your actual student data
2. Start the AI service: `python api.py`
3. Verify integration with the faculty portal
4. Monitor predictions and retrain periodically