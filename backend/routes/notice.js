const express = require('express');
const { Notice } = require('../models');
const { authenticate, authorize, optionalAuth } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/common');
const { body } = require('express-validator');
const { handleValidationErrors } = require('../middleware/common');

const router = express.Router();

// @route   GET /api/notice
// @desc    Get notices for user
// @access  Public (with optional auth for personalization)
router.get('/', optionalAuth, asyncHandler(async (req, res) => {
  try {
    const { type, page = 1, limit = 10, search } = req.query;

    let notices;
    let query = {
      isActive: true,
      status: 'published',
      publishDate: { $lte: new Date() },
      $or: [
        { expiryDate: { $exists: false } },
        { expiryDate: { $gte: new Date() } }
      ]
    };

    // If user is authenticated, get personalized notices
    if (req.user) {
      const userRole = req.user.role;
      let userCourse = null;
      let userSemester = null;
      let userDepartment = null;

      // Get user profile based on role
      if (userRole === 'student') {
        const { Student } = require('../models');
        const studentProfile = await Student.findOne({ user: req.user._id });
        if (studentProfile) {
          userCourse = studentProfile.course;
          userSemester = studentProfile.semester;
        }
      } else if (userRole === 'faculty') {
        const { Faculty } = require('../models');
        const facultyProfile = await Faculty.findOne({ user: req.user._id });
        if (facultyProfile) {
          userDepartment = facultyProfile.department;
        }
      }

      notices = await Notice.getNoticesForUser(userRole, userCourse, userSemester, userDepartment);
    } else {
      // Get general notices for unauthenticated users
      query['targetAudience.students'] = true;
      notices = await Notice.find(query)
        .populate('createdBy', 'firstName lastName role')
        .sort({ isPinned: -1, publishDate: -1 });
    }

    // Apply filters
    if (type && type !== 'all') {
      notices = notices.filter(notice => notice.type === type);
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      notices = notices.filter(notice => 
        searchRegex.test(notice.title) || 
        searchRegex.test(notice.content) ||
        notice.tags.some(tag => searchRegex.test(tag))
      );
    }

    // Implement pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedNotices = notices.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        notices: paginatedNotices,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(notices.length / limit),
          totalRecords: notices.length,
          hasNextPage: endIndex < notices.length,
          hasPrevPage: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get notices error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching notices'
    });
  }
}));

// @route   GET /api/notice/:id
// @desc    Get single notice
// @access  Public (with optional auth)
router.get('/:id', optionalAuth, asyncHandler(async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id)
      .populate('createdBy', 'firstName lastName role')
      .populate('approvedBy', 'firstName lastName role')
      .populate('comments.user', 'firstName lastName role')
      .populate('likes.user', 'firstName lastName')
      .populate('readBy.user', 'firstName lastName');

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: 'Notice not found'
      });
    }

    // Check if notice is active and published
    if (!notice.isActive || notice.status !== 'published') {
      return res.status(404).json({
        success: false,
        message: 'Notice not available'
      });
    }

    // Mark as read if user is authenticated
    if (req.user) {
      await notice.markAsRead(req.user._id);
    }

    res.json({
      success: true,
      data: notice
    });

  } catch (error) {
    console.error('Get notice error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching notice'
    });
  }
}));

// @route   POST /api/notice
// @desc    Create new notice
// @access  Private (Faculty/Admin)
router.post('/', authenticate, authorize('faculty', 'admin'), [
  body('title').notEmpty().withMessage('Title is required').trim(),
  body('content').notEmpty().withMessage('Content is required'),
  body('type').isIn(['general', 'academic', 'exam', 'fee', 'event', 'holiday', 'urgent', 'placement']).withMessage('Invalid notice type'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority level'),
  body('expiryDate').optional().isISO8601().withMessage('Invalid expiry date format')
], handleValidationErrors, asyncHandler(async (req, res) => {
  try {
    const {
      title,
      content,
      type,
      priority = 'medium',
      targetAudience = { students: true, faculty: false },
      expiryDate,
      isPinned = false,
      tags = []
    } = req.body;

    const notice = new Notice({
      title,
      content,
      type,
      priority,
      targetAudience,
      expiryDate,
      isPinned,
      tags,
      createdBy: req.user._id,
      status: req.user.role === 'admin' ? 'published' : 'pending_approval'
    });

    await notice.save();

    // Populate created notice
    const populatedNotice = await Notice.findById(notice._id)
      .populate('createdBy', 'firstName lastName role');

    res.status(201).json({
      success: true,
      message: 'Notice created successfully',
      data: populatedNotice
    });

  } catch (error) {
    console.error('Create notice error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating notice'
    });
  }
}));

// @route   PUT /api/notice/:id
// @desc    Update notice
// @access  Private (Creator/Admin)
router.put('/:id', authenticate, [
  body('title').optional().notEmpty().withMessage('Title cannot be empty').trim(),
  body('content').optional().notEmpty().withMessage('Content cannot be empty'),
  body('type').optional().isIn(['general', 'academic', 'exam', 'fee', 'event', 'holiday', 'urgent', 'placement']).withMessage('Invalid notice type'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority level')
], handleValidationErrors, asyncHandler(async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: 'Notice not found'
      });
    }

    // Check authorization
    if (notice.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this notice'
      });
    }

    // Update notice
    const updateFields = ['title', 'content', 'type', 'priority', 'targetAudience', 'expiryDate', 'isPinned', 'tags'];
    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        notice[field] = req.body[field];
      }
    });

    await notice.save();

    const updatedNotice = await Notice.findById(notice._id)
      .populate('createdBy', 'firstName lastName role');

    res.json({
      success: true,
      message: 'Notice updated successfully',
      data: updatedNotice
    });

  } catch (error) {
    console.error('Update notice error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating notice'
    });
  }
}));

// @route   DELETE /api/notice/:id
// @desc    Delete notice
// @access  Private (Creator/Admin)
router.delete('/:id', authenticate, asyncHandler(async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: 'Notice not found'
      });
    }

    // Check authorization
    if (notice.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this notice'
      });
    }

    await Notice.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Notice deleted successfully'
    });

  } catch (error) {
    console.error('Delete notice error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting notice'
    });
  }
}));

// @route   POST /api/notice/:id/like
// @desc    Like/Unlike notice
// @access  Private
router.post('/:id/like', authenticate, asyncHandler(async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: 'Notice not found'
      });
    }

    await notice.toggleLike(req.user._id);

    res.json({
      success: true,
      message: 'Notice like status updated',
      data: {
        likeCount: notice.likes.length,
        isLiked: notice.likes.some(like => like.user.toString() === req.user._id.toString())
      }
    });

  } catch (error) {
    console.error('Toggle notice like error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating like status'
    });
  }
}));

// @route   POST /api/notice/:id/comment
// @desc    Add comment to notice
// @access  Private
router.post('/:id/comment', authenticate, [
  body('content').notEmpty().withMessage('Comment content is required').trim()
], handleValidationErrors, asyncHandler(async (req, res) => {
  try {
    const { content } = req.body;
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: 'Notice not found'
      });
    }

    await notice.addComment(req.user._id, content);

    const updatedNotice = await Notice.findById(notice._id)
      .populate('comments.user', 'firstName lastName role');

    res.json({
      success: true,
      message: 'Comment added successfully',
      data: {
        commentCount: updatedNotice.comments.length,
        latestComment: updatedNotice.comments[updatedNotice.comments.length - 1]
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

// @route   GET /api/notice/admin/stats
// @desc    Get notice statistics
// @access  Private (Admin)
router.get('/admin/stats', authenticate, authorize('admin'), asyncHandler(async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    const stats = await Notice.getNoticeStats(start, end);

    // Get overall statistics
    const totalNotices = await Notice.countDocuments({
      publishDate: { $gte: start, $lte: end }
    });

    const activeNotices = await Notice.countDocuments({
      isActive: true,
      status: 'published'
    });

    const pendingApproval = await Notice.countDocuments({
      status: 'pending_approval'
    });

    res.json({
      success: true,
      data: {
        stats,
        summary: {
          totalNotices,
          activeNotices,
          pendingApproval
        },
        dateRange: { start, end }
      }
    });

  } catch (error) {
    console.error('Get notice stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching notice statistics'
    });
  }
}));

module.exports = router;