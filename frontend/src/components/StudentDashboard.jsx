import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  Bell, 
  Headphones, 
  User, 
  BookOpen, 
  Calendar, 
  Clock, 
  CalendarDays,
  BellRing,
  BookOpenCheck,
  AlertTriangle
} from 'lucide-react';
import { apiClient } from '../config/api';


export default function StudentAttendancePortal() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('StudentDashboard mounted');
    console.log('Current user:', localStorage.getItem('user'));
    console.log('Current token:', localStorage.getItem('token'));
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError('');
      console.log('Fetching dashboard data...');
      const response = await apiClient.getStudentDashboard();
      console.log('Dashboard API response:', response);
      if (response.success) {
        setDashboardData(response.data);
        console.log('Dashboard data set successfully:', response.data);
      } else {
        setError('Failed to fetch dashboard data');
        console.error('Dashboard API error:', response);
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError('Error loading dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (timeString) => {
    return new Date(`1970-01-01 ${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getCurrentDaySchedule = () => {
    if (!dashboardData?.currentSemesterSubjects) return [];
    
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const todaySchedule = [];
    
    dashboardData.currentSemesterSubjects.forEach(subject => {
      if (subject.faculty?.subjects) {
        const facultySubject = subject.faculty.subjects.find(
          fs => fs.subjectCode === subject.subjectCode
        );
        
        if (facultySubject?.classSchedule) {
          facultySubject.classSchedule
            .filter(schedule => schedule.day === today)
            .forEach(schedule => {
              todaySchedule.push({
                ...schedule,
                subjectName: subject.subjectName,
                subjectCode: subject.subjectCode,
                facultyName: subject.faculty.user ? 
                  `${subject.faculty.user.firstName} ${subject.faculty.user.lastName}` : 'N/A'
              });
            });
        }
      }
    });
    
    return todaySchedule.sort((a, b) => {
      const timeA = new Date(`1970-01-01 ${a.startTime}`);
      const timeB = new Date(`1970-01-01 ${b.startTime}`);
      return timeA - timeB;
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const student = dashboardData?.student;
  const stats = dashboardData?.stats;
  const todaySchedule = getCurrentDaySchedule();

  return (<>
    
    
  
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
       

        {/* Top Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Subject Attendance Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/attendance')}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Subject Attendance</h3>
                  <p className="text-sm text-gray-600">View detailed subject-wise progress</p>
                </div>
              </div>
              <div className="text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>

          {/* College Notices Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/notice-board')}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Bell className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Announcement</h3>
                  <p className="text-sm text-gray-600">Latest announcements & updates</p>
                </div>
              </div>
              <div className="text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Helpdesk & Counselling Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/helpdesk')}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Headphones className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Helpdesk & Counselling</h3>
                  <p className="text-sm text-gray-600">Get support & book sessions</p>
                </div>
              </div>
              <div className="text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {student?.user?.firstName} {student?.user?.lastName}!
              </h1>
              <p className="text-gray-600">
                Student ID: {student?.studentId} | Roll Number: {student?.rollNumber}
              </p>
              <p className="text-gray-600">
                {student?.course} - Semester {student?.semester} | Section {student?.section}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Overall Attendance */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Overall Attendance</h3>
              <User className="w-5 h-5 text-gray-400" />
            </div>
            <div className="mb-4">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {stats?.overallAttendance || 0}%
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-gray-900 to-green-400 h-2 rounded-full" 
                  style={{width: `${stats?.overallAttendance || 0}%`}}
                ></div>
              </div>
            </div>
          </div>

          {/* Total Classes */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Total Classes</h3>
              <BookOpen className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stats?.totalClasses || 0}
              </div>
              <p className="text-sm text-gray-600">This semester</p>
            </div>
          </div>

          {/* Classes Attended */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Classes Attended</h3>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stats?.attendedClasses || 0}
              </div>
              <p className="text-sm text-green-600">Total attended</p>
            </div>
          </div>

          {/* Classes Missed */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Classes Missed</h3>
              <Clock className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stats?.missedClasses || 0}
              </div>
              <p className="text-sm text-red-600">Total missed</p>
            </div>
          </div>
        </div>

        {/* Today's Class Schedule */}
        <div className="bg-green-50 rounded-2xl border border-green-200 p-8 mb-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Today's Class Schedule</h2>
            <div className="flex items-center text-gray-600">
              <Clock className="w-4 h-4 mr-2" />
              <span className="text-sm">
                Current Time: {new Date().toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                })}
              </span>
            </div>
          </div>

          <div className="space-y-6">
            {todaySchedule.length > 0 ? (
              todaySchedule.map((schedule, index) => (
                <div key={index} className="flex items-start space-x-6">
                  <div className={`w-3 h-16 bg-green-50 rounded-l-full border-l-4 ${
                    schedule.classType === 'Practical' ? 'border-green-400' : 'border-gray-800'
                  }`}></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">
                          {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900">
                          {schedule.subjectName} <span className="text-gray-500">({schedule.subjectCode})</span>
                        </h4>
                        <p className="text-gray-600">
                          {schedule.facultyName} • {schedule.roomNumber}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-sm border ${
                          schedule.classType === 'Practical' 
                            ? 'bg-blue-100 text-blue-700 border-blue-200'
                            : schedule.classType === 'Tutorial'
                            ? 'bg-purple-100 text-purple-700 border-purple-200'
                            : 'bg-green-100 text-green-700 border-green-200'
                        }`}>
                          {schedule.classType}
                        </span>
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Classes Today</h3>
                <p className="text-gray-600">Enjoy your free day!</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mt-8">
            <button className="flex items-center w-sm space-x-2 px-6 py-3 border border-green-200 text-gray-700 rounded-xl hover:bg-green-300 hover:text-white hover:shadow-lg hover:scale-105 transition-all duration-200">
              <CalendarDays className="w-4 h-4" />
              <span>View Full Schedule</span>
            </button>
            <button className="flex items-center w-sm space-x-2 px-6 py-3 border border-green-200 text-gray-700 rounded-xl hover:bg-green-300 hover:text-white hover:shadow-lg hover:scale-105 transition-all duration-200">
              <BellRing className="w-4 h-4" />
              <span>Set Reminders</span>
            </button>
            <button className="flex items-center w-sm space-x-2 px-6 py-3 border border-green-200 text-gray-700 rounded-xl hover:bg-green-300 hover:text-white hover:shadow-lg hover:scale-105 transition-all duration-200">
              <BookOpenCheck className="w-4 h-4" />
              <span>Mark Attendance</span>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-green-50 rounded-2xl border border-green-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Recent Activity</h2>
          
          <div className="space-y-6">
            {dashboardData?.recentAttendance && dashboardData.recentAttendance.length > 0 ? (
              dashboardData.recentAttendance.slice(0, 5).map((attendance, index) => (
                <div key={attendance._id || index} className="flex items-center justify-between py-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      {attendance.subject?.subjectName || 'Unknown Subject'}
                    </h4>
                    <p className="text-gray-600">
                      {new Date(attendance.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                      })} at {attendance.timeSlot?.startTime || 'N/A'}
                    </p>
                    {attendance.faculty?.user && (
                      <p className="text-sm text-gray-500">
                        {attendance.faculty.user.firstName} {attendance.faculty.user.lastName}
                      </p>
                    )}
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm border ${
                    attendance.status === 'present' 
                      ? 'bg-green-100 text-green-700 border-green-200'
                      : attendance.status === 'absent'
                      ? 'bg-red-100 text-red-700 border-red-200'
                      : attendance.status === 'late'
                      ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                      : 'bg-gray-100 text-gray-700 border-gray-200'
                  }`}>
                    {attendance.status ? attendance.status.charAt(0).toUpperCase() + attendance.status.slice(1) : 'Unknown'}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Recent Activity</h3>
                <p className="text-gray-600">Your recent attendance records will appear here!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </>
  );
}