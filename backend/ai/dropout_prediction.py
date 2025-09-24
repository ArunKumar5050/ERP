import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, confusion_matrix
import joblib
import os
from datetime import datetime
import sys
import warnings
warnings.filterwarnings('ignore')

class DropoutPredictionModel:
    def __init__(self, model_path='dropout_model.pkl'):
        self.model_path = model_path
        self.model = None
        self.scaler = StandardScaler()
        self.feature_names = None
        
    def preprocess_data(self, data):
        """
        Preprocess the data for training or prediction
        Expected columns: attendance, cgpa, backlogs, assignments_submitted, pending_fee_ratio, dropout
        """
        # Handle missing values
        data = data.fillna(data.median())
        
        # Feature engineering
        # Create additional features that might be predictive
        data['attendance_cgpa_ratio'] = data['attendance'] / (data['cgpa'] + 1)
        data['backlogs_assignments_ratio'] = data['backlogs'] / (data['assignments_submitted'] + 1)
        
        # Define features and target
        feature_columns = ['attendance', 'cgpa', 'backlogs', 'assignments_submitted', 
                          'pending_fee_ratio', 'attendance_cgpa_ratio', 'backlogs_assignments_ratio']
        self.feature_names = feature_columns
        
        X = data[feature_columns]
        y = data['dropout'] if 'dropout' in data.columns else None
        
        # Normalize features
        X_scaled = self.scaler.fit_transform(X)
        
        if y is not None:
            return X_scaled, y.values
        return X_scaled
    
    def train_model(self, data):
        """
        Train the dropout prediction model
        """
        print("Starting model training...")
        
        # Preprocess data
        X, y = self.preprocess_data(data)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Train model
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.model.fit(X_train, y_train)
        
        # Evaluate model
        y_pred = self.model.predict(X_test)
        print("Model Training Completed")
        print("\nClassification Report:")
        print(classification_report(y_test, y_pred))
        
        # Save model
        self.save_model()
        
        return self.model
    
    def predict_dropout_risk(self, student_data):
        """
        Predict dropout risk for a student
        student_data should be a dict with keys: attendance, cgpa, backlogs, assignments_submitted, pending_fee_ratio
        """
        if self.model is None:
            self.load_model()
            
        # Convert to DataFrame
        df = pd.DataFrame([student_data])
        
        # Preprocess
        X = self.preprocess_data(df)
        
        # Predict
        risk_score = self.model.predict_proba(X)[0][1]  # Probability of dropout (class 1)
        
        # Get feature importances
        feature_importance = self.get_feature_importance()
        
        return {
            'risk_score': float(risk_score),
            'risk_level': self.get_risk_level(risk_score),
            'top_reasons': self.get_top_reasons(student_data, feature_importance)
        }
    
    def get_feature_importance(self):
        """
        Get feature importance from the trained model
        """
        if self.model is None:
            return {}
            
        importances = self.model.feature_importances_
        feature_importance = dict(zip(self.feature_names, importances))
        return feature_importance
    
    def get_risk_level(self, risk_score):
        """
        Convert risk score to risk level
        """
        if risk_score >= 0.7:
            return 'High'
        elif risk_score >= 0.4:
            return 'Medium'
        else:
            return 'Low'
    
    def get_top_reasons(self, student_data, feature_importance):
        """
        Get top reasons for the risk prediction based on student data and feature importance
        """
        reasons = []
        
        # Check attendance
        if student_data.get('attendance', 100) < 75:
            reasons.append({
                'factor': 'Low Attendance',
                'description': f"Attendance is below 75% ({student_data.get('attendance', 0)}%)",
                'impact': 'High'
            })
        
        # Check CGPA
        if student_data.get('cgpa', 4.0) < 2.5:
            reasons.append({
                'factor': 'Low Academic Performance',
                'description': f"CGPA is below 2.5 ({student_data.get('cgpa', 0)})",
                'impact': 'High'
            })
            
        # Check backlogs
        if student_data.get('backlogs', 0) > 2:
            reasons.append({
                'factor': 'Multiple Backlogs',
                'description': f"Student has {student_data.get('backlogs', 0)} backlogs",
                'impact': 'Medium'
            })
            
        # Check assignments
        if student_data.get('assignments_submitted', 10) < 5:
            reasons.append({
                'factor': 'Low Assignment Submission',
                'description': f"Only {student_data.get('assignments_submitted', 0)} assignments submitted",
                'impact': 'Medium'
            })
            
        # Check fee pending ratio
        if student_data.get('pending_fee_ratio', 0) > 0.3:
            reasons.append({
                'factor': 'High Pending Fees',
                'description': f"Student has {student_data.get('pending_fee_ratio', 0)*100:.1f}% of fees pending",
                'impact': 'Medium'
            })
        
        # Sort by feature importance if we have them
        if feature_importance:
            # Add feature importance-based reasons
            sorted_features = sorted(feature_importance.items(), key=lambda x: x[1], reverse=True)
            for feature, importance in sorted_features[:3]:  # Top 3 features
                if importance > 0.1:  # Only consider significant features
                    reasons.append({
                        'factor': feature.replace('_', ' ').title(),
                        'description': f"Feature '{feature}' has high importance ({importance:.2f}) in prediction",
                        'impact': 'Medium'
                    })
        
        # Remove duplicates and limit to top 3
        unique_reasons = []
        seen_factors = set()
        for reason in reasons:
            if reason['factor'] not in seen_factors:
                unique_reasons.append(reason)
                seen_factors.add(reason['factor'])
        
        return unique_reasons[:3]
    
    def save_model(self):
        """
        Save the trained model and scaler
        """
        model_data = {
            'model': self.model,
            'scaler': self.scaler,
            'feature_names': self.feature_names,
            'trained_at': datetime.now()
        }
        joblib.dump(model_data, self.model_path)
        print(f"Model saved to {self.model_path}")
    
    def load_model(self):
        """
        Load a trained model
        """
        if os.path.exists(self.model_path):
            model_data = joblib.load(self.model_path)
            self.model = model_data['model']
            self.scaler = model_data['scaler']
            self.feature_names = model_data['feature_names']
            print(f"Model loaded from {self.model_path}")
            return True
        else:
            print(f"No saved model found at {self.model_path}")
            return False

def generate_sample_data(n_samples=1000):
    """
    Generate sample data for training the model
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
    # Create model instance
    model = DropoutPredictionModel()
    
    # Generate sample data for training
    print("Generating sample training data...")
    training_data = generate_sample_data(1000)
    
    # Train model
    model.train_model(training_data)
    
    # Test prediction with sample student
    sample_student = {
        'attendance': 65,
        'cgpa': 2.8,
        'backlogs': 3,
        'assignments_submitted': 5,
        'pending_fee_ratio': 0.4  # 40% of fees pending
    }
    
    result = model.predict_dropout_risk(sample_student)
    print("\nSample Prediction:")
    print(f"Risk Score: {result['risk_score']:.2f}")
    print(f"Risk Level: {result['risk_level']}")
    print("Top Reasons:")
    for i, reason in enumerate(result['top_reasons'], 1):
        print(f"  {i}. {reason['factor']}: {reason['description']}")