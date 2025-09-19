const express = require('express');
const { Attendance, Student, Faculty } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/common');
const { body } = require('express-validator');
const { handleValidationErrors } = require('../middleware/common');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// @route   POST /api/attendance/mark
// @desc    Mark attendance for students
// @access  Private (Faculty)
router.post('/mark', authorize('faculty'), [
  body('attendanceData').isArray().withMessage('Attendance data must be an array'),
  body('attendanceData.*.studentId').notEmpty().withMessage('Student ID is required'),
  body('attendanceData.*.status').isIn(['present', 'absent', 'late', 'excused']).withMessage('Invalid attendance status'),
  body('subjectCode').notEmpty().withMessage('Subject code is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('period').isInt({ min: 1, max: 8 }).withMessage('Period must be between 1 and 8'),
  body('startTime').notEmpty().withMessage('Start time is required'),
  body('endTime').notEmpty().withMessage('End time is required'),
  body('roomNumber').notEmpty().withMessage('Room number is required')
], handleValidationErrors, asyncHandler(async (req, res) => {
  try {
    const {
      attendanceData,
      subjectCode,
      date,
      period,
      startTime,
      endTime,
      roomNumber,
      classType = 'Lecture',
      remarks
    } = req.body;

    // Get faculty profile
    const faculty = await Faculty.findOne({ user: req.user._id });
    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty profile not found'
      });
    }

    // Verify faculty teaches this subject
    const facultySubject = faculty.subjects.find(subject => subject.subjectCode === subjectCode);
    if (!facultySubject) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to mark attendance for this subject'
      });
    }

    const attendanceRecords = [];
    const errors = [];

    // Process each student's attendance
    for (const studentAttendance of attendanceData) {
      try {
        // Find student
        const student = await Student.findOne({ 
          $or: [
            { studentId: studentAttendance.studentId },
            { rollNumber: studentAttendance.studentId }
          ]
        });

        if (!student) {
          errors.push({
            studentId: studentAttendance.studentId,
            error: 'Student not found'
          });
          continue;
        }

        // Check if student is enrolled in this subject
        const studentSubject = student.subjects.find(subject => subject.subjectCode === subjectCode);
        if (!studentSubject) {
          errors.push({
            studentId: studentAttendance.studentId,
            error: 'Student not enrolled in this subject'
          });
          continue;
        }

        // Check if attendance already marked for this date and period
        const existingAttendance = await Attendance.findOne({
          student: student._id,
          'subject.subjectCode': subjectCode,
          date: new Date(date),
          period: period
        });

        if (existingAttendance) {
          // Update existing attendance
          await existingAttendance.modifyAttendance(
            studentAttendance.status,
            faculty._id,
            studentAttendance.remarks || 'Updated attendance'
          );
          attendanceRecords.push(existingAttendance);
        } else {
          // Create new attendance record
          const attendanceRecord = new Attendance({
            student: student._id,
            faculty: faculty._id,
            subject: {
              subjectCode: facultySubject.subjectCode,
              subjectName: facultySubject.subjectName,
              credits: facultySubject.credits
            },
            date: new Date(date),
            status: studentAttendance.status,
            classType,
            period,
            timeSlot: { startTime, endTime },
            roomNumber,
            markedBy: faculty._id,
            remarks: studentAttendance.remarks || remarks
          });

          await attendanceRecord.save();
          attendanceRecords.push(attendanceRecord);
        }

      } catch (error) {
        errors.push({
          studentId: studentAttendance.studentId,
          error: error.message
        });
      }
    }

    res.json({
      success: true,
      message: `Attendance marked for ${attendanceRecords.length} student(s)`,
      data: {
        markedCount: attendanceRecords.length,
        errorCount: errors.length,
        attendanceRecords,
        errors
      }
    });

  } catch (error) {
    console.error('Mark attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while marking attendance'
    });
  }
}));

// @route   GET /api/attendance/faculty/overview
// @desc    Get faculty attendance overview
// @access  Private (Faculty)
router.get('/faculty/overview', authorize('faculty'), asyncHandler(async (req, res) => {
  try {
    const { startDate, endDate, subjectCode } = req.query;

    const faculty = await Faculty.findOne({ user: req.user._id });
    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty profile not found'
      });
    }

    // Set default date range (last 30 days)
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Get attendance overview
    const attendanceOverview = await Attendance.getFacultyAttendanceOverview(
      faculty._id,
      start,
      end
    );

    // Filter by subject if specified
    let filteredOverview = attendanceOverview;
    if (subjectCode) {
      filteredOverview = attendanceOverview.filter(
        record => record._id.subjectCode === subjectCode
      );
    }

    // Get subject-wise summary
    const subjectSummary = {};
    faculty.subjects.forEach(subject => {
      const subjectAttendance = filteredOverview.filter(
        record => record._id.subjectCode === subject.subjectCode
      );
      
      if (subjectAttendance.length > 0) {
        const totalClasses = subjectAttendance.length;
        const avgAttendance = subjectAttendance.reduce(
          (sum, record) => sum + record.attendancePercentage, 0
        ) / totalClasses;

        subjectSummary[subject.subjectCode] = {
          subjectName: subject.subjectName,
          totalClasses,
          avgAttendance: Math.round(avgAttendance * 100) / 100
        };
      }
    });

    res.json({
      success: true,
      data: {
        attendanceOverview: filteredOverview,
        subjectSummary,
        dateRange: { start, end }
      }
    });

  } catch (error) {
    console.error('Get faculty attendance overview error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching attendance overview'
    });
  }
}));

// @route   GET /api/attendance/faculty/students/:subjectCode
// @desc    Get students attendance for a specific subject
// @access  Private (Faculty)
router.get('/faculty/students/:subjectCode', authorize('faculty'), asyncHandler(async (req, res) => {
  try {
    const { subjectCode } = req.params;
    const { startDate, endDate } = req.query;

    const faculty = await Faculty.findOne({ user: req.user._id });
    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty profile not found'
      });
    }

    // Verify faculty teaches this subject
    const facultySubject = faculty.subjects.find(subject => subject.subjectCode === subjectCode);
    if (!facultySubject) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view attendance for this subject'
      });
    }

    // Get all students enrolled in this subject
    const enrolledStudents = await Student.find({
      'subjects.subjectCode': subjectCode,
      'academicInfo.status': 'active'
    })
    .populate('user', 'firstName lastName email')
    .select('studentId rollNumber user course batch semester');

    // Get attendance records for the date range
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    }

    const attendanceRecords = await Attendance.find({
      faculty: faculty._id,
      'subject.subjectCode': subjectCode,
      ...dateFilter
    })
    .populate('student', 'studentId rollNumber user')
    .populate({
      path: 'student',
      populate: {
        path: 'user',
        select: 'firstName lastName'
      }
    })
    .sort({ date: -1, period: 1 });

    // Calculate attendance summary for each student
    const studentAttendanceSummary = [];

    for (const student of enrolledStudents) {
      const studentAttendanceRecords = attendanceRecords.filter(
        record => record.student._id.toString() === student._id.toString()
      );

      const totalClasses = studentAttendanceRecords.length;
      const presentCount = studentAttendanceRecords.filter(record => record.status === 'present').length;
      const absentCount = studentAttendanceRecords.filter(record => record.status === 'absent').length;
      const lateCount = studentAttendanceRecords.filter(record => record.status === 'late').length;
      const excusedCount = studentAttendanceRecords.filter(record => record.status === 'excused').length;

      const attendancePercentage = totalClasses > 0 ? Math.round((presentCount / totalClasses) * 100) : 0;

      studentAttendanceSummary.push({
        student: {
          _id: student._id,
          studentId: student.studentId,
          rollNumber: student.rollNumber,
          name: `${student.user.firstName} ${student.user.lastName}`,
          email: student.user.email,
          course: student.course,
          batch: student.batch,
          semester: student.semester
        },
        attendance: {
          totalClasses,
          presentCount,
          absentCount,
          lateCount,
          excusedCount,
          attendancePercentage,
          status: attendancePercentage >= 75 ? 'good' : attendancePercentage >= 60 ? 'warning' : 'critical'
        },
        recentRecords: studentAttendanceRecords.slice(0, 5)
      });
    }

    // Sort by attendance percentage (lowest first to highlight at-risk students)
    studentAttendanceSummary.sort((a, b) => a.attendance.attendancePercentage - b.attendance.attendancePercentage);

    res.json({
      success: true,
      data: {
        subject: facultySubject,
        studentAttendanceSummary,
        totalStudents: enrolledStudents.length,
        summary: {
          excellent: studentAttendanceSummary.filter(s => s.attendance.attendancePercentage >= 90).length,
          good: studentAttendanceSummary.filter(s => s.attendance.attendancePercentage >= 75 && s.attendance.attendancePercentage < 90).length,
          warning: studentAttendanceSummary.filter(s => s.attendance.attendancePercentage >= 60 && s.attendance.attendancePercentage < 75).length,
          critical: studentAttendanceSummary.filter(s => s.attendance.attendancePercentage < 60).length
        }
      }
    });

  } catch (error) {
    console.error('Get students attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching students attendance'
    });
  }
}));

// @route   GET /api/attendance/class/:subjectCode/:date/:period
// @desc    Get attendance for a specific class
// @access  Private (Faculty)
router.get('/class/:subjectCode/:date/:period', authorize('faculty'), asyncHandler(async (req, res) => {
  try {
    const { subjectCode, date, period } = req.params;

    const faculty = await Faculty.findOne({ user: req.user._id });
    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty profile not found'
      });
    }

    // Verify faculty teaches this subject
    const facultySubject = faculty.subjects.find(subject => subject.subjectCode === subjectCode);
    if (!facultySubject) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view attendance for this subject'
      });
    }

    // Get attendance records for this specific class
    const attendanceRecords = await Attendance.find({
      faculty: faculty._id,
      'subject.subjectCode': subjectCode,
      date: new Date(date),
      period: parseInt(period)
    })
    .populate('student', 'studentId rollNumber user course batch')
    .populate({
      path: 'student',
      populate: {
        path: 'user',
        select: 'firstName lastName email'
      }
    })
    .sort({ 'student.rollNumber': 1 });

    // Get all students enrolled in this subject for comparison
    const enrolledStudents = await Student.find({
      'subjects.subjectCode': subjectCode,
      'academicInfo.status': 'active'
    })
    .populate('user', 'firstName lastName email')
    .select('studentId rollNumber user course batch semester')
    .sort({ rollNumber: 1 });

    // Identify students whose attendance was not marked
    const markedStudentIds = attendanceRecords.map(record => record.student._id.toString());
    const unmarkedStudents = enrolledStudents.filter(
      student => !markedStudentIds.includes(student._id.toString())
    );

    res.json({
      success: true,
      data: {
        classInfo: {
          subjectCode,
          subjectName: facultySubject.subjectName,
          date: new Date(date),
          period: parseInt(period),
          faculty: {
            name: `${req.user.firstName} ${req.user.lastName}`,
            designation: faculty.designation,
            department: faculty.department
          }
        },
        attendanceRecords,
        unmarkedStudents,
        summary: {
          totalStudents: enrolledStudents.length,
          markedCount: attendanceRecords.length,
          unmarkedCount: unmarkedStudents.length,
          presentCount: attendanceRecords.filter(record => record.status === 'present').length,
          absentCount: attendanceRecords.filter(record => record.status === 'absent').length,
          lateCount: attendanceRecords.filter(record => record.status === 'late').length,
          excusedCount: attendanceRecords.filter(record => record.status === 'excused').length
        }
      }
    });

  } catch (error) {
    console.error('Get class attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching class attendance'
    });
  }
}));

// @route   PUT /api/attendance/:attendanceId
// @desc    Update attendance record
// @access  Private (Faculty)
router.put('/:attendanceId', authorize('faculty'), [
  body('status').isIn(['present', 'absent', 'late', 'excused']).withMessage('Invalid attendance status'),
  body('reason').optional().isLength({ max: 500 }).withMessage('Reason cannot exceed 500 characters')
], handleValidationErrors, asyncHandler(async (req, res) => {
  try {
    const { attendanceId } = req.params;
    const { status, reason } = req.body;

    const faculty = await Faculty.findOne({ user: req.user._id });
    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty profile not found'
      });
    }

    const attendanceRecord = await Attendance.findById(attendanceId)
      .populate('student', 'studentId rollNumber user')
      .populate({
        path: 'student',
        populate: {
          path: 'user',
          select: 'firstName lastName'
        }
      });

    if (!attendanceRecord) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found'
      });
    }

    // Verify faculty owns this attendance record
    if (attendanceRecord.faculty.toString() !== faculty._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to modify this attendance record'
      });
    }

    // Update attendance
    await attendanceRecord.modifyAttendance(status, faculty._id, reason);

    res.json({
      success: true,
      message: 'Attendance updated successfully',
      data: attendanceRecord
    });

  } catch (error) {
    console.error('Update attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating attendance'
    });
  }
}));

module.exports = router;