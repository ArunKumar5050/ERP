import React, { useState } from 'react'
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import FacultyHeader from './FacultyHeader'

const FacultyResult = () => {
  const [activeTab, setActiveTab] = useState('Results')
  const [searchTerm, setSearchTerm] = useState('')

  // Grade distribution data for pie chart
  const gradeDistribution = [
    { name: 'A+', value: 30, color: '#10b981', percentage: '30%' },
    { name: 'A', value: 26, color: '#3b82f6', percentage: '26%' },
    { name: 'B+', value: 17, color: '#f59e0b', percentage: '17%' },
    { name: 'B', value: 14, color: '#ef4444', percentage: '14%' },
    { name: 'C+', value: 8, color: '#8b5cf6', percentage: '8%' },
    { name: 'Below C', value: 5, color: '#6b7280', percentage: '5%' }
  ]

  // CGPA trends data for line chart
  const cgpaTrends = [
    { semester: 'Sem 1', cgpa: 7.2 },
    { semester: 'Sem 2', cgpa: 7.8 },
    { semester: 'Sem 3', cgpa: 8.1 },
    { semester: 'Sem 4', cgpa: 8.5 },
    { semester: 'Sem 5', cgpa: 8.7 }
  ]

  // Student results data
  const [students] = useState([
    {
      id: 1,
      name: 'John Doe',
      rollNo: 'CS101_001',
      subject: 'Data Structures',
      cgpa: 8.5,
      sgpa: 8.7,
      rank: '#5',
      status: 'pass'
    },
    {
      id: 2,
      name: 'Jane Smith',
      rollNo: 'CS102_015',
      subject: 'Database Systems',
      cgpa: 9.2,
      sgpa: 9.4,
      rank: '#1',
      status: 'distinction'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      rollNo: 'CS103_022',
      subject: 'Web Development',
      cgpa: 6.8,
      sgpa: 6.9,
      rank: '#25',
      status: 'improvement'
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      rollNo: 'CS101_045',
      subject: 'Data Structures',
      cgpa: 7.9,
      sgpa: 8.2,
      rank: '#8',
      status: 'pass'
    },
    {
      id: 5,
      name: 'David Brown',
      rollNo: 'CS102_033',
      subject: 'Database Systems',
      cgpa: 8.8,
      sgpa: 9.1,
      rank: '#3',
      status: 'distinction'
    }
  ])

  // Filter students based on search term
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Get status color and icon
  const getStatusDisplay = (status) => {
    switch (status) {
      case 'distinction':
        return { color: 'text-green-600', bg: 'bg-green-50', icon: '🏆' }
      case 'pass':
        return { color: 'text-blue-600', bg: 'bg-blue-50', icon: '✅' }
      case 'improvement':
        return { color: 'text-orange-600', bg: 'bg-orange-50', icon: '⚠️' }
      default:
        return { color: 'text-gray-600', bg: 'bg-gray-50', icon: '📊' }
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <FacultyHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Student Results</h2>
          <p className="text-sm text-gray-600">Manage and view student academic performance</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-purple-100 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">📊 Average CGPA</p>
                <p className="text-3xl font-bold text-purple-700">8.2</p>
                <p className="text-xs text-purple-500">Current semester</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-100 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">📈 Pass Percentage</p>
                <p className="text-3xl font-bold text-blue-700">92%</p>
                <p className="text-xs text-blue-500">Above 6.0 CGPA</p>
              </div>
            </div>
          </div>

          <div className="bg-green-100 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">🏆 Top Performers</p>
                <p className="text-3xl font-bold text-green-700">15</p>
                <p className="text-xs text-green-500">Above 8.5 CGPA</p>
              </div>
            </div>
          </div>

          <div className="bg-orange-100 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">⚠️ Improvement Needed</p>
                <p className="text-3xl font-bold text-orange-700">8</p>
                <p className="text-xs text-orange-500">Below 6.0 CGPA</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Grade Distribution */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Grade Distribution</h3>
            <p className="text-sm text-gray-600 mb-4">Current semester grade breakdown</p>
            
            <div className="flex items-center justify-center">
              <div className="w-64 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={gradeDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ percentage }) => percentage}
                    >
                      {gradeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="ml-6 space-y-2">
                {gradeDistribution.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm text-gray-600">{item.name}: {item.percentage}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CGPA Trends */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">CGPA Trends</h3>
            <p className="text-sm text-gray-600 mb-4">Average CGPA progression over semesters</p>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cgpaTrends}>
                  <XAxis dataKey="semester" axisLine={false} tickLine={false} />
                  <YAxis 
                    domain={[6, 10]} 
                    axisLine={false} 
                    tickLine={false}
                    tickFormatter={(value) => value.toFixed(1)}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="cgpa" 
                    stroke="#8b5cf6" 
                    strokeWidth={3}
                    dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Search Students</h3>
            <div className="flex items-center justify-between">
              <div className="flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="🔍 Search by name or roll number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div className="ml-4">
                <select className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                  <option>All Classes</option>
                  <option>Data Structures</option>
                  <option>Database Systems</option>
                  <option>Web Development</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Student Results Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Student Results ({filteredStudents.length})</h3>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {filteredStudents.map((student) => {
                const statusDisplay = getStatusDisplay(student.status)
                return (
                  <div
                    key={student.id}
                    className={`flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors ${statusDisplay.bg}`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">{statusDisplay.icon}</div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{student.name}</p>
                        <p className="text-xs text-gray-500">{student.rollNo} • {student.subject}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-lg font-bold text-gray-900">{student.cgpa}</p>
                        <p className="text-xs text-gray-500">CGPA</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-gray-900">{student.sgpa}</p>
                        <p className="text-xs text-gray-500">SGPA</p>
                      </div>
                      <div className="text-center">
                        <p className={`text-lg font-bold ${statusDisplay.color}`}>{student.rank}</p>
                        <p className="text-xs text-gray-500">Rank</p>
                      </div>
                      <button className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FacultyResult