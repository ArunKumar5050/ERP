import React, { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import FacultyHeader from './FacultyHeader'

const FacultySelfAttendance = () => {
  const [activeTab, setActiveTab] = useState('My Attendance')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedLeaveDate, setSelectedLeaveDate] = useState(new Date())
  const [leaveType, setLeaveType] = useState('')
  const [leaveReason, setLeaveReason] = useState('')
  const [attendanceStatus, setAttendanceStatus] = useState('Present')
  const [hoursWorked, setHoursWorked] = useState('8')
  const [remarks, setRemarks] = useState('')

  // Monthly attendance trends data
  const attendanceTrends = [
    { month: 'Jan', percentage: 85 },
    { month: 'Feb', percentage: 92 },
    { month: 'Mar', percentage: 88 },
    { month: 'Apr', percentage: 95 },
    { month: 'May', percentage: 90 }
  ]

  // Recent attendance history
  const attendanceHistory = [
    { date: '16/09/2024', status: 'present', type: 'Regular day', hours: '8 hrs', classes: '4 classes' },
    { date: '15/09/2024', status: 'present', type: 'Department meeting', hours: '7.5 hrs', classes: '2 classes' },
    { date: '14/09/2024', status: 'absent', type: 'Sick leave', hours: '0 hrs', classes: '0 classes' },
    { date: '13/09/2024', status: 'present', type: 'Full schedule', hours: '8 hrs', classes: '4 classes' },
    { date: '12/09/2024', status: 'present', type: 'Half day - personal work', hours: '4 hrs', classes: '2 classes' }
  ]

  // Today's schedule
  const todaySchedule = [
    { time: '09:00 AM', subject: 'Data Structures', code: 'CS-101', duration: '90 min', status: 'completed' },
    { time: '11:00 AM', subject: 'Database Systems', code: 'CS-102', duration: '90 min', status: 'completed' },
    { time: '02:00 PM', subject: 'Web Development', code: 'CS-103', duration: '90 min', status: 'upcoming' },
    { time: '03:30 PM', subject: 'Department Meeting', code: 'Faculty Room', duration: '60 min', status: 'upcoming' }
  ]

  // Calendar functions and data can be added later if needed

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 border-green-300 text-green-800'
      case 'absent':
        return 'bg-red-100 border-red-300 text-red-800'
      case 'completed':
        return 'bg-green-600 text-white'
      case 'upcoming':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleMarkAttendance = () => {
    // Handle attendance marking logic
    console.log('Marking attendance:', { selectedDate, attendanceStatus, hoursWorked, remarks })
  }

  const handleLeaveRequest = () => {
    // Handle leave request logic
    console.log('Submitting leave request:', { selectedLeaveDate, leaveType, leaveReason })
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <FacultyHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Teacher Self Attendance</h2>
          <p className="text-sm text-gray-600">Track and manage your attendance</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-green-100 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">✅ Attendance Rate</p>
                <p className="text-3xl font-bold text-green-700">80%</p>
                <p className="text-xs text-green-500">This month</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-100 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">⏰ Hours This Week</p>
                <p className="text-3xl font-bold text-blue-700">38.5</p>
                <p className="text-xs text-blue-500">Target: 40 hours</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-100 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">📚 Classes Today</p>
                <p className="text-3xl font-bold text-purple-700">3</p>
                <p className="text-xs text-purple-500">2 completed</p>
              </div>
            </div>
          </div>

          <div className="bg-orange-100 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">🏖️ Leave Balance</p>
                <p className="text-3xl font-bold text-orange-700">12</p>
                <p className="text-xs text-orange-500">Days remaining</p>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">📅 Today's Schedule</h3>
            <p className="text-sm text-gray-600">Your classes and meetings for today</p>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {todaySchedule.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm font-medium text-gray-900 w-20">{item.time}</div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.subject}</p>
                      <p className="text-xs text-gray-500">{item.code} • {item.duration}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                    {item.status === 'completed' ? 'Completed' : 'Upcoming'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mark Attendance and Request Leave */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Mark Attendance */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">📝 Mark Attendance</h3>
              <p className="text-sm text-gray-600">Record your attendance for today or any previous date</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                  <input
                    type="date"
                    value={selectedDate.toISOString().split('T')[0]}
                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Attendance Status</label>
                  <select
                    value={attendanceStatus}
                    onChange={(e) => setAttendanceStatus(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                    <option value="Half Day">Half Day</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hours Worked</label>
                  <input
                    type="number"
                    value={hoursWorked}
                    onChange={(e) => setHoursWorked(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="8"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Remarks (Optional)</label>
                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    rows="3"
                    placeholder="Add any remarks about your day..."
                  />
                </div>

                <button
                  onClick={handleMarkAttendance}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Mark Attendance
                </button>
              </div>
            </div>
          </div>

          {/* Request Leave */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">🏖️ Request Leave</h3>
              <p className="text-sm text-gray-600">Submit a leave request for future dates</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Leave Date</label>
                  <input
                    type="date"
                    value={selectedLeaveDate.toISOString().split('T')[0]}
                    onChange={(e) => setSelectedLeaveDate(new Date(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Leave Type</label>
                  <select
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select leave type</option>
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Personal Leave">Personal Leave</option>
                    <option value="Emergency Leave">Emergency Leave</option>
                    <option value="Conference">Conference</option>
                    <option value="Training">Training</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                  <textarea
                    value={leaveReason}
                    onChange={(e) => setLeaveReason(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="4"
                    placeholder="Explain the reason for leave..."
                  />
                </div>

                <button
                  onClick={handleLeaveRequest}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Submit Leave Request
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Charts and History */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Monthly Attendance Trends */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">📈 Monthly Attendance Trends</h3>
              <p className="text-sm text-gray-600">Your attendance percentage over months</p>
            </div>
            <div className="p-6">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={attendanceTrends}>
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis 
                      domain={[0, 100]} 
                      axisLine={false} 
                      tickLine={false}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="percentage" 
                      stroke="#8b5cf6" 
                      strokeWidth={3}
                      dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Attendance History */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">📋 Recent Attendance History</h3>
              <p className="text-sm text-gray-600">Last 5 days attendance record</p>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {attendanceHistory.map((record, index) => (
                  <div key={index} className={`p-3 border rounded-lg ${getStatusColor(record.status)}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{record.date}</p>
                        <p className="text-xs">{record.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{record.hours}</p>
                        <p className="text-xs">{record.classes}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FacultySelfAttendance