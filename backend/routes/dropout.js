const express = require('express');
const mongoose = require('mongoose');
const { authenticate, authorize } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/common');
const dropoutService = require('../services/dropoutPredictionService');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// @route   GET /api/dropout/at-risk
// @desc    Get list of students at risk of dropout
// @access  Private (Faculty/Admin)
router.get('/at-risk', authorize(['faculty', 'admin']), asyncHandler(async (req, res) => {
  try {
    const atRiskStudents = await dropoutService.getAtRiskStudents();
    
    res.json({
      success: true,
      data: atRiskStudents,
      count: atRiskStudents.length
    });
  } catch (error) {
    console.error('Error fetching at-risk students:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching at-risk students',
      error: error.message
    });
  }
}));

// @route   POST /api/dropout/predict/:studentId
// @desc    Predict dropout risk for a specific student
// @access  Private (Faculty/Admin)
router.post('/predict/:studentId', authorize(['faculty', 'admin']), asyncHandler(async (req, res) => {
  try {
    const { studentId } = req.params;
    
    // Validate student ID
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid student ID'
      });
    }
    
    const prediction = await dropoutService.predictStudentRisk(studentId);
    
    res.json({
      success: true,
      data: prediction.data
    });
  } catch (error) {
    console.error('Error predicting student risk:', error);
    res.status(500).json({
      success: false,
      message: 'Error predicting student risk',
      error: error.message
    });
  }
}));

// @route   POST /api/dropout/train
// @desc    Train the dropout prediction model
// @access  Private (Admin)
router.post('/train', authorize(['admin']), asyncHandler(async (req, res) => {
  try {
    const result = await dropoutService.trainModel();
    
    res.json({
      success: true,
      message: 'Model training completed',
      data: result
    });
  } catch (error) {
    console.error('Error training model:', error);
    res.status(500).json({
      success: false,
      message: 'Error training model',
      error: error.message
    });
  }
}));

// @route   GET /api/dropout/feature-importance
// @desc    Get feature importance from the trained model
// @access  Private (Faculty/Admin)
router.get('/feature-importance', authorize(['faculty', 'admin']), asyncHandler(async (req, res) => {
  try {
    const importance = await dropoutService.getFeatureImportance();
    
    res.json({
      success: true,
      data: importance.data
    });
  } catch (error) {
    console.error('Error getting feature importance:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting feature importance',
      error: error.message
    });
  }
}));

module.exports = router;