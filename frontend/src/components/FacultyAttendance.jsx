import React, { useState, useEffect } from 'react'
import FacultyHeader from './FacultyHeader'
import { apiClient } from '../config/api'

const FacultyAttendance = () => {
  const [activeTab, setActiveTab] = useState('Attendance')
  const [selectedClass, setSelectedClass] = useState('CS-101')
  const [searchTerm, setSearchTerm] = useState('')
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Available classes
  const classes = [
    { id: 'CS-101', name: 'Data Structures', time: '09:00 AM', students: 45 },
    { id: 'CS-102', name: 'Database Systems', time: '11:00 AM', students: 38 },
    { id: 'CS-103', name: 'Web Development', time: '02:00 PM', students: 42 }
  ]

  // Fetch students data from the backend
  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      setLoading(true)
      setError('')
      
      // Debug: Check if user is authenticated
      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')
      console.log('Auth check:', { token: !!token, user: user ? JSON.parse(user) : null })
      
      if (!token) {
        setError('You are not logged in. Please log in again.')
        setLoading(false)
        return
      }
      
      // Fetch real student data with attendance from the backend
      console.log('Fetching students with attendance data...')
      const response = await apiClient.getFacultyStudentsWithAttendance()
      console.log('Raw API response:', response)
      
      if (response.success && response.data) {
        console.log('Response data:', response.data)
        console.log('Data length:', response.data.length)
        
        // Handle case where data might be an object with count and data properties
        let studentData = response.data;
        if (response.data.data && Array.isArray(response.data.data)) {
          studentData = response.data.data;
          console.log('Using nested data array:', studentData.length)
        } else if (Array.isArray(response.data)) {
          console.log('Using direct data array:', studentData.length)
        } else {
          console.error('Unexpected data format:', typeof response.data)
          throw new Error('Invalid data format received from server')
        }
        
        // The data is already in the correct format from the backend
        const transformedStudents = studentData.map((student) => {
          console.log('Processing student:', student)
          return {
            id: student._id || student.id,
            name: student.name || 'Unknown Student',
            rollNo: student.roll_no || student.rollNo || 'N/A',
            studentId: student.studentId || 'N/A',
            email: student.email || '',
            phone: student.phone_no || student.phone || '',
            branch: student.branch || 'N/A',
            semester: student.semester || 'N/A',
            section: student.section || 'N/A',
            course: student.course || 'N/A',
            batch: student.batch || 'N/A',
            attendance: student.attendance !== undefined ? student.attendance : 0,
            totalClasses: student.totalClasses || 0,
            presentCount: student.presentCount || 0,
            absentCount: student.absentCount || 0,
            lastSeen: student.lastSeen || 'Never',
            isPresent: student.isPresent !== undefined ? student.isPresent : true
          }
        })
        
        console.log('Transformed students:', transformedStudents)
        setStudents(transformedStudents)
        console.log('Students loaded successfully:', transformedStudents.length)
      } else {
        console.error('API response not successful:', response)
        throw new Error(response.message || 'Failed to fetch students')
      }
    } catch (err) {
      console.error('Error fetching students:', err)
      console.error('Error details:', {
        message: err.message,
        status: err.status,
        response: err.response
      })
      
      // Provide more specific error messages
      if (err.message && err.message.includes('401')) {
        setError('Authentication failed. Please log in again.')
      } else if (err.message && err.message.includes('404')) {
        setError('Students endpoint not found. Please contact administrator.')
      } else if (err.message && (err.message.includes('fetch') || err.message.includes('network'))) {
        setError('Unable to connect to server. Please check your connection.')
      } else if (err.message && err.message.includes('timeout')) {
        setError('Server request timed out. Please try again.')
      } else if (err.message) {
        setError('Failed to load student data: ' + err.message)
      } else {
        setError('Failed to load student data. Please try again.')
      }
      
      // Set empty array instead of fallback data to avoid confusion
      setStudents([])
    } finally {
      setLoading(false)
    }
  }

  // Filter students based on search term
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Calculate attendance summary
  const totalStudents = students.length
  const presentStudents = students.filter(s => s.isPresent).length
  const absentStudents = totalStudents - presentStudents
  const attendanceRate = totalStudents > 0 ? Math.round((presentStudents / totalStudents) * 100) : 0

  // Toggle individual student attendance
  const toggleStudentAttendance = (studentId) => {
    setStudents(students.map(student =>
      student.id === studentId
        ? { ...student, isPresent: !student.isPresent }
        : student
    ))
  }

  // Mark all students present
  const markAllPresent = () => {
    setStudents(students.map(student => ({ ...student, isPresent: true })))
  }

  // Mark all students absent
  const markAllAbsent = () => {
    setStudents(students.map(student => ({ ...student, isPresent: false })))
  }

  // Get row background color based on attendance status
  const getRowColor = (student) => {
    if (!student.isPresent) {
      return 'bg-red-50'
    }
    if (student.attendance < 75) {
      return 'bg-red-50'
    }
    return 'bg-green-50'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <FacultyHeader activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading student data...</p>
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
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={fetchStudents}
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
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Mark Attendance</h2>
          <p className="text-sm text-gray-600">Mark attendance for your classes</p>
        </div>

        {/* Class Selection */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Select Class</h3>
            <p className="text-sm text-gray-600 mb-4">Choose the class for which you want to mark attendance</p>
            
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name} - {cls.id} • {cls.time} • {cls.students} students
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Attendance Interface */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">📚 Data Structures</h3>
                <p className="text-sm text-gray-600">CS-101 • 09:00 AM</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <span className="text-2xl font-bold text-green-600">{presentStudents}</span>
                  <span className="text-sm text-gray-600 ml-2">Present</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-red-600">{absentStudents}</span>
                  <span className="text-sm text-gray-600 ml-2">Absent</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="🔍 Search students by name or roll number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={markAllPresent}
                  className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                >
                  Mark All Present
                </button>
                <button
                  onClick={markAllAbsent}
                  className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                >
                  Mark All Absent
                </button>
                <button className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition-colors">
                  Save Attendance
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-4">
              <h4 className="text-base font-semibold text-gray-900">Student List ({filteredStudents.length})</h4>
              <p className="text-sm text-gray-600">Mark attendance for each student</p>
            </div>

            {filteredStudents.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No students found.</p>
                {students.length === 0 && (
                  <button 
                    onClick={fetchStudents}
                    className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Refresh Student List
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    className={`flex items-center justify-between p-4 border border-gray-200 rounded-lg transition-colors ${getRowColor(student)}`}
                  >
                    <div className="flex items-center space-x-4">
                      <input
                        type="checkbox"
                        checked={student.isPresent}
                        onChange={() => toggleStudentAttendance(student.id)}
                        className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{student.name}</p>
                        <p className="text-xs text-gray-500">{student.rollNo} • {student.branch} • Sem {student.semester}</p>
                        {student.email && (
                          <p className="text-xs text-gray-400">{student.email}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{student.attendance}% Overall</p>
                        <p className="text-xs text-gray-500">
                          {student.presentCount || 0}/{student.totalClasses || 0} classes
                        </p>
                        <p className="text-xs text-gray-500">Last: {student.lastSeen}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        student.isPresent 
                          ? 'bg-green-600 text-white' 
                          : 'bg-red-600 text-white'
                      }`}>
                        {student.isPresent ? 'Present' : 'Absent'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Attendance Summary */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-green-500 rounded-lg shadow p-6 text-white">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">{totalStudents}</div>
                <div className="text-sm">Total Students</div>
              </div>
            </div>
            
            <div className="bg-green-400 rounded-lg shadow p-6 text-white">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">{presentStudents}</div>
                <div className="text-sm">Present Today</div>
              </div>
            </div>
            
            <div className="bg-red-400 rounded-lg shadow p-6 text-white">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">{absentStudents}</div>
                <div className="text-sm">Absent Today</div>
              </div>
            </div>
            
            <div className="bg-blue-400 rounded-lg shadow p-6 text-white">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">{attendanceRate}%</div>
                <div className="text-sm">Attendance Rate</div>
              </div>
            </div>
          </div>
          
          {/* Additional Statistics */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Class Performance</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Above 75%:</span>
                  <span className="text-sm font-medium">
                    {students.filter(s => s.attendance >= 75).length} students
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Below 75%:</span>
                  <span className="text-sm font-medium text-red-600">
                    {students.filter(s => s.attendance < 75).length} students
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Average Attendance:</span>
                  <span className="text-sm font-medium">
                    {totalStudents > 0 ? Math.round(students.reduce((sum, s) => sum + s.attendance, 0) / totalStudents) : 0}%
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Class Distribution</h4>
              <div className="space-y-2">
                {[...new Set(students.map(s => s.branch))].filter(Boolean).map(branch => (
                  <div key={branch} className="flex justify-between">
                    <span className="text-sm text-gray-600">{branch}:</span>
                    <span className="text-sm font-medium">
                      {students.filter(s => s.branch === branch).length} students
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Recent Activity</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Students with Data:</span>
                  <span className="text-sm font-medium">
                    {students.filter(s => s.totalClasses > 0).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">New Students:</span>
                  <span className="text-sm font-medium">
                    {students.filter(s => s.totalClasses === 0).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FacultyAttendance