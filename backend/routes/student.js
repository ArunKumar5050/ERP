const express = require('express');
const { Student, Attendance, Fee, Notice, Helpdesk } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/common');

const router = express.Router();

// All routes require authentication and student role
router.use(authenticate);
router.use(authorize('student'));

// @route   GET /api/student/dashboard
// @desc    Get student dashboard data
// @access  Private (Student)
router.get('/dashboard', asyncHandler(async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id })
      .populate('user', 'firstName lastName email')
      .populate('subjects.faculty', 'user designation department', 'Faculty')
      .populate({
        path: 'subjects.faculty',
        populate: {
          path: 'user',
          select: 'firstName lastName'
        }
      });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    // Get overall attendance percentage
    const overallAttendance = await student.getOverallAttendancePercentage();

    // Get attendance summary by subject
    const attendanceSummary = await Attendance.getStudentAttendanceSummary(student._id);

    // Get fee summary (with error handling)
    let feeSummary = {
      totalFees: 0,
      totalPaid: 0,
      totalBalance: 0,
      paidSemesters: 0,
      pendingSemesters: 0
    };
    
    try {
      feeSummary = await Fee.getStudentFeeSummary(student._id);
    } catch (error) {
      console.log('Fee summary error (using defaults):', error.message);
    }

    // Get recent attendance activity
    const recentAttendance = await Attendance.find({ student: student._id })
      .populate('faculty', 'user designation', 'Faculty')
      .populate({
        path: 'faculty',
        populate: {
          path: 'user',
          select: 'firstName lastName'
        }
      })
      .sort({ date: -1, period: 1 })
      .limit(10);

    // Get pending fees (with error handling)
    let pendingFees = [];
    try {
      pendingFees = await Fee.find({
        student: student._id,
        status: { $in: ['pending', 'partial', 'overdue'] }
      }).sort({ dueDate: 1 }).limit(3);
    } catch (error) {
      console.log('Pending fees error (using empty array):', error.message);
    }

    // Calculate stats
    const currentSemesterSubjects = student.getCurrentSemesterSubjects();
    const totalClasses = await Attendance.countDocuments({ student: student._id });
    const attendedClasses = await Attendance.countDocuments({ 
      student: student._id, 
      status: 'present' 
    });
    const missedClasses = totalClasses - attendedClasses;

    res.json({
      success: true,
      data: {
        student: {
          ...student.toObject(),
          overallAttendance
        },
        stats: {
          overallAttendance,
          totalClasses,
          attendedClasses,
          missedClasses,
          currentSemesterSubjects: currentSemesterSubjects.length,
          pendingFees: pendingFees.length
        },
        attendanceSummary,
        feeSummary,
        recentAttendance,
        pendingFees,
        currentSemesterSubjects
      }
    });

  } catch (error) {
    console.error('Student dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard data'
    });
  }
}));

// @route   GET /api/student/profile
// @desc    Get student profile
// @access  Private (Student)
router.get('/profile', asyncHandler(async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id })
      .populate('user', 'firstName lastName email phone avatar')
      .populate('subjects.faculty', 'user designation department', 'Faculty')
      .populate({
        path: 'subjects.faculty',
        populate: {
          path: 'user',
          select: 'firstName lastName'
        }
      });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    res.json({
      success: true,
      data: student
    });

  } catch (error) {
    console.error('Get student profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile'
    });
  }
}));

// @route   GET /api/student/attendance
// @desc    Get student attendance records
// @access  Private (Student)
router.get('/attendance', asyncHandler(async (req, res) => {
  try {
    const { subjectCode, startDate, endDate, page = 1, limit = 50 } = req.query;

    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    // Build query
    let query = { student: student._id };
    
    if (subjectCode) {
      query['subject.subjectCode'] = subjectCode;
    }
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Get attendance records with pagination
    const attendanceRecords = await Attendance.find(query)
      .populate('faculty', 'user designation', 'Faculty')
      .populate({
        path: 'faculty',
        populate: {
          path: 'user',
          select: 'firstName lastName'
        }
      })
      .sort({ date: -1, period: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total count
    const total = await Attendance.countDocuments(query);

    // Get summary by subject
    const attendanceSummary = await Attendance.getStudentAttendanceSummary(
      student._id, 
      subjectCode
    );

    res.json({
      success: true,
      data: {
        attendanceRecords,
        attendanceSummary,
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
    console.error('Get student attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching attendance'
    });
  }
}));

// @route   GET /api/student/attendance/summary
// @desc    Get student attendance summary
// @access  Private (Student)
router.get('/attendance/summary', asyncHandler(async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    const attendanceSummary = await Attendance.getStudentAttendanceSummary(student._id);
    
    // Calculate overall stats
    const totalClasses = attendanceSummary.reduce((sum, subject) => sum + subject.totalClasses, 0);
    const totalPresent = attendanceSummary.reduce((sum, subject) => sum + subject.presentCount, 0);
    const overallPercentage = totalClasses > 0 ? Math.round((totalPresent / totalClasses) * 100) : 0;

    // Count subjects by attendance status
    const excellentSubjects = attendanceSummary.filter(s => s.attendancePercentage >= 90).length;
    const goodSubjects = attendanceSummary.filter(s => s.attendancePercentage >= 75 && s.attendancePercentage < 90).length;
    const warningSubjects = attendanceSummary.filter(s => s.attendancePercentage >= 60 && s.attendancePercentage < 75).length;
    const criticalSubjects = attendanceSummary.filter(s => s.attendancePercentage < 60).length;

    res.json({
      success: true,
      data: {
        attendanceSummary,
        overallStats: {
          totalClasses,
          totalPresent,
          totalAbsent: totalClasses - totalPresent,
          overallPercentage
        },
        subjectStatusCount: {
          excellent: excellentSubjects,
          good: goodSubjects,
          warning: warningSubjects,
          critical: criticalSubjects
        }
      }
    });

  } catch (error) {
    console.error('Get attendance summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching attendance summary'
    });
  }
}));

// @route   GET /api/student/schedule
// @desc    Get student class schedule
// @access  Private (Student)
router.get('/schedule', asyncHandler(async (req, res) => {
  try {
    const { day } = req.query;

    const student = await Student.findOne({ user: req.user._id })
      .populate('subjects.faculty', 'user designation department', 'Faculty')
      .populate({
        path: 'subjects.faculty',
        populate: {
          path: 'user',
          select: 'firstName lastName'
        }
      });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    // Get current semester subjects
    const currentSemesterSubjects = student.getCurrentSemesterSubjects();
    
    // Build schedule from subjects
    let schedule = [];
    
    for (const subject of currentSemesterSubjects) {
      if (subject.faculty && subject.faculty.subjects) {
        const facultySubject = subject.faculty.subjects.find(
          fs => fs.subjectCode === subject.subjectCode
        );
        
        if (facultySubject && facultySubject.classSchedule) {
          facultySubject.classSchedule.forEach(classTime => {
            if (!day || classTime.day === day) {
              schedule.push({
                subjectCode: subject.subjectCode,
                subjectName: subject.subjectName,
                credits: subject.credits,
                faculty: subject.faculty,
                ...classTime
              });
            }
          });
        }
      }
    }

    // Sort by day and time
    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    schedule.sort((a, b) => {
      const dayComparison = dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
      if (dayComparison !== 0) return dayComparison;
      
      const timeA = new Date(`1970-01-01 ${a.startTime}`);
      const timeB = new Date(`1970-01-01 ${b.startTime}`);
      return timeA - timeB;
    });

    res.json({
      success: true,
      data: {
        schedule,
        totalClasses: schedule.length
      }
    });

  } catch (error) {
    console.error('Get student schedule error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching schedule'
    });
  }
}));

module.exports = router;