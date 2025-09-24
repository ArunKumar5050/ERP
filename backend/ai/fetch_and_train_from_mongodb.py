"""
Script to fetch real student data from MongoDB and train the dropout prediction model
"""
import sys
import os
import pandas as pd
from datetime import datetime
from pymongo import MongoClient
import numpy as np

# Add the parent directory to the path so we can import the dropout_prediction module
sys.path.append(os.path.join(os.path.dirname(__file__)))

from dropout_prediction import DropoutPredictionModel

def connect_to_mongodb():
    """
    Connect to MongoDB database
    """
    try:
        # Connect to MongoDB (adjust connection string as needed)
        client = MongoClient('mongodb://localhost:27017/')
        db = client['erp_system']  # Use the same database name as your ERP system
        return db
    except Exception as e:
        print(f"Error connecting to MongoDB: {str(e)}")
        return None

def extract_features_from_student(student, academic_details, attendance_records):
    """
    Extract features from student data for training
    """
    # Extract basic student information
    student_id = str(student.get('_id', ''))
    name = student.get('name', '')
    
    # Calculate CGPA from academic details
    if academic_details:
        total_grade_points = 0
        total_credits = 0
        
        for record in academic_details:
            grade_point = record.get('grade_point', 0)
            credits_earned = record.get('credits_earned', 0)
            
            total_grade_points += grade_point * credits_earned
            total_credits += credits_earned
        
        cgpa = total_grade_points / total_credits if total_credits > 0 else 0
    else:
        cgpa = 0
    
    # Calculate attendance percentage
    if attendance_records:
        total_classes = 0
        present_classes = 0
        
        for record in attendance_records:
            total = record.get('total_classes', 0)
            present = record.get('present_classes', 0)
            
            total_classes += total
            present_classes += present
        
        attendance_percentage = (present_classes / total_classes * 100) if total_classes > 0 else 0
    else:
        attendance_percentage = 0
    
    # Count backlogs (subjects with grade 'F')
    backlogs = 0
    if academic_details:
        backlogs = sum(1 for record in academic_details if record.get('grade') == 'F')
    
    # Count assignments (using academic records as proxy)
    assignments_submitted = len(academic_details) if academic_details else 0
    
    return {
        'student_id': student_id,
        'name': name,
        'attendance': attendance_percentage,
        'cgpa': cgpa,
        'backlogs': backlogs,
        'assignments_submitted': assignments_submitted
    }

def calculate_dropout_label(student, academic_details):
    """
    Calculate dropout label based on student status or other indicators
    In a real system, you would have actual dropout data
    For now, we'll use a heuristic based on poor performance
    """
    # Extract features for heuristic
    features = extract_features_from_student(student, academic_details, [])
    
    # Simple heuristic: higher probability of dropout with:
    # - Low attendance
    # - Low CGPA
    # - High backlogs
    dropout_score = (
        (100 - features['attendance']) / 100 * 0.4 +
        (10 - features['cgpa']) / 10 * 0.3 +
        min(features['backlogs'] / 5, 1) * 0.3
    )
    
    # Convert to binary label with some randomness
    return 1 if np.random.random() < dropout_score else 0

def fetch_student_data(db):
    """
    Fetch student data from MongoDB collections
    """
    print("Fetching student data from MongoDB...")
    
    try:
        # Fetch students
        students = list(db.students.find({}))
        print(f"Found {len(students)} students")
        
        # Fetch academic details
        academic_details = list(db.academicdetails.find({}))
        print(f"Found {len(academic_details)} academic records")
        
        # Fetch attendance records
        attendance_records = list(db.attendance.find({}))
        print(f"Found {len(attendance_records)} attendance records")
        
        # Group academic details by student
        academic_by_student = {}
        for record in academic_details:
            student_id = str(record.get('student_id', ''))
            if student_id not in academic_by_student:
                academic_by_student[student_id] = []
            academic_by_student[student_id].append(record)
        
        # Group attendance records by student
        attendance_by_student = {}
        for record in attendance_records:
            student_id = str(record.get('student_id', ''))
            if student_id not in attendance_by_student:
                attendance_by_student[student_id] = []
            attendance_by_student[student_id].append(record)
        
        # Extract features for each student
        training_data = []
        for student in students:
            student_id = str(student.get('_id', ''))
            student_academic = academic_by_student.get(student_id, [])
            student_attendance = attendance_by_student.get(student_id, [])
            
            features = extract_features_from_student(student, student_academic, student_attendance)
            
            # Add dropout label (in a real system, you would have actual dropout data)
            features['dropout'] = calculate_dropout_label(student, student_academic)
            
            training_data.append(features)
        
        # Convert to DataFrame
        if training_data:
            df = pd.DataFrame(training_data)
            # Keep only the columns needed for training
            df = df[['attendance', 'cgpa', 'backlogs', 'assignments_submitted', 'dropout']]
            print(f"Created training dataset with {len(df)} records")
            print(f"Dropout rate: {df['dropout'].mean():.2%}")
            return df
        else:
            print("No training data found")
            return None
            
    except Exception as e:
        print(f"Error fetching student data: {str(e)}")
        import traceback
        traceback.print_exc()
        return None

def train_model_with_real_data(data):
    """
    Train the model with the provided real data
    """
    print("Training model with real data...")
    
    # Create model instance with a specific filename
    model = DropoutPredictionModel('dropout_model_mongodb.pkl')
    
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
    Main function to connect to MongoDB, fetch data, and train the model
    """
    print("=" * 60)
    print("Student Dropout Prediction Model Training with MongoDB Data")
    print("=" * 60)
    print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    try:
        # Connect to MongoDB
        db = connect_to_mongodb()
        if not db:
            print("Failed to connect to MongoDB. Exiting.")
            return
        
        # Fetch student data
        data = fetch_student_data(db)
        if data is None or len(data) == 0:
            print("No training data available. Exiting.")
            return
        
        # Train the model
        model = train_model_with_real_data(data)
        
        print("\n" + "=" * 60)
        print("Training Completed Successfully!")
        print("=" * 60)
        print(f"Model saved as: dropout_model_mongodb.pkl")
        print(f"Training dataset size: {len(data)} students")
        print(f"Finished at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
    except Exception as e:
        print(f"Error during training: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()