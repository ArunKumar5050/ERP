const express = require('express');
const { Fee, Student } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/common');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// @route   GET /api/fee/student
// @desc    Get student fee details
// @access  Private (Student)
router.get('/student', authorize('student'), asyncHandler(async (req, res) => {
  try {
    // Find student by matching email with user email (consistent with student routes)
    const student = await Student.findOne({ email: req.user.email });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    // Get all fee records for the student
    const feeRecords = await Fee.find({ student_id: student._id })
      .sort({ semester_no: 1 });

    // Get fee summary
    const feeSummary = await Fee.getStudentFeeSummary(student._id);

    // Get pending fees
    const pendingFees = await Fee.find({
      student_id: student._id,
      status: { $in: ['Pending'] }
    }).sort({ due_date: 1 });

    res.json({
      success: true,
      data: {
        feeRecords,
        feeSummary,
        pendingFees
      }
    });

  } catch (error) {
    console.error('Get student fees error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching fee details'
    });
  }
}));

// @route   GET /api/fee/student/summary
// @desc    Get student fee summary
// @access  Private (Student)
router.get('/student/summary', authorize('student'), asyncHandler(async (req, res) => {
  try {
    // Find student by matching email with user email (consistent with student routes)
    const student = await Student.findOne({ email: req.user.email });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    const feeSummary = await Fee.getStudentFeeSummary(student._id);

    // Get breakdown by semester
    const semesterBreakdown = await Fee.find({ student_id: student._id })
      .select('semester_no academicYear total_amount paid_amount pending_amount status due_date')
      .sort({ semester_no: 1 });

    // Calculate payment progress
    const paymentProgress = feeSummary.totalFees > 0 
      ? Math.round((feeSummary.totalPaid / feeSummary.totalFees) * 100) 
      : 0;

    res.json({
      success: true,
      data: {
        summary: {
          ...feeSummary,
          paymentProgress
        },
        semesterBreakdown
      }
    });

  } catch (error) {
    console.error('Get fee summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching fee summary'
    });
  }
}));

// @route   GET /api/fee/student/payments
// @desc    Get student payment history
// @access  Private (Student)
router.get('/student/payments', authorize('student'), asyncHandler(async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    // Find student by matching email with user email (consistent with student routes)
    const student = await Student.findOne({ email: req.user.email });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    // Get fee records with payment history
    const feeRecords = await Fee.find({ 
      student_id: student._id,
      'paymentHistory.0': { $exists: true }
    })
    .sort({ 'paymentHistory.payment_date': -1 });

    // Extract all payments and sort by date
    let allPayments = [];
    feeRecords.forEach(fee => {
      fee.paymentHistory.forEach(payment => {
        allPayments.push({
          ...payment.toObject(),
          semester: fee.semester_no,
          academicYear: fee.academicYear,
          feeId: fee._id
        });
      });
    });

    // Sort by payment date (newest first)
    allPayments.sort((a, b) => new Date(b.payment_date) - new Date(a.payment_date));

    // Implement pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedPayments = allPayments.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        payments: paginatedPayments,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(allPayments.length / limit),
          totalRecords: allPayments.length,
          hasNextPage: endIndex < allPayments.length,
          hasPrevPage: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching payment history'
    });
  }
}));

// @route   GET /api/fee/student/receipt/:transactionId
// @desc    Get payment receipt
// @access  Private (Student)
router.get('/student/receipt/:transactionId', authorize('student'), asyncHandler(async (req, res) => {
  try {
    const { transactionId } = req.params;

    // Find student by matching email with user email (consistent with student routes)
    const student = await Student.findOne({ email: req.user.email });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    // Find the fee record with this transaction
    const feeRecord = await Fee.findOne({
      student_id: student._id,
      'paymentHistory.transaction_id': transactionId
    })
    .populate('student_id');

    if (!feeRecord) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found'
      });
    }

    // Find the specific payment
    const payment = feeRecord.paymentHistory.find(p => p.transaction_id === transactionId);
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment transaction not found'
      });
    }

    res.json({
      success: true,
      data: {
        receipt: {
          transactionId: payment.transaction_id,
          amount: payment.amount,
          paymentMethod: payment.payment_method,
          paymentDate: payment.payment_date,
          receiptNumber: payment.receipt_number,
          status: payment.status,
          remarks: payment.remarks,
          receivedBy: payment.receivedBy,
          verifiedBy: payment.verifiedBy,
          verifiedAt: payment.verified_at
        },
        feeDetails: {
          semester: feeRecord.semester_no,
          academicYear: feeRecord.academicYear,
          totalAmount: feeRecord.total_amount,
          feeStructure: feeRecord.feeStructure
        },
        studentDetails: {
          name: feeRecord.student_id.name,
          studentId: feeRecord.student_id.student_id,
          rollNumber: feeRecord.student_id.roll_no,
          course: feeRecord.student_id.branch,
          email: feeRecord.student_id.email
        }
      }
    });

  } catch (error) {
    console.error('Get receipt error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching receipt'
    });
  }
}));

// @route   POST /api/fee/payment/initiate
// @desc    Initiate payment process
// @access  Private (Student)
router.post('/payment/initiate', authorize('student'), asyncHandler(async (req, res) => {
  try {
    const { feeId, amount, paymentMethod } = req.body;

    // Find student by matching email with user email (consistent with student routes)
    const student = await Student.findOne({ email: req.user.email });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    const feeRecord = await Fee.findOne({
      _id: feeId,
      student_id: student._id
    });

    if (!feeRecord) {
      return res.status(404).json({
        success: false,
        message: 'Fee record not found'
      });
    }

    if (feeRecord.balance_amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'No pending amount for this fee record'
      });
    }

    if (amount > feeRecord.balance_amount) {
      return res.status(400).json({
        success: false,
        message: 'Payment amount cannot exceed balance amount'
      });
    }

    // Generate transaction ID
    const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    const receiptNumber = `RCP${Date.now()}`;

    // For demo purposes, we'll simulate payment success
    // In production, this would integrate with actual payment gateways
    const paymentData = {
      transaction_id: transactionId,
      amount,
      payment_method: paymentMethod,
      payment_date: new Date(),
      receipt_number: receiptNumber,
      receivedBy: req.user._id, // In real scenario, this would be the payment processor
      status: 'verified' // In real scenario, this would be 'pending' initially
    };

    await feeRecord.addPayment(paymentData);

    res.json({
      success: true,
      message: 'Payment processed successfully',
      data: {
        transactionId,
        receiptNumber,
        amount,
        paymentMethod,
        status: 'verified'
      }
    });

  } catch (error) {
    console.error('Payment initiation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while processing payment'
    });
  }
}));

// @route   GET /api/fee/admin/overview
// @desc    Get fee collection overview (Admin/Finance)
// @access  Private (Admin)
router.get('/admin/overview', authorize('admin'), asyncHandler(async (req, res) => {
  try {
    const { academicYear, semester } = req.query;

    let matchCondition = {};
    if (academicYear) matchCondition.academicYear = academicYear;
    if (semester) matchCondition.semester_no = parseInt(semester);

    // Get overall fee statistics
    const overallStats = await Fee.aggregate([
      { $match: matchCondition },
      {
        $group: {
          _id: null,
          totalFees: { $sum: '$total_amount' },
          totalCollected: { $sum: '$paid_amount' },
          totalPending: { $sum: '$pending_amount' },
          totalStudents: { $addToSet: '$student_id' }
        }
      },
      {
        $addFields: {
          totalStudents: { $size: '$totalStudents' },
          collectionPercentage: {
            $multiply: [
              { $divide: ['$totalCollected', '$totalFees'] },
              100
            ]
          }
        }
      }
    ]);

    // Get status-wise breakdown
    const statusBreakdown = await Fee.aggregate([
      { $match: matchCondition },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$total_amount' },
          collectedAmount: { $sum: '$paid_amount' }
        }
      }
    ]);

    // Get semester-wise collection
    const semesterWiseCollection = await Fee.aggregate([
      { $match: matchCondition },
      {
        $group: {
          _id: { semester: '$semester_no', academicYear: '$academicYear' },
          totalFees: { $sum: '$total_amount' },
          totalCollected: { $sum: '$paid_amount' },
          studentCount: { $addToSet: '$student_id' }
        }
      },
      {
        $addFields: {
          studentCount: { $size: '$studentCount' },
          collectionRate: {
            $multiply: [
              { $divide: ['$totalCollected', '$totalFees'] },
              100
            ]
          }
        }
      },
      { $sort: { '_id.academicYear': -1, '_id.semester': 1 } }
    ]);

    res.json({
      success: true,
      data: {
        overallStats: overallStats[0] || {
          totalFees: 0,
          totalCollected: 0,
          totalPending: 0,
          totalStudents: 0,
          collectionPercentage: 0
        },
        statusBreakdown,
        semesterWiseCollection
      }
    });

  } catch (error) {
    console.error('Get fee overview error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching fee overview'
    });
  }
}));

module.exports = router;