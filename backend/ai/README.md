# Dropout Prediction AI Module

## Overview
This module predicts student dropout risk using machine learning algorithms. It analyzes various factors including academic performance, attendance, and now fee payment status to identify at-risk students.

## Features
- Predicts student dropout risk using RandomForestClassifier
- Integrates with MongoDB to extract student data
- Provides risk scores and explanations for predictions
- Now includes fee payment status as a predictive factor

## Factors Considered for Dropout Prediction
1. **Attendance** - Class attendance percentage
2. **CGPA** - Cumulative Grade Point Average
3. **Backlogs** - Number of subjects with failing grades
4. **Assignments Submitted** - Number of assignments completed
5. **Fee Payment Status** - Ratio of pending fees to total fees

## Installation
1. Ensure Python 3.7+ is installed
2. Install required packages:
   ```
   pip install -r requirements.txt
   ```

## Usage
1. Run the training script to train the model:
   ```
   python dropout_prediction.py
   ```
   
   Or use the batch file:
   ```
   train_dropout_model.bat
   ```

2. The model will be saved as `dropout_model.pkl`

## API Endpoints
The Flask API provides the following endpoints:
- POST /train - Train the model with provided data
- POST /predict - Predict dropout risk for a student
- GET /feature-importance - Get feature importance scores

## Feature Importance
The model now considers the following features with their relative importance:
- Attendance (30%)
- CGPA (20%)
- Backlogs (20%)
- Assignments Submitted (10%)
- Pending Fee Ratio (20%)
- Derived features (ratios and combinations)

## Pending Fee Ratio
This new feature represents the ratio of pending fees to total fees for a student:
- Calculated as: `pending_amount / total_amount`
- Range: 0.0 (no pending fees) to 1.0 (all fees pending)
- Higher values indicate greater financial stress, which correlates with higher dropout risk

## Model Performance
The current model achieves approximately 70% accuracy with:
- 92% recall for non-dropout students
- 18% recall for dropout students
- The model is more conservative in predicting dropouts to minimize false positives

## Integration with ERP System
The Node.js service in `services/dropoutPredictionService.js` handles:
- Extracting student data from MongoDB
- Calculating the pending fee ratio from Fee documents
- Communicating with the Python AI service
- Providing results to the faculty portal