# AI Model Training Instructions

This document provides instructions on how to train the student dropout prediction model using Python.

## Prerequisites

1. Python 3.7 or higher
2. MongoDB running on localhost:27017
3. Access to the ERP system database

## Installation

1. Install the required Python packages:
   ```
   pip install -r backend/ai/requirements.txt
   ```

   Or use the provided batch script:
   ```
   train_dropout_model.bat
   ```

## Training Options

### 1. Quick Training with Sample Data

For testing purposes, you can quickly train the model with sample data:

```bash
cd backend/ai
python dropout_prediction.py
```

This will:
- Generate 1000 sample student records
- Train the RandomForestClassifier model
- Save the trained model as `dropout_model.pkl`
- Show a sample prediction

### 2. Training with Real Data from MongoDB

To train the model with real student data from your MongoDB database:

```bash
cd backend/ai
python fetch_and_train_from_mongodb.py
```

This script will:
- Connect to MongoDB on localhost:27017
- Fetch student data from the `erp_system` database
- Extract features from student records
- Train the model with real data
- Save the trained model as `dropout_model_mongodb.pkl`

### 3. Training with Custom Data

You can also train the model with your own CSV data:

1. Prepare a CSV file with the following columns:
   - `attendance`: Attendance percentage (0-100)
   - `cgpa`: Cumulative Grade Point Average (0-10)
   - `backlogs`: Number of backlogs
   - `assignments_submitted`: Number of assignments submitted
   - `dropout`: Target label (0 = not at risk, 1 = at risk)

2. Use the following Python code to train:

```python
import pandas as pd
from dropout_prediction import DropoutPredictionModel

# Load your data
data = pd.read_csv('your_data.csv')

# Create and train model
model = DropoutPredictionModel('your_model_name.pkl')
model.train_model(data)

# Test prediction
sample_student = {
    'attendance': 75,
    'cgpa': 3.2,
    'backlogs': 1,
    'assignments_submitted': 8
}

result = model.predict_dropout_risk(sample_student)
print(f"Risk Score: {result['risk_score']:.3f}")
```

## Model Features

The model uses the following features:
- **attendance**: Student attendance percentage
- **cgpa**: Cumulative Grade Point Average
- **backlogs**: Number of subjects with failing grades
- **assignments_submitted**: Number of assignments completed
- **attendance_cgpa_ratio**: Derived feature (attendance / (cgpa + 1))
- **backlogs_assignments_ratio**: Derived feature (backlogs / (assignments_submitted + 1))

## Model Output

The trained model provides:
- **risk_score**: Probability of dropout (0-1)
- **risk_level**: Categorical risk level (Low/Medium/High)
- **top_reasons**: List of contributing factors

## Retraining the Model

To retrain the model with new data:

1. Ensure the AI service is not running (stop the Flask server)
2. Run one of the training scripts above
3. Restart the AI service:
   ```
   cd backend/ai
   python api.py
   ```

## Model Performance

The RandomForestClassifier typically achieves good performance with:
- Accuracy: ~85-90%
- Precision/Recall balanced for both classes
- Feature importance highlighting key risk factors

## Troubleshooting

### MongoDB Connection Issues

If you encounter connection issues:
1. Ensure MongoDB is running on localhost:27017
2. Check that the `erp_system` database exists
3. Verify that the collections (`students`, `academicdetails`, `attendance`) contain data

### Package Installation Issues

If you encounter package installation issues:
1. Update pip: `pip install --upgrade pip`
2. Install packages individually:
   ```
   pip install pandas numpy scikit-learn joblib flask
   ```

### Model Loading Issues

If the model fails to load:
1. Ensure the `.pkl` file exists in the `backend/ai` directory
2. Check file permissions
3. Re-train the model if the file is corrupted

## File Locations

- **Model files**: `backend/ai/*.pkl`
- **Training scripts**: `backend/ai/*.py`
- **API service**: `backend/ai/api.py`
- **Requirements**: `backend/ai/requirements.txt`