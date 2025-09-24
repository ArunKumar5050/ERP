# Dropout Prediction AI Module with Fee Details Implementation

## Overview
This document summarizes the implementation of the fee details feature in the dropout prediction AI module for the ERP system.

## Features Added

### 1. Fee Details as Dropout Prediction Factor
- **New Feature**: `pending_fee_ratio` - Ratio of pending fees to total fees
- **Weight**: 20% in the dropout probability calculation
- **Range**: 0.0 (no pending fees) to 1.0 (all fees pending)
- **Impact**: Higher pending fee ratios correlate with higher dropout risk

### 2. Backend Service Updates
- Modified `dropoutPredictionService.js` to extract fee data from MongoDB
- Added calculation of `pending_fee_ratio` using the Fee model's `getStudentFeeSummary` method
- Updated the `calculateDropoutLabel` function to include fee details in heuristic

### 3. AI Model Updates
- Updated `dropout_prediction.py` to include `pending_fee_ratio` in feature engineering
- Modified preprocessing to handle the new feature
- Updated sample data generation to include fee data
- Enhanced explanation system to provide fee-related reasons

### 4. API Updates
- Modified `api.py` to require `pending_fee_ratio` in prediction requests
- Updated training endpoint to validate the new feature

### 5. Documentation and Testing
- Updated README.md with information about the fee details feature
- Created requirements.txt for Python dependencies
- Added test_fee_feature.py to verify the new functionality

## Implementation Details

### Data Extraction
The system now extracts fee information from the Fee collection in MongoDB:
```javascript
// Get fee data
const feeSummary = await Fee.getStudentFeeSummary(studentId);
const pendingFeeRatio = feeSummary.totalFees > 0 ? 
  feeSummary.totalPending / feeSummary.totalFees : 0;
```

### Feature Engineering
The Python model now includes the pending fee ratio in its feature set:
```python
feature_columns = ['attendance', 'cgpa', 'backlogs', 'assignments_submitted', 
                  'pending_fee_ratio', 'attendance_cgpa_ratio', 'backlogs_assignments_ratio']
```

### Risk Explanation
The system now provides fee-related explanations:
```python
# Check fee pending ratio
if student_data.get('pending_fee_ratio', 0) > 0.3:
    reasons.append({
        'factor': 'High Pending Fees',
        'description': f"Student has {student_data.get('pending_fee_ratio', 0)*100:.1f}% of fees pending",
        'impact': 'Medium'
    })
```

## Usage

### Training the Model
1. Run the training script:
   ```
   python dropout_prediction.py
   ```
   
   Or use the batch file:
   ```
   train_dropout_model.bat
   ```

### Making Predictions
When making predictions, include the `pending_fee_ratio` in the student data:
```json
{
  "attendance": 75,
  "cgpa": 7.0,
  "backlogs": 1,
  "assignments_submitted": 8,
  "pending_fee_ratio": 0.3
}
```

## Testing
Run the test script to verify the fee feature is working:
```
python test_fee_feature.py
```

## Impact on Dropout Prediction
The addition of fee details as a factor provides a more comprehensive view of student risk factors:
- Students with high pending fees are more likely to drop out
- Financial stress is now quantified and considered in predictions
- Faculty can identify students who may need financial assistance

## Next Steps
1. Monitor the model's performance with real data
2. Adjust feature weights based on actual dropout outcomes
3. Add more financial factors if needed (scholarships, payment plans, etc.)