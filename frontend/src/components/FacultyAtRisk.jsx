import React, { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import FacultyHeader from './FacultyHeader'

const FacultyAtRisk = () => {
  const [activeTab, setActiveTab] = useState('All Stud')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('All Issues')
  const [selectedLevel, setSelectedLevel] = useState('All Levels')

  // Risk level statistics
  const riskStats = [
    { level: 'Critical Risk', count: 1, color: 'bg-red-100 border-red-300 text-red-800' },
    { level: 'High Risk', count: 1, color: 'bg-orange-100 border-orange-300 text-orange-800' },
    { level: 'Medium Risk', count: 1, color: 'bg-yellow-100 border-yellow-300 text-yellow-800' },
    { level: 'Avg Attendance', count: '50%', color: 'bg-blue-100 border-blue-300 text-blue-800' }
  ]

  // Issues distribution data for bar chart
  const issuesDistribution = [
    { issue: 'Low Attendance', count: 15, color: '#ef4444' },
    { issue: 'Fee Issues', count: 8, color: '#ef4444' },
    { issue: 'Back Papers', count: 12, color: '#ef4444' },
    { issue: 'Other Issues', count: 5, color: '#ef4444' }
  ]

  // At-risk students data
  const [students] = useState([
    {
      id: 1,
      name: 'John Doe',
      rollNo: 'CS101_001',
      subject: 'Data Structures',
      attendance: '45%',
      lastSeen: '2024-08-12',
      riskLevel: 'critical',
      issues: ['Low Attendance', 'Back Papers'],
      status: 'critical'
    },
    {
      id: 2,
      name: 'Jane Smith',
      rollNo: 'CS102_015',
      subject: 'Database Systems',
      attendance: '68%',
      lastSeen: '2024-08-15',
      riskLevel: 'medium',
      issues: ['Fee Issues'],
      status: 'medium'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      rollNo: 'CS103_022',
      subject: 'Web Development',
      attendance: '55%',
      lastSeen: '2024-08-10',
      riskLevel: 'high',
      issues: ['Low Attendance', 'Other Issues'],
      status: 'critical'
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      rollNo: 'CS101_045',
      subject: 'Algorithm Analysis',
      attendance: '62%',
      lastSeen: '2024-08-14',
      riskLevel: 'medium',
      issues: ['Back Papers'],
      status: 'low'
    }
  ])

  // Filter students based on search and filters
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = selectedFilter === 'All Issues' || 
                         student.issues.some(issue => issue === selectedFilter)
    const matchesLevel = selectedLevel === 'All Levels' || 
                        student.riskLevel === selectedLevel.toLowerCase()
    
    return matchesSearch && matchesFilter && matchesLevel
  })

  // Get status styling
  const getStatusStyling = (status) => {
    switch (status) {
      case 'critical':
        return {
          bg: 'bg-red-50 border-red-200',
          badge: 'bg-red-600 text-white',
          text: 'Critical'
        }
      case 'high':
        return {
          bg: 'bg-orange-50 border-orange-200',
          badge: 'bg-orange-600 text-white',
          text: 'High Risk'
        }
      case 'medium':
        return {
          bg: 'bg-yellow-50 border-yellow-200',
          badge: 'bg-yellow-600 text-white',
          text: 'Medium'
        }
      case 'low':
        return {
          bg: 'bg-green-50 border-green-200',
          badge: 'bg-green-600 text-white',
          text: 'Low Risk'
        }
      default:
        return {
          bg: 'bg-gray-50 border-gray-200',
          badge: 'bg-gray-600 text-white',
          text: 'Unknown'
        }
    }
  }

  // Get attendance styling
  const getAttendanceColor = (attendance) => {
    const percent = parseInt(attendance)
    if (percent < 50) return 'text-red-600'
    if (percent < 70) return 'text-orange-600'
    if (percent < 85) return 'text-yellow-600'
    return 'text-green-600'
  }

  const handleViewDetails = (studentId) => {
    console.log('Viewing details for student:', studentId)
    // Add navigation to student details page
  }

  const handleSendReminder = (studentId) => {
    console.log('Sending reminder to student:', studentId)
    // Add reminder functionality
  }

  const handleBulkAction = (action) => {
    console.log('Performing bulk action:', action)
    // Add bulk action functionality
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <FacultyHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">At-Risk Students</h2>
            <p className="text-sm text-gray-600">Monitor and support students who need attention</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handleBulkAction('reminder')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              📨 Send Reminders
            </button>
            <button
              onClick={() => handleBulkAction('report')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              📊 Generate Report
            </button>
          </div>
        </div>

        {/* Risk Level Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {riskStats.map((stat, index) => (
            <div key={index} className={`rounded-lg border p-6 ${stat.color}`}>
              <div className="text-center">
                <p className="text-sm font-medium mb-2">{stat.level}</p>
                <p className="text-3xl font-bold">{stat.count}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Issues Distribution Chart */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">📊 Issues Distribution</h3>
            <p className="text-sm text-gray-600">Common problems among at-risk students</p>
          </div>
          <div className="p-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={issuesDistribution}>
                  <XAxis 
                    dataKey="issue" 
                    axisLine={false} 
                    tickLine={false}
                    fontSize={12}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false}
                    fontSize={12}
                  />
                  <Bar 
                    dataKey="count" 
                    fill="#ef4444" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Filter Students */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">🔍 Filter Students</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <input
                  type="text"
                  placeholder="🔍 Search by name or roll number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="All Issues">All Issues</option>
                  <option value="Low Attendance">Low Attendance</option>
                  <option value="Fee Issues">Fee Issues</option>
                  <option value="Back Papers">Back Papers</option>
                  <option value="Other Issues">Other Issues</option>
                </select>
              </div>
              <div>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="All Levels">All Levels</option>
                  <option value="Critical">Critical Risk</option>
                  <option value="High">High Risk</option>
                  <option value="Medium">Medium Risk</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Students List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">👥 Students ({filteredStudents.length})</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {filteredStudents.map((student) => {
                const statusStyle = getStatusStyling(student.status)
                return (
                  <div
                    key={student.id}
                    className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${statusStyle.bg}`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{student.name}</p>
                        <p className="text-xs text-gray-500">
                          {student.rollNo} • {student.subject}
                        </p>
                        <p className="text-xs text-gray-500">
                          Last seen: {student.lastSeen}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className={`text-sm font-bold ${getAttendanceColor(student.attendance)}`}>
                          {student.attendance} Attendance
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {student.issues.map((issue, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full"
                            >
                              {issue}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle.badge}`}>
                        {statusStyle.text}
                      </span>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleSendReminder(student.id)}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 transition-colors"
                        >
                          📨 Send Reminder
                        </button>
                        <button
                          onClick={() => handleViewDetails(student.id)}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200 transition-colors"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            
            {filteredStudents.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No students found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FacultyAtRisk