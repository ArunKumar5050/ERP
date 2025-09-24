# AI Dropout Prediction Module for ERP System

## Overview

This document describes the implementation of an AI module that predicts student dropout risk using machine learning algorithms and integrates the results into the faculty portal of your existing ERP system.

## System Architecture

The module consists of the following components:

1. **Python ML Service** - Handles model training and predictions
2. **Node.js Service** - Integrates with MongoDB and orchestrates data flow
3. **REST API Endpoints** - Expose functionality to the frontend
4. **Frontend Components** - Display predictions in the faculty portal

## Implementation Details

### 1. Machine Learning Model

The system uses a RandomForestClassifier to predict student dropout risk based on:
- Attendance percentage
- CGPA (Cumulative Grade Point Average)
- Number of backlogs
- Assignments submitted

#### Features Engineered:
- Attendance-to-CGPA ratio
- Backlogs-to-assignments ratio

#### Output:
- Risk score (0-1)
- Risk level (Low/Medium/High)
- Top contributing factors

### 2. Backend Integration

#### New Files Created:
- `backend/ai/` - Directory containing all AI components
- `backend/services/dropoutPredictionService.js` - Node.js service for data processing
- `backend/routes/dropout.js` - API endpoints for dropout prediction
- Updates to `backend/server.js` to include new routes

#### API Endpoints Added:
- `GET /api/dropout/at-risk` - Get list of at-risk students
- `POST /api/dropout/predict/:studentId` - Predict risk for specific student
- `POST /api/dropout/train` - Retrain the model
- `GET /api/dropout/feature-importance` - Get feature importance

### 3. Frontend Integration

#### New Files Created:
- `frontend/src/components/FacultyAtRisk.jsx` - Component to display at-risk students
- Updates to `frontend/src/components/FacultyHeader.jsx` - Added navigation tab
- Updates to `frontend/src/config/api.js` - Added API endpoints
- Updates to `frontend/src/App.jsx` - Added route (already existed)

#### UI Features:
- Color-coded risk indicators (red=high, orange=medium, green=low)
- Expandable student details with explanations
- Direct link from dashboard to at-risk students page

## Setup Instructions

### Prerequisites
1. Python 3.7+
2. Node.js 14+
3. MongoDB instance running on localhost:27017

### Installation Steps

1. **Install Python Dependencies**:
   ```bash
   cd backend/ai
   pip install -r requirements.txt
   ```

2. **Start the AI Service**:
   ```bash
   cd backend/ai
   python api.py
   ```
   The service will run on `http://localhost:5001`

3. **Start the Main ERP Backend** (if not already running):
   ```bash
   cd backend
   npm start
   ```

4. **Start the Frontend** (if not already running):
   ```bash
   cd frontend
   npm run dev
   ```

### Alternative Setup
Use the provided batch script:
```bash
start-ai-service.bat
```

## Usage Guide

### For Faculty Users:
1. Log into the faculty portal
2. Navigate to "At-Risk Students" tab
3. View the list of students identified as at risk
4. Click "View Details" for explanations of risk factors
5. Use this information for early intervention

### For Administrators:
1. Retrain the model with updated data using the `/api/dropout/train` endpoint
2. Monitor model performance through the feature importance endpoint

## Retraining the Model

The model can be retrained at any time to incorporate new data:

1. **Automatic Retraining**: Call the `/api/dropout/train` endpoint
2. **Manual Retraining**: Run `python dropout_prediction.py` in the `backend/ai` directory

## Testing

### Test Scripts Included:
- `test-dropout-prediction.js` - Tests Node.js service integration
- `backend/ai/test_model.py` - Tests Python model functionality

### Running Tests:
```bash
# Test Node.js integration
node test-dropout-prediction.js

# Test Python model
cd backend/ai
python test_model.py
```

## File Structure

```
ERP/
├── backend/
│   ├── ai/
│   │   ├── dropout_prediction.py    # ML model implementation
│   │   ├── api.py                   # Flask API server
│   │   ├── requirements.txt         # Python dependencies
│   │   ├── test_model.py            # Test script
│   │   └── README.md                # AI module documentation
│   ├── services/
│   │   └── dropoutPredictionService.js  # Node.js service
│   ├── routes/
│   │   └── dropout.js               # API endpoints
│   └── server.js                    # Updated main server
├── frontend/
│   └── src/
│       └── components/
│           └── FacultyAtRisk.jsx    # Frontend component
├── test-dropout-prediction.js       # Integration test
├── start-ai-service.bat             # Startup script
└── DROPOUT_PREDICTION_MODULE.md     # This document
```

## Key Features Implemented

1. **Modular Design**: Easy to maintain and extend
2. **Real-time Predictions**: Instant risk assessment for students
3. **Explainable AI**: Clear reasons for predictions
4. **User-Friendly Interface**: Color-coded risk levels and detailed explanations
5. **Retraining Capability**: Model can be updated with new data
6. **Integration Ready**: Seamlessly works with existing ERP system

## Future Enhancements

1. Add more sophisticated models (e.g., Gradient Boosting)
2. Include more features (family income, distance from campus, etc.)
3. Add automated alerts for at-risk students
4. Implement model versioning
5. Add performance monitoring dashboard

## Troubleshooting

### Common Issues:

1. **Python dependencies not found**:
   - Ensure you're in the correct directory
   - Run `pip install -r requirements.txt`

2. **Connection errors**:
   - Verify MongoDB is running on localhost:27017
   - Check that the AI service is running on port 5001

3. **Model not found**:
   - Run the training script first to generate the model file

### Support:
For issues with the implementation, please check:
- Python service logs (console output)
- Node.js backend logs
- Browser developer console for frontend errors