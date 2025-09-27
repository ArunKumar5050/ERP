const mongoose = require('mongoose');
const axios = require('axios');
const { Student, AcademicDetails, Attendance, Fee } = require('../models');

// AI Service URL (Flask API)
const AI_SERVICE_URL = 'http://localhost:5001'; // Reverted to original port 5001 to match api.py

class DropoutPredictionService {
  /**
   * Fetch student data from MongoDB for training the model
   */
  async fetchTrainingData() {
    try {
      // Fetch all students
      const students = await Student.find({}).select('_id');
      
      const trainingData = [];
      
      // Process each student
      for (const student of students) {
        const studentFeatures = await this.extractStudentFeatures(student._id);
        if (studentFeatures) {
          trainingData.push(studentFeatures);
        }
      }
      
      return trainingData;
    } catch (error) {
      console.error('Error fetching training data:', error);
      throw error;
    }
  }

  /**
   * Extract features for a student
   */
  async extractStudentFeatures(studentId) {
    try {
      // Get academic details (for CGPA)
      const academicSummary = await AcademicDetails.getStudentAcademicSummary(studentId);
      
      // Calculate overall CGPA
      const cgpa = await AcademicDetails.calculateOverallCGPA(studentId);
      
      // Get attendance data
      const attendanceSummary = await Attendance.getStudentAttendanceSummary(studentId);
      
      // Calculate average attendance percentage
      let totalAttendance = 0;
      let attendanceCount = 0;
      
      attendanceSummary.forEach(subject => {
        totalAttendance += subject.attendance_percentage || 0;
        attendanceCount++;
      });
      
      const avgAttendance = attendanceCount > 0 ? totalAttendance / attendanceCount : 0;
      
      // Count backlogs (subjects with grade 'F')
      const backlogs = await AcademicDetails.countDocuments({
        student_id: studentId,
        grade: 'F'
      });
      
      // Count assignments submitted (using academic details as proxy)
      const assignmentsSubmitted = academicSummary.length;
      
      // Get fee data
      const feeSummary = await Fee.getStudentFeeSummary(studentId);
      const pendingFeeRatio = feeSummary.totalFees > 0 ? 
        feeSummary.totalPending / feeSummary.totalFees : 0;
      
      // For now, we'll use a simple heuristic for dropout (this would be actual data in a real system)
      // In a real implementation, you would have actual dropout data
      const dropout = this.calculateDropoutLabel(avgAttendance, cgpa, backlogs, pendingFeeRatio);
      
      return {
        attendance: avgAttendance,
        cgpa: cgpa,
        backlogs: backlogs,
        assignments_submitted: assignmentsSubmitted,
        pending_fee_ratio: pendingFeeRatio,
        dropout: dropout
      };
    } catch (error) {
      console.error(`Error extracting features for student ${studentId}:`, error);
      return null;
    }
  }

  /**
   * Calculate dropout label based on features (simplified heuristic)
   * In a real system, this would be actual dropout data
   */
  calculateDropoutLabel(attendance, cgpa, backlogs, pendingFeeRatio) {
    // Simple heuristic: higher probability of dropout with:
    // - Low attendance
    // - Low CGPA
    // - High backlogs
    // - High pending fees
    const dropoutScore = (
      (100 - attendance) / 100 * 0.3 +
      (10 - cgpa) / 10 * 0.2 +
      Math.min(backlogs / 5, 1) * 0.2 +
      pendingFeeRatio * 0.3
    );
    
    // Convert to binary label with some randomness
    return Math.random() < dropoutScore ? 1 : 0;
  }

  /**
   * Train the AI model with current data
   */
  async trainModel() {
    try {
      const trainingData = await this.fetchTrainingData();
      
      if (trainingData.length === 0) {
        throw new Error('No training data available');
      }
      
      // Send training data to AI service
      const response = await axios.post(`${AI_SERVICE_URL}/train`, trainingData);
      
      return response.data;
    } catch (error) {
      console.error('Error training model:', error);
      throw error;
    }
  }

  /**
   * Predict dropout risk for a specific student
   */
  async predictStudentRisk(studentId) {
    try {
      // Extract features for the student
      const studentFeatures = await this.extractStudentFeatures(studentId);
      
      if (!studentFeatures) {
        throw new Error('Could not extract features for student');
      }
      
      // Remove the dropout label for prediction
      const { dropout, ...featuresForPrediction } = studentFeatures;
      
      // Send to AI service for prediction
      const response = await axios.post(`${AI_SERVICE_URL}/predict`, featuresForPrediction);
      
      return response.data;
    } catch (error) {
      console.error('Error predicting student risk:', error);
      throw error;
    }
  }

  /**
   * Get feature importance from the trained model
   */
  async getFeatureImportance() {
    try {
      const response = await axios.get(`${AI_SERVICE_URL}/feature-importance`);
      return response.data;
    } catch (error) {
      console.error('Error getting feature importance:', error);
      throw error;
    }
  }

  /**
   * Get at-risk students for faculty dashboard
   */
  async getAtRiskStudents(facultyId = null) {
    try {
      // Fetch all students
      const students = await Student.find({}).select('_id name roll_no email');
      
      const atRiskStudents = [];
      
      // Predict risk for each student
      for (const student of students) {
        try {
          const prediction = await this.predictStudentRisk(student._id);
          
          // Only include students with medium or high risk
          if (prediction.data.risk_level !== 'Low') {
            atRiskStudents.push({
              student_id: student._id,
              name: student.name,
              roll_no: student.roll_no,
              email: student.email,
              risk_score: prediction.data.risk_score,
              risk_level: prediction.data.risk_level,
              top_reasons: prediction.data.top_reasons
            });
          }
        } catch (error) {
          console.error(`Error predicting risk for student ${student._id}:`, error);
          // Continue with other students
        }
      }
      
      // Sort by risk score (highest first)
      atRiskStudents.sort((a, b) => b.risk_score - a.risk_score);
      
      return atRiskStudents;
    } catch (error) {
      console.error('Error getting at-risk students:', error);
      throw error;
    }
  }
}

module.exports = new DropoutPredictionService();