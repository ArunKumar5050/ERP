const express = require('express');
const { Faculty, Student, Attendance, User } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/common');

const router = express.Router();

// All routes require authentication and faculty role
router.use(authenticate);
router.use(authorize('faculty'));

// @route   GET /api/faculty/dashboard
// @desc    Get faculty dashboard data
// @access  Private (Faculty)
router.get('/dashboard', asyncHandler(async (req, res) => {
  try {
    const faculty = await Faculty.findOne({ user: req.user._id })
      .populate('user', 'firstName lastName email phone');

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty profile not found'
      });
    }

    // Get total students count
    const totalStudentsCount = await faculty.getTotalStudentsCount();

    // Get today's schedule
    const todaySchedule = faculty.getTodaySchedule();

    // Get at-risk students (attendance < 75%)
    const subjectCodes = faculty.subjects.map(subject => subject.subjectCode);
    const atRiskStudents = await Attendance.aggregate([
      {
        $match: {
          faculty: faculty._id,
          'subject.subjectCode': { $in: subjectCodes }
        }
      },
      {
        $group: {
          _id: '$student',
          totalClasses: { $sum: 1 },
          presentCount: {
            $sum: {
              $cond: [{ $eq: ['$status', 'present'] }, 1, 0]
            }
          }
        }
      },
      {
        $addFields: {
          attendancePercentage: {
            $cond: {
              if: { $eq: ['$totalClasses', 0] },
              then: 0,
              else: {
                $multiply: [
                  { $divide: ['$presentCount', '$totalClasses'] },
                  100
                ]
              }
            }
          }
        }
      },
      {
        $match: {
          attendancePercentage: { $lt: 75 }
        }
      },
      {
        $lookup: {
          from: 'students',
          localField: '_id',
          foreignField: '_id',
          as: 'student'
        }
      },
      {
        $unwind: '$student'
      },
      {
        $lookup: {
          from: 'users',
          localField: 'student.user',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          studentId: '$student.studentId',
          rollNumber: '$student.rollNumber',
          name: { $concat: ['$user.firstName', ' ', '$user.lastName'] },
          course: '$student.course',
          semester: '$student.semester',
          attendancePercentage: 1,
          totalClasses: 1,
          presentCount: 1
        }
      },
      { $sort: { attendancePercentage: 1 } },
      { $limit: 10 }
    ]);

    // Get attendance trends for last 5 months
    const fiveMonthsAgo = new Date();
    fiveMonthsAgo.setMonth(fiveMonthsAgo.getMonth() - 5);

    const attendanceTrends = await Attendance.aggregate([
      {
        $match: {
          faculty: faculty._id,
          date: { $gte: fiveMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' }
          },
          totalClasses: { $sum: 1 },
          presentCount: {
            $sum: {
              $cond: [{ $eq: ['$status', 'present'] }, 1, 0]
            }
          }
        }
      },
      {
        $addFields: {
          attendancePercentage: {
            $multiply: [
              { $divide: ['$presentCount', '$totalClasses'] },
              100
            ]
          },
          monthName: {
            $arrayElemAt: [
              ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
              '$_id.month'
            ]
          }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Get subject-wise statistics
    const subjectStats = [];
    for (const subject of faculty.subjects) {
      const totalStudents = await Student.countDocuments({
        'subjects.subjectCode': subject.subjectCode,
        'academicInfo.status': 'active'
      });

      const avgAttendance = await Attendance.aggregate([
        {
          $match: {
            faculty: faculty._id,
            'subject.subjectCode': subject.subjectCode
          }
        },
        {
          $group: {
            _id: '$student',
            totalClasses: { $sum: 1 },
            presentCount: {
              $sum: {
                $cond: [{ $eq: ['$status', 'present'] }, 1, 0]
              }
            }
          }
        },
        {
          $addFields: {
            attendancePercentage: {
              $cond: {
                if: { $eq: ['$totalClasses', 0] },
                then: 0,
                else: {
                  $multiply: [
                    { $divide: ['$presentCount', '$totalClasses'] },
                    100
                  ]
                }
              }
            }
          }
        },
        {
          $group: {
            _id: null,
            avgAttendance: { $avg: '$attendancePercentage' }
          }
        }
      ]);

      subjectStats.push({
        subjectCode: subject.subjectCode,
        subjectName: subject.subjectName,
        credits: subject.credits,
        totalStudents,
        avgAttendance: avgAttendance[0]?.avgAttendance || 0
      });
    }

    res.json({
      success: true,
      data: {
        faculty,
        stats: {
          totalStudents: totalStudentsCount || 0,
          todayClasses: todaySchedule.length || 0,
          atRiskStudents: atRiskStudents.length || 0,
          totalSubjects: faculty.subjects ? faculty.subjects.length : 0,
          averageAttendance: attendanceTrends.length > 0 ? 
            Math.round(attendanceTrends.reduce((sum, trend) => sum + (trend.attendancePercentage || 0), 0) / attendanceTrends.length) : 0
        },
        todaySchedule,
        atRiskStudents,
        attendanceTrends,
        subjectStats
      }
    });

  } catch (error) {
    console.error('Faculty dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard data'
    });
  }
}));

// @route   GET /api/faculty/profile
// @desc    Get faculty profile
// @access  Private (Faculty)
router.get('/profile', asyncHandler(async (req, res) => {
  try {
    const faculty = await Faculty.findOne({ user: req.user._id })
      .populate('user', 'firstName lastName email phone avatar');

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty profile not found'
      });
    }

    res.json({
      success: true,
      data: faculty
    });

  } catch (error) {
    console.error('Get faculty profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile'
    });
  }
}));

// @route   GET /api/faculty/schedule
// @desc    Get faculty schedule
// @access  Private (Faculty)
router.get('/schedule', asyncHandler(async (req, res) => {
  try {
    const { day } = req.query;

    const faculty = await Faculty.findOne({ user: req.user._id });
    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty profile not found'
      });
    }

    let schedule = [];

    // Get schedule from all subjects
    faculty.subjects.forEach(subject => {
      subject.classSchedule.forEach(classTime => {
        if (!day || classTime.day === day) {
          schedule.push({
            subjectCode: subject.subjectCode,
            subjectName: subject.subjectName,
            credits: subject.credits,
            course: subject.course,
            semester: subject.semester,
            ...classTime
          });
        }
      });
    });

    // Add office hours
    faculty.officeHours.forEach(officeHour => {
      if (!day || officeHour.day === day) {
        schedule.push({
          type: 'office_hours',
          ...officeHour
        });
      }
    });

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
        totalClasses: schedule.filter(item => item.type !== 'office_hours').length,
        officeHours: schedule.filter(item => item.type === 'office_hours').length
      }
    });

  } catch (error) {
    console.error('Get faculty schedule error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching schedule'
    });
  }
}));

// @route   GET /api/faculty/students
// @desc    Get all students taught by faculty
// @access  Private (Faculty)
router.get('/students', asyncHandler(async (req, res) => {
  try {
    const { subjectCode, course, semester, search, page = 1, limit = 20 } = req.query;

    const faculty = await Faculty.findOne({ user: req.user._id });
    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty profile not found'
      });
    }

    const subjectCodes = subjectCode 
      ? [subjectCode] 
      : faculty.subjects.map(subject => subject.subjectCode);

    // Build query
    let query = {
      'subjects.subjectCode': { $in: subjectCodes },
      'academicInfo.status': 'active'
    };

    if (course) {
      query.course = course;
    }

    if (semester) {
      query.semester = parseInt(semester);
    }

    // Search functionality
    let searchQuery = {};
    if (search) {
      searchQuery = {
        $or: [
          { studentId: { $regex: search, $options: 'i' } },
          { rollNumber: { $regex: search, $options: 'i' } },
          { 'user.firstName': { $regex: search, $options: 'i' } },
          { 'user.lastName': { $regex: search, $options: 'i' } }
        ]
      };
    }

    // Get students with pagination
    const students = await Student.find({ ...query, ...searchQuery })
      .populate('user', 'firstName lastName email phone')
      .select('studentId rollNumber user course batch semester subjects academicInfo')
      .sort({ rollNumber: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total count
    const total = await Student.countDocuments({ ...query, ...searchQuery });

    // Get attendance summary for each student
    const studentsWithAttendance = [];
    for (const student of students) {
      const attendanceSummary = await Attendance.getStudentAttendanceSummary(student._id);
      
      // Filter attendance summary for subjects taught by this faculty
      const relevantAttendance = attendanceSummary.filter(
        attendance => subjectCodes.includes(attendance._id)
      );

      // Calculate overall attendance for subjects taught by this faculty
      const totalClasses = relevantAttendance.reduce((sum, subject) => sum + subject.totalClasses, 0);
      const totalPresent = relevantAttendance.reduce((sum, subject) => sum + subject.presentCount, 0);
      const overallAttendance = totalClasses > 0 ? Math.round((totalPresent / totalClasses) * 100) : 0;

      studentsWithAttendance.push({
        ...student.toObject(),
        attendanceSummary: relevantAttendance,
        overallAttendance,
        status: overallAttendance >= 75 ? 'good' : overallAttendance >= 60 ? 'warning' : 'critical'
      });
    }

    res.json({
      success: true,
      data: {
        students: studentsWithAttendance,
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
    console.error('Get faculty students error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching students'
    });
  }
}));

// @route   GET /api/faculty/students/at-risk
// @desc    Get at-risk students (attendance < 75%)
// @access  Private (Faculty)
router.get('/students/at-risk', asyncHandler(async (req, res) => {
  try {
    const faculty = await Faculty.findOne({ user: req.user._id });
    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty profile not found'
      });
    }

    const subjectCodes = faculty.subjects.map(subject => subject.subjectCode);

    const atRiskStudents = await Attendance.aggregate([
      {
        $match: {
          faculty: faculty._id,
          'subject.subjectCode': { $in: subjectCodes }
        }
      },
      {
        $group: {
          _id: {
            student: '$student',
            subjectCode: '$subject.subjectCode'
          },
          subjectName: { $first: '$subject.subjectName' },
          totalClasses: { $sum: 1 },
          presentCount: {
            $sum: {
              $cond: [{ $eq: ['$status', 'present'] }, 1, 0]
            }
          },
          absentCount: {
            $sum: {
              $cond: [{ $eq: ['$status', 'absent'] }, 1, 0]
            }
          }
        }
      },
      {
        $addFields: {
          attendancePercentage: {
            $cond: {
              if: { $eq: ['$totalClasses', 0] },
              then: 0,
              else: {
                $multiply: [
                  { $divide: ['$presentCount', '$totalClasses'] },
                  100
                ]
              }
            }
          }
        }
      },
      {
        $match: {
          attendancePercentage: { $lt: 75 }
        }
      },
      {
        $lookup: {
          from: 'students',
          localField: '_id.student',
          foreignField: '_id',
          as: 'student'
        }
      },
      {
        $unwind: '$student'
      },
      {
        $lookup: {
          from: 'users',
          localField: 'student.user',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $group: {
          _id: '$_id.student',
          studentInfo: {
            $first: {
              studentId: '$student.studentId',
              rollNumber: '$student.rollNumber',
              name: { $concat: ['$user.firstName', ' ', '$user.lastName'] },
              email: '$user.email',
              course: '$student.course',
              batch: '$student.batch',
              semester: '$student.semester'
            }
          },
          subjects: {
            $push: {
              subjectCode: '$_id.subjectCode',
              subjectName: '$subjectName',
              attendancePercentage: '$attendancePercentage',
              totalClasses: '$totalClasses',
              presentCount: '$presentCount',
              absentCount: '$absentCount'
            }
          },
          overallAttendance: { $avg: '$attendancePercentage' }
        }
      },
      {
        $addFields: {
          overallAttendance: { $round: ['$overallAttendance', 2] },
          riskLevel: {
            $cond: [
              { $lt: ['$overallAttendance', 50] },
              'critical',
              { $cond: [
                { $lt: ['$overallAttendance', 60] },
                'high',
                'medium'
              ]}
            ]
          }
        }
      },
      { $sort: { overallAttendance: 1 } }
    ]);

    res.json({
      success: true,
      data: {
        atRiskStudents,
        summary: {
          totalAtRisk: atRiskStudents.length,
          critical: atRiskStudents.filter(s => s.riskLevel === 'critical').length,
          high: atRiskStudents.filter(s => s.riskLevel === 'high').length,
          medium: atRiskStudents.filter(s => s.riskLevel === 'medium').length
        }
      }
    });

  } catch (error) {
    console.error('Get at-risk students error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching at-risk students'
    });
  }
}));

// @route   GET /api/faculty/reports/attendance
// @desc    Get attendance reports
// @access  Private (Faculty)
router.get('/reports/attendance', asyncHandler(async (req, res) => {
  try {
    const { subjectCode, startDate, endDate, format = 'summary' } = req.query;

    const faculty = await Faculty.findOne({ user: req.user._id });
    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty profile not found'
      });
    }

    // Set default date range (current month)
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate ? new Date(startDate) : new Date(end.getFullYear(), end.getMonth(), 1);

    let query = {
      faculty: faculty._id,
      date: { $gte: start, $lte: end }
    };

    if (subjectCode) {
      query['subject.subjectCode'] = subjectCode;
    }

    if (format === 'detailed') {
      // Detailed report with individual records
      const attendanceRecords = await Attendance.find(query)
        .populate('student', 'studentId rollNumber user course batch')
        .populate({
          path: 'student',
          populate: {
            path: 'user',
            select: 'firstName lastName email'
          }
        })
        .sort({ date: -1, period: 1 });

      res.json({
        success: true,
        data: {
          report: attendanceRecords,
          dateRange: { start, end },
          totalRecords: attendanceRecords.length
        }
      });
    } else {
      // Summary report
      const summaryReport = await Attendance.aggregate([
        { $match: query },
        {
          $group: {
            _id: {
              subjectCode: '$subject.subjectCode',
              date: '$date'
            },
            subjectName: { $first: '$subject.subjectName' },
            totalStudents: { $sum: 1 },
            presentCount: {
              $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] }
            },
            absentCount: {
              $sum: { $cond: [{ $eq: ['$status', 'absent'] }, 1, 0] }
            },
            lateCount: {
              $sum: { $cond: [{ $eq: ['$status', 'late'] }, 1, 0] }
            },
            excusedCount: {
              $sum: { $cond: [{ $eq: ['$status', 'excused'] }, 1, 0] }
            }
          }
        },
        {
          $addFields: {
            attendancePercentage: {
              $multiply: [
                { $divide: ['$presentCount', '$totalStudents'] },
                100
              ]
            }
          }
        },
        { $sort: { '_id.date': -1, '_id.subjectCode': 1 } }
      ]);

      res.json({
        success: true,
        data: {
          report: summaryReport,
          dateRange: { start, end },
          totalClasses: summaryReport.length
        }
      });
    }

  } catch (error) {
    console.error('Get attendance reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching attendance reports'
    });
  }
}));

module.exports = router;