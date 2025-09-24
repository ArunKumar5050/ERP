from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from dropout_prediction import DropoutPredictionModel
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize the model
model = DropoutPredictionModel()

# Load the model if it exists, otherwise it will be trained when data is provided
if os.path.exists('dropout_model.pkl'):
    model.load_model()

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok',
        'message': 'Dropout Prediction API is running'
    })

@app.route('/predict', methods=['POST'])
def predict_dropout():
    """Predict dropout risk for a student"""
    try:
        # Get student data from request
        student_data = request.json
        
        # Validate required fields
        required_fields = ['attendance', 'cgpa', 'backlogs', 'assignments_submitted', 'pending_fee_ratio']
        for field in required_fields:
            if field not in student_data:
                return jsonify({
                    'error': f'Missing required field: {field}'
                }), 400
        
        # Make prediction
        result = model.predict_dropout_risk(student_data)
        
        return jsonify({
            'success': True,
            'data': result
        })
        
    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500

@app.route('/train', methods=['POST'])
def train_model():
    """Train the model with provided data"""
    try:
        # Get training data from request
        training_data = request.json
        
        # Convert to DataFrame
        df = pd.DataFrame(training_data)
        
        # Validate required columns
        required_columns = ['attendance', 'cgpa', 'backlogs', 'assignments_submitted', 'pending_fee_ratio', 'dropout']
        for column in required_columns:
            if column not in df.columns:
                return jsonify({
                    'error': f'Missing required column: {column}'
                }), 400
        
        # Train model
        model.train_model(df)
        
        return jsonify({
            'success': True,
            'message': 'Model trained successfully'
        })
        
    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500

@app.route('/feature-importance', methods=['GET'])
def get_feature_importance():
    """Get feature importance from the trained model"""
    try:
        if model.model is None:
            return jsonify({
                'error': 'Model not trained yet'
            }), 400
            
        importance = model.get_feature_importance()
        
        return jsonify({
            'success': True,
            'data': importance
        })
        
    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(host='localhost', port=5001, debug=True)