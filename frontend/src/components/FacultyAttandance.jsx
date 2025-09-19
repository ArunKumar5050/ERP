import React, { useState } from 'react'
import FacultyHeader from './FacultyHeader'

const FacultyAttendance = () => {
  const [activeTab, setActiveTab] = useState('Attendance')
  const [selectedClass, setSelectedClass] = useState('Data Structures')
  const [searchTerm, setSearchTerm] = useState('')

  // Class options
  const classes = [
    { name: 'Data Structures', code: 'CS-101', time: '09:00 AM', students: 45 },
    { name: 'Database Systems', code: 'CS-102', time: '11:00 AM', students: 38 },
    { name: 'Web Development', code: 'CS-103', time: '02:00 PM', students: 42 }
  ]

  // Students data with attendance status
  const [students, setStudents] = useState([
    { id: 1, name: 'Student 1', rollNo: 'CS101_001', overallAttendance: 86, lastSeen: '17/09/2025', isPresent: true },
    { id: 2, name: 'Student 2', rollNo: 'CS101_002', overallAttendance: 89, lastSeen: '24/09/2025', isPresent: true },
    { id: 3, name: 'Student 3', rollNo: 'CS101_003', overallAttendance: 92, lastSeen: '03/09/2025', isPresent: true },
    { id: 4, name: 'Student 4', rollNo: 'CS101_004', overallAttendance: 95, lastSeen: '15/09/2025', isPresent: true },
    { id: 5, name: 'Student 5', rollNo: 'CS101_005', overallAttendance: 69, lastSeen: '23/09/2025', isPresent: true },
    { id: 6, name: 'Student 6', rollNo: 'CS101_006', overallAttendance: 67, lastSeen: '17/09/2025', isPresent: false },
    { id: 7, name: 'Student 7', rollNo: 'CS101_007', overallAttendance: 61, lastSeen: '05/09/2025', isPresent: true },
    { id: 8, name: 'Student 8', rollNo: 'CS101_008', overallAttendance: 92, lastSeen: '02/09/2025', isPresent: true },
    { id: 9, name: 'Student 9', rollNo: 'CS101_009', overallAttendance: 78, lastSeen: '08/09/2025', isPresent: true }
  ])

  // Filter students based on search term
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Calculate statistics
  const presentCount = students.filter(s => s.isPresent).length
  const absentCount = students.filter(s => !s.isPresent).length
  const totalStudents = students.length
  const attendanceRate = Math.round((presentCount / totalStudents) * 100)

  // Toggle individual student attendance
  const toggleStudentAttendance = (studentId) => {
    setStudents(prev => prev.map(student => 
      student.id === studentId 
        ? { ...student, isPresent: !student.isPresent }
        : student
    ))
  }

  // Mark all present/absent
  const markAllPresent = () => {
    setStudents(prev => prev.map(student => ({ ...student, isPresent: true })))
  }

  const markAllAbsent = () => {
    setStudents(prev => prev.map(student => ({ ...student, isPresent: false })))
  }

  // Get row background color based on attendance status
  const getRowBackground = (student) => {
    if (!student.isPresent) {
      return 'bg-red-50 border-red-200'
    }
    if (student.overallAttendance < 75) {
      return 'bg-yellow-50 border-yellow-200'
    }
    return 'bg-green-50 border-green-200'
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <FacultyHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Mark Attendance</h2>
        </div>

        {/* Class Selection */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Select Class</h3>
            <p className="text-sm text-gray-600 mb-4">Choose the class for which you want to mark attendance</p>
            
            <select 
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              {classes.map((cls, index) => (
                <option key={index} value={cls.name}>
                  {cls.name} • {cls.code} • {cls.time} • {cls.students} students
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Attendance Management */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="text-lg font-semibold text-gray-900">
                  📚 {selectedClass}
                </div>
                <div className="text-sm text-gray-600">
                  CS-101 • 09:00 AM
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-green-600">
                    <span className="text-xl font-bold">{presentCount}</span>
                    <span className="text-sm ml-1">Present</span>
                  </div>
                  <div className="flex items-center text-red-600">
                    <span className="text-xl font-bold">{absentCount}</span>
                    <span className="text-sm ml-1">Absent</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Search students by name or roll number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                />
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
        </div>

        {/* Student List */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Student List ({filteredStudents.length})</h3>
            <p className="text-sm text-gray-600">Mark attendance for each student</p>
          </div>
          
          <div className="p-6">
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredStudents.map((student) => (
                <div 
                  key={student.id} 
                  className={`flex items-center justify-between p-4 border rounded-lg transition-colors hover:shadow-sm ${getRowBackground(student)}`}
                >
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={student.isPresent}
                      onChange={() => toggleStudentAttendance(student.id)}
                      className="w-5 h-5 text-green-600 border-2 border-gray-300 rounded focus:ring-green-500"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{student.name}</p>
                      <p className="text-xs text-gray-500">{student.rollNo}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{student.overallAttendance}% Overall</p>
                      <p className="text-xs text-gray-500">Last: {student.lastSeen}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      student.isPresent 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
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
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Attendance Summary</h3>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gray-100 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">{totalStudents}</div>
                <div className="text-sm text-gray-600">Total Students</div>
              </div>
              
              <div className="bg-green-100 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-green-800 mb-2">{presentCount}</div>
                <div className="text-sm text-green-700">Present</div>
              </div>
              
              <div className="bg-red-100 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-red-800 mb-2">{absentCount}</div>
                <div className="text-sm text-red-700">Absent</div>
              </div>
              
              <div className="bg-blue-100 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-blue-800 mb-2">{attendanceRate}%</div>
                <div className="text-sm text-blue-700">Attendance Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FacultyAttendance