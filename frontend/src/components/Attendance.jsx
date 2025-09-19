import React, { useState, useEffect } from 'react';
import { AlertTriangle, Calendar, TrendingUp, Eye, BarChart3, PieChart } from 'lucide-react';
import { apiClient } from '../config/api';

export default function Attendance() {
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch attendance data from API
      const response = await apiClient.getStudentAttendance();
      
      if (response.success) {
        // Transform the data to match the component's expected structure
        const transformedData = transformAttendanceData(response.data);
        setAttendanceData(transformedData);
      } else {
        setError('Failed to fetch attendance data');
      }
    } catch (err) {
      console.error('Error fetching attendance data:', err);
      setError('Error loading attendance data');
    } finally {
      setLoading(false);
    }
  };

  const transformAttendanceData = (apiData) => {
    const subjects = apiData.attendanceSummary.map((subject, index) => {
      // Ensure we're using the correct field names from the API response
      // The backend returns snake_case field names
      const present = subject.present_classes || 0;
      const absent = subject.absent_classes || 0;
      const late = subject.late_classes || 0;
      const excused = subject.excused_classes || 0;
      const total = subject.total_classes || 0;
      
      // Calculate attendance percentage based on only present classes as attended
      // Late, excused, and absent classes are considered as missed
      const attendedClasses = present;
      const percentage = total > 0 ? Math.round((attendedClasses / total) * 100) : 0;
      
      // Calculate total absent as sum of absent + late + excused
      const totalAbsent = absent + late + excused;
      
      // Determine status based on attendance percentage
      let status, borderColor, bgColor, progressColor;
      if (percentage >= 75) {
        status = 'excellent';
        borderColor = 'border-green-300';
        bgColor = 'bg-green-50';
        progressColor = 'from-gray-900 to-green-400';
      } else if (percentage >= 60) {
        status = 'warning';
        borderColor = 'border-yellow-300';
        bgColor = 'bg-yellow-50';
        progressColor = 'from-gray-900 to-yellow-400';
      } else {
        status = 'critical';
        borderColor = 'border-red-300';
        bgColor = 'bg-red-50';
        progressColor = 'from-gray-900 to-red-400';
      }
      
      return {
        id: index + 1,
        name: subject.subject_name || 'Unknown Subject',
        code: subject.subject_code || 'N/A',
        instructor: 'Faculty Name', // In the new schema, we don't have direct instructor info
        percentage: Math.round(percentage),
        present: present,
        late: late,
        absent: totalAbsent, // Display total absent (absent + late + excused)
        excused: excused,
        total: total,
        lastClass: new Date().toISOString().split('T')[0], // Use today's date as placeholder
        status: status,
        borderColor: borderColor,
        bgColor: bgColor,
        progressColor: progressColor,
        warning: percentage < 75 ? `Need ${Math.ceil((75 * total / 100) - attendedClasses)} more classes for safety` : ''
      };
    });
    
    // Calculate summary statistics
    const goodStanding = subjects.filter(s => s.status === 'excellent').length;
    const needAttention = subjects.filter(s => s.status === 'warning').length;
    const criticalRisk = subjects.filter(s => s.status === 'critical').length;
    const overallAverage = subjects.length > 0 
      ? Math.round(subjects.reduce((sum, subject) => sum + subject.percentage, 0) / subjects.length)
      : 0;
    
    return {
      subjects: subjects,
      summary: {
        goodStanding,
        needAttention,
        criticalRisk,
        overallAverage
      }
    };
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-500 text-white';
      case 'warning':
        return 'bg-yellow-500 text-white';
      case 'critical':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'excellent':
        return 'Excellent';
      case 'warning':
        return 'Warning';
      case 'critical':
        return 'Critical';
      default:
        return 'Good';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading attendance data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Attendance</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchAttendanceData}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Get subjects at critical risk for the alert banner
  const criticalSubjects = attendanceData.subjects.filter(subject => subject.status === 'critical');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Attendance Management</h1>
          <p className="text-gray-600">Track your attendance across all subjects and maintain academic requirements</p>
        </div>

        {/* Critical Alert Banner */}
        {criticalSubjects.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-red-800 font-semibold mb-1">Critical Attendance Alert!</h3>
                <p className="text-red-700">
                  You are at risk of dropout in {criticalSubjects.length} subject(s): {criticalSubjects.map(s => s.name).join(', ')}. Immediate action required to maintain minimum 75% attendance.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* View Subject Timetable Button */}
        <div className="flex justify-center mb-8">
          <button className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>View Subject Timetable</span>
          </button>
        </div>

        {/* Subject Attendance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {attendanceData.subjects.map((subject) => (
            <div 
              key={subject.id} 
              className={`${subject.bgColor} rounded-xl border-2 ${subject.borderColor} p-6 hover:shadow-lg transition-shadow relative`}
            >
              {/* Subject Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{subject.name}</h3>
                  <p className="text-sm text-gray-600">{subject.code}</p>
                </div>
                <div className="flex items-center space-x-1">
                  <BarChart3 className="w-4 h-4 text-gray-400" />
                  <Eye className="w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Attendance Percentage */}
              <div className="mb-6">
                <div className={`text-4xl font-bold mb-3 ${
                  subject.percentage >= 75 ? 'text-green-600' : 
                  subject.percentage >= 60 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {subject.percentage}%
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <div 
                    className={`bg-gradient-to-r ${subject.progressColor} h-3 rounded-full transition-all duration-500`}
                    style={{ width: `${subject.percentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Present/Absent Stats */}
              <div className="flex justify-between items-center mb-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">{subject.present}</div>
                  <div className="text-xs text-gray-600">Present</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">{subject.absent}</div>
                  <div className="text-xs text-gray-600">Missed</div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex justify-between items-center mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(subject.status)}`}>
                  {getStatusLabel(subject.status)}
                </span>
                <span className="text-xs text-gray-500">Last: {subject.lastClass}</span>
              </div>

              {/* Warning Message */}
              {subject.warning && (
                <div className="bg-red-100 border border-red-200 rounded-lg p-3 mt-4">
                  <p className="text-red-700 text-sm font-medium">{subject.warning}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Attendance Summary */}
        <div className="bg-green-50 rounded-xl border border-green-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Attendance Summary</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Good Standing */}
            <div className="bg-green-100 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">{attendanceData.summary.goodStanding}</div>
              <div className="text-sm text-green-700 font-medium">Good Standing</div>
            </div>

            {/* Need Attention */}
            <div className="bg-yellow-100 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-yellow-600 mb-2">{attendanceData.summary.needAttention}</div>
              <div className="text-sm text-yellow-700 font-medium">Need Attention</div>
            </div>

            {/* Critical Risk */}
            <div className="bg-red-100 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">{attendanceData.summary.criticalRisk}</div>
              <div className="text-sm text-red-700 font-medium">Critical Risk</div>
            </div>

            {/* Overall Average */}
            <div className="bg-blue-100 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">{attendanceData.summary.overallAverage}%</div>
              <div className="text-sm text-blue-700 font-medium">Overall Average</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <button className="flex items-center justify-center space-x-3 bg-blue-600 text-white p-4 rounded-xl hover:bg-blue-700 transition-colors">
            <Calendar className="w-5 h-5" />
            <span className="font-semibold">View Timetable</span>
          </button>
          <button className="flex items-center justify-center space-x-3 bg-green-600 text-white p-4 rounded-xl hover:bg-green-700 transition-colors">
            <TrendingUp className="w-5 h-5" />
            <span className="font-semibold">Attendance Report</span>
          </button>
          <button className="flex items-center justify-center space-x-3 bg-purple-600 text-white p-4 rounded-xl hover:bg-purple-700 transition-colors">
            <PieChart className="w-5 h-5" />
            <span className="font-semibold">Analytics</span>
          </button>
        </div>
      </div>
    </div>
  );
}