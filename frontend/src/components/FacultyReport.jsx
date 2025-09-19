import React, { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import FacultyHeader from './FacultyHeader'

const FacultyReport = () => {
  const [activeTab, setActiveTab] = useState('Reports')
  const [selectedReportType, setSelectedReportType] = useState('Performance Summary Report')
  const [selectedFromDate, setSelectedFromDate] = useState('01-01-2024')
  const [selectedToDate, setSelectedToDate] = useState('31-12-2024')

  // Monthly attendance trends data
  const attendanceTrends = [
    { month: 'Jan', percentage: 85 },
    { month: 'Feb', percentage: 87 },
    { month: 'Mar', percentage: 83 },
    { month: 'Apr', percentage: 89 },
    { month: 'May', percentage: 84 },
    { month: 'Jun', percentage: 82 }
  ]

  // Class-wise performance data
  const classPerformance = [
    { class: 'Data Structures', percentage: 88 },
    { class: 'Database Systems', percentage: 92 },
    { class: 'Web Development', percentage: 85 },
    { class: 'Algorithm Analysis', percentage: 87 },
    { class: 'Software Engineering', percentage: 90 }
  ]

  // Attendance distribution data for pie chart
  const attendanceDistribution = [
    { name: 'Above 90% (Excellent)', value: 40, color: '#10b981' },
    { name: 'Above 80% (Good)', value: 35, color: '#3b82f6' },
    { name: 'Above 70% (Average)', value: 15, color: '#f59e0b' },
    { name: 'Below 70% (Poor)', value: 10, color: '#ef4444' }
  ]

  // Key metrics
  const keyMetrics = [
    { label: 'Total Students', value: '200', trend: 'up' },
    { label: 'Average Attendance', value: '85%', trend: 'up' },
    { label: 'Active Classes', value: '8', trend: 'stable' },
    { label: 'Reports This Week', value: '11', trend: 'up' }
  ]

  // Recent reports
  const recentReports = [
    {
      title: 'Monthly Attendance Report - May 2024',
      type: 'Attendance Report',
      generated: '2024-05-31 • 15:30',
      status: 'completed'
    },
    {
      title: 'At-Risk Students Analysis',
      type: 'Performance Report',
      generated: '2024-05-30 • 14:25',
      status: 'completed'
    },
    {
      title: 'Class Performance Summary',
      type: 'Academic Report',
      generated: '2024-05-29 • 11:15',
      status: 'completed'
    },
    {
      title: 'Individual Student Progress',
      type: 'Progress Report',
      generated: '2024-05-28 • 16:45',
      status: 'completed'
    }
  ]

  // Available report templates
  const reportTemplates = [
    {
      title: 'Attendance Summary Report',
      description: 'Overall attendance statistics and trends',
      icon: '📊',
      category: 'Attendance'
    },
    {
      title: 'Student Performance Report',
      description: 'Individual student performance analysis',
      icon: '📈',
      category: 'Performance'
    },
    {
      title: 'At-Risk Students Report',
      description: 'Students requiring additional attention',
      icon: '⚠️',
      category: 'Analytics'
    },
    {
      title: 'Class-wise Analysis',
      description: 'Performance breakdown by class/subject',
      icon: '📚',
      category: 'Analytics'
    }
  ]

  const generateReport = (template) => {
    console.log('Generating report:', template.title)
    // Add report generation logic here
  }

  const downloadReport = (reportId) => {
    console.log('Downloading report:', reportId)
    // Add download logic here
  }

  const viewReport = (reportId) => {
    console.log('Viewing report:', reportId)
    // Add view logic here
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <FacultyHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
          <p className="text-sm text-gray-600">Generate and view comprehensive reports</p>
        </div>

        {/* Generate Report Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">📄 Generate Report</h3>
            <p className="text-sm text-gray-600">Create custom reports for various assessments</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
                <select
                  value={selectedReportType}
                  onChange={(e) => setSelectedReportType(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option>Performance Summary Report</option>
                  <option>Attendance Analysis Report</option>
                  <option>Student Progress Report</option>
                  <option>Class Comparison Report</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
                <input
                  type="date"
                  value={selectedFromDate}
                  onChange={(e) => setSelectedFromDate(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                <input
                  type="date"
                  value={selectedToDate}
                  onChange={(e) => setSelectedToDate(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="mt-4">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                📊 Generate Report
              </button>
            </div>
          </div>
        </div>

        {/* Quick Reports Templates */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">⚡ Quick Reports</h3>
            <p className="text-sm text-gray-600">Pre-built report templates for common assessments</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {reportTemplates.map((template, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="text-2xl mb-2">{template.icon}</div>
                  <h4 className="font-medium text-gray-900 mb-1">{template.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                  <button
                    onClick={() => generateReport(template)}
                    className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm"
                  >
                    Generate
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Analytics Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Attendance Trends */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">📈 Monthly Attendance Trends</h3>
              <p className="text-sm text-gray-600">Attendance percentage targets over time</p>
            </div>
            <div className="p-6">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={attendanceTrends}>
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis 
                      domain={[70, 100]} 
                      axisLine={false} 
                      tickLine={false}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="percentage" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Class-wise Performance */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">📊 Class-wise Performance</h3>
              <p className="text-sm text-gray-600">Performance percentage by class</p>
            </div>
            <div className="p-6">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={classPerformance}>
                    <XAxis 
                      dataKey="class" 
                      axisLine={false} 
                      tickLine={false}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      fontSize={12}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Bar dataKey="percentage" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Attendance Distribution */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">🎯 Attendance Distribution</h3>
              <p className="text-sm text-gray-600">Students grouped by attendance percentage</p>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-center">
                <div className="w-48 h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={attendanceDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ value }) => `${value}%`}
                      >
                        {attendanceDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="ml-6 space-y-2">
                  {attendanceDistribution.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-sm text-gray-600">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">📋 Key Metrics</h3>
              <p className="text-sm text-gray-600">Important statistics at a glance</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {keyMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-gray-900">{metric.value}</span>
                      <span className={`text-sm ${
                        metric.trend === 'up' ? 'text-green-600' : 
                        metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {metric.trend === 'up' ? '↗️' : metric.trend === 'down' ? '↘️' : '➡️'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">📑 Recent Reports</h3>
            <p className="text-sm text-gray-600">Previously generated reports</p>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {recentReports.map((report, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="text-xl">📄</div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{report.title}</h4>
                      <p className="text-xs text-gray-500">{report.type} • {report.generated}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => viewReport(report.title)}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors"
                    >
                      View
                    </button>
                    <button
                      onClick={() => downloadReport(report.title)}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200 transition-colors"
                    >
                      Download
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

export default FacultyReport