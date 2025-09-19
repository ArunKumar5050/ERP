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
    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    // Get all fee records for the student
    const feeRecords = await Fee.find({ student: student._id })
      .sort({ semester: 1 })
      .populate('paymentHistory.receivedBy', 'firstName lastName')
      .populate('paymentHistory.verifiedBy', 'firstName lastName')
      .populate('discounts.appliedBy', 'firstName lastName');

    // Get fee summary
    const feeSummary = await Fee.getStudentFeeSummary(student._id);

    // Get pending fees
    const pendingFees = await Fee.find({
      student: student._id,
      status: { $in: ['pending', 'partial', 'overdue'] }
    }).sort({ dueDate: 1 });

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
    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    const feeSummary = await Fee.getStudentFeeSummary(student._id);

    // Get breakdown by semester
    const semesterBreakdown = await Fee.find({ student: student._id })
      .select('semester academicYear totalAmount amountPaid balanceAmount status dueDate')
      .sort({ semester: 1 });

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

    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    // Get fee records with payment history
    const feeRecords = await Fee.find({ 
      student: student._id,
      'paymentHistory.0': { $exists: true }
    })
    .populate('paymentHistory.receivedBy', 'firstName lastName')
    .populate('paymentHistory.verifiedBy', 'firstName lastName')
    .sort({ 'paymentHistory.paymentDate': -1 });

    // Extract all payments and sort by date
    let allPayments = [];
    feeRecords.forEach(fee => {
      fee.paymentHistory.forEach(payment => {
        allPayments.push({
          ...payment.toObject(),
          semester: fee.semester,
          academicYear: fee.academicYear,
          feeId: fee._id
        });
      });
    });

    // Sort by payment date (newest first)
    allPayments.sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate));

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

    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    // Find the fee record with this transaction
    const feeRecord = await Fee.findOne({
      student: student._id,
      'paymentHistory.transactionId': transactionId
    })
    .populate('student')
    .populate({
      path: 'student',
      populate: {
        path: 'user',
        select: 'firstName lastName email'
      }
    })
    .populate('paymentHistory.receivedBy', 'firstName lastName')
    .populate('paymentHistory.verifiedBy', 'firstName lastName');

    if (!feeRecord) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found'
      });
    }

    // Find the specific payment
    const payment = feeRecord.paymentHistory.find(p => p.transactionId === transactionId);
    
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
          transactionId: payment.transactionId,
          amount: payment.amount,
          paymentMethod: payment.paymentMethod,
          paymentDate: payment.paymentDate,
          receiptNumber: payment.receiptNumber,
          status: payment.status,
          remarks: payment.remarks,
          receivedBy: payment.receivedBy,
          verifiedBy: payment.verifiedBy,
          verifiedAt: payment.verifiedAt
        },
        feeDetails: {
          semester: feeRecord.semester,
          academicYear: feeRecord.academicYear,
          totalAmount: feeRecord.totalAmount,
          feeStructure: feeRecord.feeStructure
        },
        studentDetails: {
          name: feeRecord.student.user.firstName + ' ' + feeRecord.student.user.lastName,
          studentId: feeRecord.student.studentId,
          rollNumber: feeRecord.student.rollNumber,
          course: feeRecord.student.course,
          email: feeRecord.student.user.email
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

    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    const feeRecord = await Fee.findOne({
      _id: feeId,
      student: student._id
    });

    if (!feeRecord) {
      return res.status(404).json({
        success: false,
        message: 'Fee record not found'
      });
    }

    if (feeRecord.balanceAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'No pending amount for this fee record'
      });
    }

    if (amount > feeRecord.balanceAmount) {
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
      transactionId,
      amount,
      paymentMethod,
      paymentDate: new Date(),
      receiptNumber,
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
    if (semester) matchCondition.semester = parseInt(semester);

    // Get overall fee statistics
    const overallStats = await Fee.aggregate([
      { $match: matchCondition },
      {
        $group: {
          _id: null,
          totalFees: { $sum: '$totalAmount' },
          totalCollected: { $sum: '$amountPaid' },
          totalPending: { $sum: '$balanceAmount' },
          totalStudents: { $addToSet: '$student' }
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
          totalAmount: { $sum: '$totalAmount' },
          collectedAmount: { $sum: '$amountPaid' }
        }
      }
    ]);

    // Get semester-wise collection
    const semesterWiseCollection = await Fee.aggregate([
      { $match: matchCondition },
      {
        $group: {
          _id: { semester: '$semester', academicYear: '$academicYear' },
          totalFees: { $sum: '$totalAmount' },
          totalCollected: { $sum: '$amountPaid' },
          studentCount: { $addToSet: '$student' }
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