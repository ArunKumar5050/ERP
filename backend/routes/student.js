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
    // Find student by matching email with user email
    const student = await Student.findOne({ email: req.user.email });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    // Get attendance summary using the new subject-wise attendance schema
    let attendanceSummary = [];
    let overallAttendance = 0;
    try {
      attendanceSummary = await Attendance.getStudentAttendanceSummary(student._id);
      if (attendanceSummary.length > 0) {
        const totalClasses = attendanceSummary.reduce((sum, subject) => sum + subject.total_classes, 0);
        const totalPresent = attendanceSummary.reduce((sum, subject) => sum + (subject.present_classes + subject.late_classes), 0);
        overallAttendance = totalClasses > 0 ? Math.round((totalPresent / totalClasses) * 100) : 0;
      }
    } catch (error) {
      console.log('Attendance summary error (using defaults):', error.message);
    }

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

    // Get recent attendance activity from the new attendance schema
    const recentAttendance = await Attendance.find({ student_id: student._id })
      .populate('subject_id', 'subject_code subject_name')
      .populate('faculty_id', 'user')
      .populate({
        path: 'faculty_id',
        populate: {
          path: 'user',
          select: 'firstName lastName'
        }
      })
      .sort({ updatedAt: -1 })
      .limit(10);

    // Get pending fees (with error handling)
    let pendingFees = [];
    try {
      pendingFees = await Fee.find({
        student_id: student._id,
        status: 'Pending'
      }).sort({ due_date: 1 }).limit(3);
    } catch (error) {
      console.log('Pending fees error (using empty array):', error.message);
    }

    // Calculate stats from attendance summary
    const totalClasses = attendanceSummary.reduce((sum, subject) => sum + subject.total_classes, 0);
    const attendedClasses = attendanceSummary.reduce((sum, subject) => sum + subject.present_classes + subject.late_classes, 0);
    const missedClasses = attendanceSummary.reduce((sum, subject) => sum + subject.absent_classes, 0);

    // Mock current semester subjects (since we don't have the subjects field in the new schema)
    const currentSemesterSubjects = attendanceSummary.map(attendance => ({
      subjectCode: attendance.subject_code,
      subjectName: attendance.subject_name,
      credits: 3, // Default value
      semester: student.semester
    }));

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
    // Find student by matching email with user email
    const student = await Student.findOne({ email: req.user.email });

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

    // Find student by matching email with user email
    const student = await Student.findOne({ email: req.user.email });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    // Build query for new attendance schema
    let query = { student_id: student._id };
    
    if (subjectCode) {
      // Find subject by code and use its ID
      const Subject = require('../models').Subject;
      const subject = await Subject.findOne({ subject_code: subjectCode });
      if (subject) {
        query.subject_id = subject._id;
      }
    }

    // Get attendance records with pagination
    const attendanceRecords = await Attendance.find(query)
      .populate('subject_id', 'subject_code subject_name credits')
      .populate('faculty_id', 'user')
      .populate({
        path: 'faculty_id',
        populate: {
          path: 'user',
          select: 'firstName lastName'
        }
      })
      .sort({ updatedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total count
    const total = await Attendance.countDocuments(query);

    // Get summary by subject using new schema
    const attendanceSummary = await Attendance.getStudentAttendanceSummary(
      student._id, 
      subjectCode ? parseInt(student.semester) : null
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