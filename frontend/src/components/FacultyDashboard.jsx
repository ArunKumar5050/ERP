import React, { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import FacultyHeader from './FacultyHeader'
import { apiClient } from '../config/api'
import { useNavigate } from 'react-router-dom'

const FacultyDashboard = () => {
  const [activeTab, setActiveTab] = useState('Home')
  const [dashboardData, setDashboardData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      setError('')
      const response = await apiClient.getFacultyDashboard()
      if (response.success) {
        setDashboardData(response.data)
      } else {
        setError('Failed to fetch dashboard data')
      }
    } catch (err) {
      console.error('Faculty dashboard fetch error:', err)
      setError('Error loading dashboard data')
    } finally {
      setIsLoading(false)
    }
  }

  // Sample data for charts
  const attendanceData = [
    { month: 'Jan', attendance: 85 },
    { month: 'Feb', attendance: 82 },
    { month: 'Mar', attendance: 78 },
    { month: 'Apr', attendance: 88 },
    { month: 'May', attendance: 75 }
  ]

  const studentIssuesData = [
    { name: 'Low Attendance', value: 18, color: '#ef4444' },
    { name: 'Fee Issues', value: 26, color: '#f59e0b' },
    { name: 'Grade Issues', value: 43, color: '#eab308' },
    { name: 'Other Issues', value: 13, color: '#22c55e' }
  ]

  const todaySchedule = [
    {
      time: '09:00 AM',
      subject: 'Data Structures',
      code: 'CS 301',
      status: 'completed'
    },
    {
      time: '11:00 AM', 
      subject: 'Database Systems',
      code: 'CS 402',
      status: 'ongoing'
    },
    {
      time: '02:00 PM',
      subject: 'Web Development', 
      code: 'CS 503',
      status: 'upcoming'
    }
  ]

  // Remove tabs array since it's now in FacultyHeader

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <FacultyHeader activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <FacultyHeader activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
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
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <FacultyHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Faculty Dashboard</h2>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-3xl font-bold text-gray-900">{dashboardData?.stats?.totalStudents || 0}</p>
                <p className="text-xs text-gray-500">Across all classes</p>
              </div>
              <div className="text-2xl">👥</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Classes</p>
                <p className="text-3xl font-bold text-gray-900">{dashboardData?.todaySchedule?.length || 0}</p>
                <p className="text-xs text-gray-500">Scheduled for today</p>
              </div>
              <div className="text-2xl">📚</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">At-Risk Students</p>
                <p className="text-3xl font-bold text-red-600">{dashboardData?.stats?.atRiskStudents || 0}</p>
                <p className="text-xs text-gray-500">Needs attention</p>
              </div>
              <div className="text-2xl">⚠️</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Attendance</p>
                <p className="text-3xl font-bold text-green-600">{dashboardData?.stats?.averageAttendance || 0}%</p>
                <p className="text-xs text-gray-500">This semester</p>
              </div>
              <div className="text-2xl">📊</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-md transition-shadow"
               onClick={() => navigate('/faculty/at-risk')}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">View All</p>
                <p className="text-lg font-bold text-blue-600">At-Risk Students</p>
                <p className="text-xs text-gray-500">Detailed analysis</p>
              </div>
              <div className="text-2xl">→</div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Attendance Trends */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Attendance Trends</h3>
              <button className="text-sm text-gray-500 hover:text-gray-700">📈</button>
            </div>
            <p className="text-sm text-gray-600 mb-4">Monthly average attendance across all classes</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={attendanceData}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Line 
                    type="monotone" 
                    dataKey="attendance" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Student Issues */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Student Issues</h3>
              <button className="text-sm text-gray-500 hover:text-gray-700">📋</button>
            </div>
            <p className="text-sm text-gray-600 mb-4">Distribution of current student problems</p>
            <div className="h-64 flex items-center">
              <div className="w-1/2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={studentIssuesData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                    >
                      {studentIssuesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-1/2 space-y-2">
                {studentIssuesData.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm text-gray-600">{item.name} {item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Today's Schedule</h3>
            <p className="text-sm text-gray-600">Your classes for today</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {todaySchedule.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm font-medium text-gray-900 w-20">
                      {item.time}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.subject}</p>
                      <p className="text-xs text-gray-500">{item.code}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span 
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.status === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : item.status === 'ongoing'
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {item.status === 'completed' ? 'Completed' : 
                       item.status === 'ongoing' ? 'Ongoing' : 'Upcoming'}
                    </span>
                    <button className="px-4 py-2 bg-gray-900 text-white text-xs rounded hover:bg-gray-800">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FacultyDashboard