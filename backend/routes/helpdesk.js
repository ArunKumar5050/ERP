const express = require('express');
const { Helpdesk, Student } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/common');
const { body } = require('express-validator');
const { handleValidationErrors } = require('../middleware/common');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// @route   POST /api/helpdesk/ticket
// @desc    Create new helpdesk ticket
// @access  Private (Student)
router.post('/ticket', authorize('student'), [
  body('category').isIn(['academic', 'technical', 'fee', 'hostel', 'library', 'transport', 'placement', 'general', 'counselling']).withMessage('Invalid category'),
  body('subject').notEmpty().withMessage('Subject is required').trim(),
  body('description').notEmpty().withMessage('Description is required'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority level')
], handleValidationErrors, asyncHandler(async (req, res) => {
  try {
    const {
      category,
      subcategory,
      priority = 'medium',
      subject,
      description,
      contactPreference = 'email',
      tags = []
    } = req.body;

    // Get student profile
    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    const ticket = new Helpdesk({
      student: student._id,
      category,
      subcategory,
      priority,
      subject,
      description,
      contactPreference,
      tags,
      isUrgent: priority === 'urgent'
    });

    await ticket.save();

    // Populate the created ticket
    const populatedTicket = await Helpdesk.findById(ticket._id)
      .populate('student')
      .populate({
        path: 'student',
        populate: {
          path: 'user',
          select: 'firstName lastName email phone'
        }
      });

    res.status(201).json({
      success: true,
      message: 'Support ticket created successfully',
      data: populatedTicket
    });

  } catch (error) {
    console.error('Create ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating ticket'
    });
  }
}));

// @route   GET /api/helpdesk/tickets
// @desc    Get user's tickets
// @access  Private (Student)
router.get('/tickets', authorize('student'), asyncHandler(async (req, res) => {
  try {
    const { status, category, page = 1, limit = 10 } = req.query;

    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    // Build query
    let query = { student: student._id };

    if (status && status !== 'all') {
      query.status = status;
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    // Get tickets with pagination
    const tickets = await Helpdesk.find(query)
      .populate('assignedTo', 'firstName lastName')
      .populate('resolution.resolvedBy', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total count
    const total = await Helpdesk.countDocuments(query);

    res.json({
      success: true,
      data: {
        tickets,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalRecords: total,
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get tickets error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching tickets'
    });
  }
}));

// @route   GET /api/helpdesk/ticket/:ticketId
// @desc    Get single ticket details
// @access  Private (Student - own tickets only)
router.get('/ticket/:ticketId', authorize('student'), asyncHandler(async (req, res) => {
  try {
    const { ticketId } = req.params;

    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    const ticket = await Helpdesk.findOne({
      $or: [
        { ticketId: ticketId },
        { _id: ticketId }
      ],
      student: student._id
    })
    .populate('student')
    .populate({
      path: 'student',
      populate: {
        path: 'user',
        select: 'firstName lastName email phone'
      }
    })
    .populate('assignedTo', 'firstName lastName role')
    .populate('comments.user', 'firstName lastName role')
    .populate('resolution.resolvedBy', 'firstName lastName role')
    .populate('escalation.escalatedTo', 'firstName lastName role');

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    res.json({
      success: true,
      data: ticket
    });

  } catch (error) {
    console.error('Get ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching ticket'
    });
  }
}));

// @route   POST /api/helpdesk/ticket/:ticketId/comment
// @desc    Add comment to ticket
// @access  Private (Student - own tickets only)
router.post('/ticket/:ticketId/comment', authorize('student'), [
  body('content').notEmpty().withMessage('Comment content is required').trim()
], handleValidationErrors, asyncHandler(async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { content } = req.body;

    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    const ticket = await Helpdesk.findOne({
      $or: [
        { ticketId: ticketId },
        { _id: ticketId }
      ],
      student: student._id
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    await ticket.addComment(req.user._id, content, false);

    // Update ticket status if it was waiting for customer
    if (ticket.status === 'waiting_for_customer') {
      ticket.status = 'in_progress';
      await ticket.save();
    }

    const updatedTicket = await Helpdesk.findById(ticket._id)
      .populate('comments.user', 'firstName lastName role');

    res.json({
      success: true,
      message: 'Comment added successfully',
      data: {
        commentCount: updatedTicket.comments.length,
        latestComment: updatedTicket.comments[updatedTicket.comments.length - 1]
      }
    });

  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding comment'
    });
  }
}));

// @route   POST /api/helpdesk/ticket/:ticketId/feedback
// @desc    Submit feedback for resolved ticket
// @access  Private (Student - own tickets only)
router.post('/ticket/:ticketId/feedback', authorize('student'), [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().trim()
], handleValidationErrors, asyncHandler(async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { rating, comment } = req.body;

    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    const ticket = await Helpdesk.findOne({
      $or: [
        { ticketId: ticketId },
        { _id: ticketId }
      ],
      student: student._id
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    if (ticket.status !== 'resolved') {
      return res.status(400).json({
        success: false,
        message: 'Feedback can only be submitted for resolved tickets'
      });
    }

    if (ticket.feedback && ticket.feedback.rating) {
      return res.status(400).json({
        success: false,
        message: 'Feedback has already been submitted for this ticket'
      });
    }

    await ticket.submitFeedback(rating, comment);

    res.json({
      success: true,
      message: 'Feedback submitted successfully',
      data: {
        rating: ticket.feedback.rating,
        comment: ticket.feedback.comment,
        status: ticket.status
      }
    });

  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while submitting feedback'
    });
  }
}));

// @route   GET /api/helpdesk/admin/dashboard
// @desc    Get helpdesk dashboard for admin
// @access  Private (Admin/Support Staff)
router.get('/admin/dashboard', authorize('admin', 'faculty'), asyncHandler(async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Set default date range (last 30 days)
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Get ticket summary
    const ticketSummary = await Helpdesk.getTicketSummary({
      createdAt: { $gte: start, $lte: end }
    });

    // Get recent tickets
    const recentTickets = await Helpdesk.find({
      createdAt: { $gte: start, $lte: end }
    })
    .populate('student')
    .populate({
      path: 'student',
      populate: {
        path: 'user',
        select: 'firstName lastName email'
      }
    })
    .populate('assignedTo', 'firstName lastName')
    .sort({ createdAt: -1 })
    .limit(10);

    // Get overdue tickets
    const overdueTickets = await Helpdesk.find({
      status: { $in: ['open', 'in_progress'] },
      estimatedResolutionTime: { $lt: new Date() }
    })
    .populate('student')
    .populate({
      path: 'student',
      populate: {
        path: 'user',
        select: 'firstName lastName email'
      }
    })
    .populate('assignedTo', 'firstName lastName')
    .sort({ estimatedResolutionTime: 1 })
    .limit(5);

    // Get urgent tickets
    const urgentTickets = await Helpdesk.find({
      priority: 'urgent',
      status: { $in: ['open', 'in_progress'] }
    })
    .populate('student')
    .populate({
      path: 'student',
      populate: {
        path: 'user',
        select: 'firstName lastName email'
      }
    })
    .sort({ createdAt: -1 })
    .limit(5);

    res.json({
      success: true,
      data: {
        summary: ticketSummary,
        recentTickets,
        overdueTickets,
        urgentTickets,
        dateRange: { start, end }
      }
    });

  } catch (error) {
    console.error('Get helpdesk dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard data'
    });
  }
}));

// @route   GET /api/helpdesk/admin/tickets
// @desc    Get all tickets for admin
// @access  Private (Admin/Support Staff)
router.get('/admin/tickets', authorize('admin', 'faculty'), asyncHandler(async (req, res) => {
  try {
    const { 
      status, 
      category, 
      priority, 
      assignedTo, 
      search, 
      page = 1, 
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    let query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (priority && priority !== 'all') {
      query.priority = priority;
    }

    if (assignedTo && assignedTo !== 'all') {
      query.assignedTo = assignedTo;
    }

    // Search functionality
    if (search) {
      query.$or = [
        { ticketId: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Get tickets with pagination
    const tickets = await Helpdesk.find(query)
      .populate('student')
      .populate({
        path: 'student',
        populate: {
          path: 'user',
          select: 'firstName lastName email'
        }
      })
      .populate('assignedTo', 'firstName lastName')
      .populate('resolution.resolvedBy', 'firstName lastName')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total count
    const total = await Helpdesk.countDocuments(query);

    res.json({
      success: true,
      data: {
        tickets,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalRecords: total,
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get admin tickets error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching tickets'
    });
  }
}));

// @route   PUT /api/helpdesk/admin/ticket/:ticketId/assign
// @desc    Assign ticket to support staff
// @access  Private (Admin)
router.put('/admin/ticket/:ticketId/assign', authorize('admin'), [
  body('assignedTo').notEmpty().withMessage('Assigned user ID is required')
], handleValidationErrors, asyncHandler(async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { assignedTo } = req.body;

    const ticket = await Helpdesk.findOne({
      $or: [
        { ticketId: ticketId },
        { _id: ticketId }
      ]
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    await ticket.assignTo(assignedTo);

    const updatedTicket = await Helpdesk.findById(ticket._id)
      .populate('assignedTo', 'firstName lastName');

    res.json({
      success: true,
      message: 'Ticket assigned successfully',
      data: updatedTicket
    });

  } catch (error) {
    console.error('Assign ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while assigning ticket'
    });
  }
}));

// @route   PUT /api/helpdesk/admin/ticket/:ticketId/resolve
// @desc    Resolve ticket
// @access  Private (Admin/Support Staff)
router.put('/admin/ticket/:ticketId/resolve', authorize('admin', 'faculty'), [
  body('summary').notEmpty().withMessage('Resolution summary is required')
], handleValidationErrors, asyncHandler(async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { summary } = req.body;

    const ticket = await Helpdesk.findOne({
      $or: [
        { ticketId: ticketId },
        { _id: ticketId }
      ]
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    await ticket.resolve(req.user._id, summary);

    const resolvedTicket = await Helpdesk.findById(ticket._id)
      .populate('resolution.resolvedBy', 'firstName lastName');

    res.json({
      success: true,
      message: 'Ticket resolved successfully',
      data: resolvedTicket
    });

  } catch (error) {
    console.error('Resolve ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while resolving ticket'
    });
  }
}));

module.exports = router;