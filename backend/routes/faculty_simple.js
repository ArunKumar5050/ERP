const express = require('express');
const { Faculty, Student, Attendance, User } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/common');

const router = express.Router();

// All routes require authentication and faculty role
router.use(authenticate);
router.use(authorize('faculty'));

// @route   GET /api/faculty/dashboard
// @desc    Get faculty dashboard data (simplified version)
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

    // Get total students count (simplified)
    const totalStudentsCount = await Student.countDocuments({
      'academicInfo.status': 'active'
    });

    // Get today's schedule (simplified)
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const todaySchedule = [];
    
    if (faculty.subjects) {
      faculty.subjects.forEach(subject => {
        if (subject.classSchedule) {
          subject.classSchedule
            .filter(schedule => schedule.day === today)
            .forEach(schedule => {
              todaySchedule.push({
                ...schedule,
                subjectName: subject.subjectName,
                subjectCode: subject.subjectCode
              });
            });
        }
      });
    }

    // Get basic attendance stats (simplified)
    let atRiskStudents = [];
    let averageAttendance = 0;
    
    try {
      // Simple count of attendance records
      const totalAttendanceRecords = await Attendance.countDocuments({ faculty: faculty._id });
      const presentRecords = await Attendance.countDocuments({ 
        faculty: faculty._id, 
        status: 'present' 
      });
      
      averageAttendance = totalAttendanceRecords > 0 ? 
        Math.round((presentRecords / totalAttendanceRecords) * 100) : 0;
        
      // Simple at-risk students query
      const students = await Student.find({ 
        'academicInfo.status': 'active' 
      }).limit(10);
      
      atRiskStudents = students.slice(0, 5); // Simplified for now
      
    } catch (aggregationError) {
      console.log('Aggregation error, using defaults:', aggregationError.message);
    }

    // Simple response
    res.json({
      success: true,
      data: {
        faculty,
        stats: {
          totalStudents: totalStudentsCount || 0,
          todayClasses: todaySchedule.length || 0,
          atRiskStudents: atRiskStudents.length || 0,
          totalSubjects: faculty.subjects ? faculty.subjects.length : 0,
          averageAttendance: averageAttendance || 0
        },
        todaySchedule: todaySchedule || [],
        atRiskStudents: atRiskStudents || [],
        attendanceTrends: [
          { month: 'Jan', attendance: 85 },
          { month: 'Feb', attendance: 82 },
          { month: 'Mar', attendance: 78 },
          { month: 'Apr', attendance: 88 },
          { month: 'May', attendance: 75 }
        ],
        subjectStats: faculty.subjects ? faculty.subjects.map(subject => ({
          subjectCode: subject.subjectCode,
          subjectName: subject.subjectName,
          credits: subject.credits,
          totalStudents: Math.floor(Math.random() * 50) + 20, // Placeholder
          avgAttendance: Math.floor(Math.random() * 30) + 70 // Placeholder
        })) : []
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

// @route   GET /api/faculty/students
// @desc    Get all students for the faculty
// @access  Private (Faculty)
router.get('/students', asyncHandler(async (req, res) => {
  try {
    // Fetch all students with basic information
    const students = await Student.find({ 
      'academicInfo.status': 'active' 
    })
    .populate('user', 'firstName lastName email phone')
    .select('studentId rollNumber user course batch semester section branch')
    .sort({ branch: 1, semester: 1, section: 1, rollNumber: 1 });

    // Transform the data to include full name
    const transformedStudents = students.map(student => ({
      _id: student._id,
      studentId: student.studentId,
      roll_no: student.rollNumber,
      name: student.user ? `${student.user.firstName} ${student.user.lastName}` : 'Unknown',
      email: student.user ? student.user.email : '',
      phone_no: student.user ? student.user.phone : '',
      branch: student.branch,
      semester: student.semester,
      section: student.section,
      course: student.course,
      batch: student.batch
    }));

    res.json({
      success: true,
      data: transformedStudents,
      count: transformedStudents.length
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching students data'
    });
  }
}));

// @route   GET /api/faculty/students/with-attendance
// @desc    Get students with attendance data for faculty's subjects
// @access  Private (Faculty)
router.get('/students/with-attendance', asyncHandler(async (req, res) => {
  try {
    console.log('Fetching students with attendance for faculty:', req.user._id);
    
    const faculty = await Faculty.findOne({ user: req.user._id });
    if (!faculty) {
      console.log('Faculty not found for user:', req.user._id);
      return res.status(404).json({
        success: false,
        message: 'Faculty profile not found'
      });
    }

    console.log('Faculty found:', {
      _id: faculty._id,
      user: faculty.user,
      subjects: faculty.subjects
    });
    
    // Handle different data structures for subjects
    let subjectCodes = [];
    if (faculty.subjects) {
      if (Array.isArray(faculty.subjects) && faculty.subjects.length > 0) {
        // Check if subjects is an array of strings or objects
        if (typeof faculty.subjects[0] === 'string') {
          // Subjects is already an array of subject codes
          subjectCodes = faculty.subjects;
        } else if (typeof faculty.subjects[0] === 'object') {
          // Subjects is an array of objects with subjectCode property
          subjectCodes = faculty.subjects.map(subject => subject.subjectCode);
        }
      }
    }
    
    console.log('Subject codes:', subjectCodes);
    
    // Get all students with populated user data
    let allStudents = [];
    try {
      allStudents = await Student.find({})
        .populate('user', 'firstName lastName email phone') // This should work now
        .select('studentId rollNumber user course batch semester section branch')
        .sort({ branch: 1, semester: 1, section: 1, rollNumber: 1 });
      console.log('All students found:', allStudents.length);
    } catch (studentError) {
      console.error('Error fetching students:', studentError);
      throw new Error('Failed to fetch students: ' + studentError.message);
    }

    if (allStudents.length > 0) {
      console.log('Sample student:', {
        _id: allStudents[0]._id,
        studentId: allStudents[0].studentId,
        rollNumber: allStudents[0].rollNumber,
        user: allStudents[0].user
      });
    }

    // If faculty has subjects, get attendance data for those subjects
    let attendanceData = [];
    if (subjectCodes.length > 0) {
      console.log('Fetching attendance data for faculty:', faculty._id, 'and subjects:', subjectCodes);
      try {
        attendanceData = await Attendance.aggregate([
          {
            $match: {
              faculty_id: faculty._id
            }
          },
          {
            $lookup: {
              from: 'subjects',
              localField: 'subject_id',
              foreignField: '_id',
              as: 'subject'
            }
          },
          {
            $unwind: '$subject'
          },
          {
            $match: {
              'subject.subject_code': { $in: subjectCodes }
            }
          },
          {
            $group: {
              _id: '$student_id',
              totalClasses: { $sum: '$total_classes' },
              presentCount: { $sum: '$present_classes' },
              absentCount: { $sum: '$absent_classes' },
              lateCount: { $sum: '$late_classes' },
              excusedCount: { $sum: '$excused_classes' },
              lastAttendanceDate: { $max: { $arrayElemAt: ['$attendance_records.date', -1] } }
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
                      { $divide: [{ $add: ['$presentCount', '$lateCount'] }, '$totalClasses'] },
                      100
                    ]
                  }
                }
              }
            }
          }
        ]);
        console.log('Attendance data found:', attendanceData.length);
      } catch (attendanceError) {
        console.error('Error fetching attendance data:', attendanceError);
        // Don't throw error here, just continue with empty attendance data
        attendanceData = [];
      }
    } else {
      console.log('No subject codes found for faculty');
    }

    // Create a map for quick lookup
    const attendanceMap = {};
    attendanceData.forEach(record => {
      attendanceMap[record._id.toString()] = {
        attendance: Math.round(record.attendancePercentage || 0),
        totalClasses: record.totalClasses || 0,
        presentCount: record.presentCount || 0,
        absentCount: record.absentCount || 0,
        lastSeen: record.lastAttendanceDate ? new Date(record.lastAttendanceDate).toLocaleDateString('en-GB') : 'Never'
      };
    });

    // Combine student data with attendance data
    const studentsWithAttendance = allStudents.map(student => {
      const attendance = attendanceMap[student._id.toString()] || {
        attendance: 0,
        totalClasses: 0,
        presentCount: 0,
        absentCount: 0,
        lastSeen: 'Never'
      };

      const result = {
        _id: student._id,
        studentId: student.studentId,
        roll_no: student.rollNumber,
        name: student.user ? `${student.user.firstName} ${student.user.lastName}` : 'Unknown Student',
        email: student.user ? student.user.email : '',
        phone_no: student.user ? student.user.phone : '',
        branch: student.branch,
        semester: student.semester,
        section: student.section,
        course: student.course,
        batch: student.batch,
        attendance: attendance.attendance,
        totalClasses: attendance.totalClasses,
        presentCount: attendance.presentCount,
        absentCount: attendance.absentCount,
        lastSeen: attendance.lastSeen,
        isPresent: true // Default for new attendance marking
      };
      
      console.log('Processed student:', result.name, '-', result._id);
      return result;
    });

    console.log('Final students with attendance:', studentsWithAttendance.length);

    res.json({
      success: true,
      data: studentsWithAttendance,
      count: studentsWithAttendance.length,
      summary: {
        totalStudents: studentsWithAttendance.length,
        withAttendanceData: attendanceData.length,
        averageAttendance: attendanceData.length > 0 ? 
          Math.round(attendanceData.reduce((sum, record) => sum + (record.attendancePercentage || 0), 0) / attendanceData.length) : 0
      }
    });
  } catch (error) {
    console.error('Error fetching students with attendance:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching students with attendance data: ' + error.message
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

    const subjectCodes = faculty.subjects ? faculty.subjects.map(subject => subject.subjectCode) : [];

    const atRiskStudents = await Attendance.aggregate([
      {
        $match: {
          faculty_id: faculty._id
        }
      },
      {
        $lookup: {
          from: 'subjects',
          localField: 'subject_id',
          foreignField: '_id',
          as: 'subject'
        }
      },
      {
        $unwind: '$subject'
      },
      {
        $match: {
          'subject.subject_code': { $in: subjectCodes }
        }
      },
      {
        $group: {
          _id: {
            student: '$student_id',
            subjectCode: '$subject.subject_code'
          },
          subjectName: { $first: '$subject.subject_name' },
          totalClasses: { $sum: '$total_classes' },
          presentCount: { $sum: '$present_classes' },
          absentCount: { $sum: '$absent_classes' },
          lateCount: { $sum: '$late_classes' },
          excusedCount: { $sum: '$excused_classes' }
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
                  { $divide: [{ $add: ['$presentCount', '$lateCount'] }, '$totalClasses'] },
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

module.exports = router;