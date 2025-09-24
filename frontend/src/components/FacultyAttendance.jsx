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
      
      // Fetch real student data from the backend
      const response = await apiClient.getFacultyStudents()
      
      if (response.success) {
        // Transform the data to match our component's expected structure
        const transformedStudents = response.data.map((student) => ({
          id: student._id,
          name: student.name,
          rollNo: student.roll_no,
          attendance: Math.floor(Math.random() * 40) + 60, // Mock attendance data
          lastSeen: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB'),
          isPresent: Math.random() > 0.2 // Randomly mark some as absent
        }))
        
        setStudents(transformedStudents)
      } else {
        throw new Error('Failed to fetch students')
      }
    } catch (err) {
      console.error('Error fetching students:', err)
      setError('Failed to load student data')
      // Fallback to mock data
      const mockStudents = [
        { id: 'CS101_001', name: 'Amit Sharma', rollNo: 'CS101_001', attendance: 86, lastSeen: '17/09/2025', isPresent: true },
        { id: 'CS101_002', name: 'Priya Patel', rollNo: 'CS101_002', attendance: 89, lastSeen: '24/09/2025', isPresent: true },
        { id: 'CS101_003', name: 'Rahul Verma', rollNo: 'CS101_003', attendance: 92, lastSeen: '04/09/2025', isPresent: true },
        { id: 'CS101_004', name: 'Sneha Gupta', rollNo: 'CS101_004', attendance: 95, lastSeen: '15/09/2025', isPresent: true },
        { id: 'CS101_005', name: 'Vikram Singh', rollNo: 'CS101_005', attendance: 69, lastSeen: '23/09/2025', isPresent: true },
        { id: 'CS101_006', name: 'Anjali Mehta', rollNo: 'CS101_006', attendance: 67, lastSeen: '17/09/2025', isPresent: false },
        { id: 'CS101_007', name: 'Deepak Kumar', rollNo: 'CS101_007', attendance: 61, lastSeen: '05/09/2025', isPresent: true },
        { id: 'CS101_008', name: 'Neha Reddy', rollNo: 'CS101_008', attendance: 92, lastSeen: '02/09/2025', isPresent: true },
        { id: 'CS101_009', name: 'Arjun Rao', rollNo: 'CS101_009', attendance: 88, lastSeen: '08/09/2025', isPresent: true },
        { id: 'CS101_010', name: 'Pooja Desai', rollNo: 'CS101_010', attendance: 68, lastSeen: '10/09/2025', isPresent: true }
      ]
      
      setStudents(mockStudents)
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
                      <p className="text-xs text-gray-500">{student.rollNo}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{student.attendance}% Overall</p>
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
                <div className="text-sm">Present</div>
              </div>
            </div>
            
            <div className="bg-red-400 rounded-lg shadow p-6 text-white">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">{absentStudents}</div>
                <div className="text-sm">Absent</div>
              </div>
            </div>
            
            <div className="bg-blue-400 rounded-lg shadow p-6 text-white">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">{attendanceRate}%</div>
                <div className="text-sm">Attendance Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FacultyAttendance