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

module.exports = router;