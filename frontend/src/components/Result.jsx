import React from 'react';
import { TrendingUp, Award, BookOpen, Target, Star, BarChart3 } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

export default function Result() {
  const resultData = {
    summary: {
      currentCGPA: 8.7,
      totalCGPA: 10.0,
      creditsEarned: 100,
      totalCredits: 126,
      semestersCompleted: 4,
      totalSemesters: 8,
      academicStanding: 'Excellent',
      standingCGPA: 8.5
    },
    cgpaProgression: [
      { semester: '1st', cgpa: 8.5, name: '1st Sem' },
      { semester: '2nd', cgpa: 8.65, name: '2nd Sem' },
      { semester: '3rd', cgpa: 8.8, name: '3rd Sem' },
      { semester: '4th', cgpa: 8.6, name: '4th Sem' },
      { semester: '5th', cgpa: 8.7, name: '5th Sem' }
    ],
    gradeDistribution: [
      { grade: 'A+', count: 7, fill: '#059669' },
      { grade: 'A', count: 12, fill: '#10b981' },
      { grade: 'A-', count: 6, fill: '#34d399' },
      { grade: 'B+', count: 3, fill: '#fbbf24' },
      { grade: 'B', count: 0, fill: '#f59e0b' },
      { grade: 'B-', count: 0, fill: '#d97706' },
      { grade: 'C+', count: 0, fill: '#ea580c' },
      { grade: 'C', count: 0, fill: '#dc2626' }
    ],
    semesters: [
      {
        id: 1,
        name: '1st Semester',
        academicYear: '2022-23',
        status: 'PASSED',
        sgpa: 8.5,
        cgpa: 8.5,
        creditsCompleted: 24,
        totalCredits: 24,
        subjects: [
          { name: 'Mathematics I', code: 'MATH01', credits: 4, marks: 85, grade: 'A', gp: 9 },
          { name: 'Physics I', code: 'PHY01', credits: 4, marks: 82, grade: 'A', gp: 8 },
          { name: 'Chemistry', code: 'CHEM01', credits: 4, marks: 78, grade: 'B+', gp: 8 },
          { name: 'English', code: 'ENG01', credits: 3, marks: 88, grade: 'A', gp: 9 },
          { name: 'Programming in C', code: 'CS01', credits: 4, marks: 92, grade: 'A+', gp: 10 },
          { name: 'Engineering Graphics', code: 'ME101', credits: 2, marks: 86, grade: 'A', gp: 9 },
          { name: 'Workshop Practice', code: 'WS101', credits: 3, marks: 80, grade: 'A', gp: 8 }
        ]
      },
      {
        id: 2,
        name: '2nd Semester',
        academicYear: '2022-23',
        status: 'PASSED',
        sgpa: 8.8,
        cgpa: 8.65,
        creditsCompleted: 25,
        totalCredits: 25,
        subjects: [
          { name: 'Mathematics II', code: 'MATH02', credits: 4, marks: 91, grade: 'A+', gp: 10 },
          { name: 'Physics II', code: 'PHY02', credits: 4, marks: 87, grade: 'A', gp: 9 },
          { name: 'Environmental Science', code: 'ENV02', credits: 3, marks: 81, grade: 'A', gp: 8 },
          { name: 'Basic Electrical', code: 'EE02', credits: 4, marks: 85, grade: 'A', gp: 9 },
          { name: 'Data Structures', code: 'CS02', credits: 4, marks: 94, grade: 'A+', gp: 10 },
          { name: 'Computer Graphics', code: 'CS02', credits: 3, marks: 88, grade: 'A', gp: 9 },
          { name: 'Communication Skills', code: 'ENG02', credits: 3, marks: 79, grade: 'B+', gp: 8 }
        ]
      },
      {
        id: 3,
        name: '3rd Semester',
        academicYear: '2023-24',
        status: 'PASSED',
        sgpa: 9.1,
        cgpa: 8.8,
        creditsCompleted: 26,
        totalCredits: 26,
        subjects: [
          { name: 'Mathematics III', code: 'MATH03', credits: 4, marks: 93, grade: 'A+', gp: 10 },
          { name: 'Computer Organization', code: 'CS03', credits: 4, marks: 95, grade: 'A+', gp: 10 },
          { name: 'Database Systems', code: 'CS03', credits: 4, marks: 89, grade: 'A', gp: 9 },
          { name: 'Object Oriented Programming', code: 'CS03', credits: 4, marks: 96, grade: 'A+', gp: 10 },
          { name: 'Digital Logic Design', code: 'CS04', credits: 3, marks: 87, grade: 'A', gp: 9 },
          { name: 'Software Engineering', code: 'CS05', credits: 4, marks: 84, grade: 'A', gp: 9 },
          { name: 'Technical Writing', code: 'ENG01', credits: 3, marks: 82, grade: 'A', gp: 8 }
        ]
      },
      {
        id: 4,
        name: '4th Semester',
        academicYear: '2023-24',
        status: 'PASSED',
        sgpa: 8.6,
        cgpa: 8.7,
        creditsCompleted: 25,
        totalCredits: 25,
        subjects: [
          { name: 'Mathematics IV', code: 'MATH04', credits: 4, marks: 86, grade: 'A', gp: 9 },
          { name: 'Algorithms', code: 'CS01', credits: 4, marks: 92, grade: 'A+', gp: 10 },
          { name: 'Operating Systems', code: 'CS02', credits: 4, marks: 83, grade: 'A', gp: 8 },
          { name: 'Computer Networks', code: 'CS03', credits: 4, marks: 88, grade: 'A', gp: 9 },
          { name: 'Web Technologies', code: 'CS04', credits: 3, marks: 85, grade: 'A', gp: 9 },
          { name: 'Microprocessors', code: 'CS05', credits: 3, marks: 78, grade: 'B+', gp: 8 },
          { name: 'Economics', code: 'ECO01', credits: 3, marks: 80, grade: 'A', gp: 8 }
        ]
      },
      {
        id: 5,
        name: '5th Semester',
        academicYear: '2024-25',
        status: 'ONGOING',
        sgpa: null,
        cgpa: 8.7,
        creditsCompleted: 0,
        totalCredits: 26,
        subjects: [
          { name: 'Machine Learning', code: 'CS01', credits: 4, marks: 'N/A', grade: 'N/A', gp: 'N/A' },
          { name: 'Compiler Design', code: 'CS02', credits: 4, marks: 'N/A', grade: 'N/A', gp: 'N/A' },
          { name: 'Software Project Management', code: 'CS03', credits: 3, marks: 'N/A', grade: 'N/A', gp: 'N/A' },
          { name: 'Computer Graphics', code: 'CS04', credits: 4, marks: 'N/A', grade: 'N/A', gp: 'N/A' },
          { name: 'Cyber Security', code: 'CS05', credits: 4, marks: 'N/A', grade: 'N/A', gp: 'N/A' },
          { name: 'Mobile App Development', code: 'CS06', credits: 4, marks: 'N/A', grade: 'N/A', gp: 'N/A' },
          { name: 'Business Ethics', code: 'MGT01', credits: 3, marks: 'N/A', grade: 'N/A', gp: 'N/A' }
        ]
      }
    ],
    performance: {
      aPlusGrades: 7,
      excellenceRate: 68,
      targetCGPA: 8.9
    }
  };

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A+':
        return 'bg-green-500 text-white';
      case 'A':
        return 'bg-green-400 text-white';
      case 'A-':
        return 'bg-green-300 text-white';
      case 'B+':
        return 'bg-yellow-500 text-white';
      case 'B':
        return 'bg-yellow-400 text-white';
      case 'B-':
        return 'bg-orange-400 text-white';
      case 'C+':
        return 'bg-orange-500 text-white';
      case 'C':
        return 'bg-red-400 text-white';
      case 'N/A':
        return 'bg-gray-300 text-gray-600';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PASSED':
        return 'bg-green-500 text-white';
      case 'ONGOING':
        return 'bg-orange-500 text-white';
      case 'FAILED':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Academic Results</h1>
          <p className="text-gray-600">Track your academic performance and progress throughout your studies</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Current CGPA */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-medium">Current CGPA</h3>
              <Star className="w-5 h-5 text-blue-500" />
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-gray-900">{resultData.summary.currentCGPA}</div>
              <p className="text-sm text-gray-500">Out of {resultData.summary.totalCGPA}</p>
            </div>
          </div>

          {/* Credits Earned */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-medium">Credits Earned</h3>
              <BookOpen className="w-5 h-5 text-green-500" />
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-gray-900">{resultData.summary.creditsEarned}</div>
              <p className="text-sm text-gray-500">Out of {resultData.summary.totalCredits} total</p>
            </div>
          </div>

          {/* Semesters Completed */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-medium">Semesters Completed</h3>
              <Award className="w-5 h-5 text-purple-500" />
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-gray-900">{resultData.summary.semestersCompleted}</div>
              <p className="text-sm text-gray-500">Out of {resultData.summary.totalSemesters} total</p>
            </div>
          </div>

          {/* Academic Standing */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-medium">Academic Standing</h3>
              <Target className="w-5 h-5 text-green-500" />
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-green-600">{resultData.summary.academicStanding}</div>
              <p className="text-sm text-gray-500">Above {resultData.summary.standingCGPA} CGPA</p>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* CGPA Progression Chart */}
          <div className="bg-green-50 rounded-xl border border-green-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">CGPA Progression</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={resultData.cgpaProgression}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                  />
                  <YAxis 
                    domain={[7, 10]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value) => [value, 'CGPA']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="cgpa" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 7, fill: '#059669' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Grade Distribution Chart */}
          <div className="bg-green-50 rounded-xl border border-green-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Grade Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={resultData.gradeDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="grade" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value) => [value, 'Count']}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {resultData.gradeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Semester Results */}
        {resultData.semesters.map((semester) => (
          <div key={semester.id} className="bg-green-50 rounded-xl border border-green-200 p-6 mb-6">
            {/* Semester Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{semester.name}</h3>
                <p className="text-gray-600">Academic Year: {semester.academicYear}</p>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(semester.status)}`}>
                  {semester.status}
                </span>
                {semester.sgpa && (
                  <div className="text-right">
                    <div className="text-sm text-gray-600">SGPA: {semester.sgpa}</div>
                    <div className="text-sm text-gray-600">CGPA: {semester.cgpa}</div>
                  </div>
                )}
                {semester.status === 'ONGOING' && (
                  <div className="text-right">
                    <div className="text-sm text-gray-600">CGPA: {semester.cgpa}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Credits Progress */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Credits Progress</span>
                <span className="text-sm text-gray-600">{semester.creditsCompleted} / {semester.totalCredits} credits</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-gray-900 to-green-400 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(semester.creditsCompleted / semester.totalCredits) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Subjects Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credits</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marks</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GP</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {semester.subjects.map((subject, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{subject.name}</div>
                        <div className="text-xs text-gray-500">{subject.code}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{subject.credits}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{subject.marks}</td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(subject.grade)}`}>
                          {subject.grade}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{subject.gp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        {/* Performance Analysis */}
        <div className="bg-green-50 rounded-xl border border-green-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Performance Analysis</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* A+ Grades */}
            <div className="bg-green-100 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">{resultData.performance.aPlusGrades}</div>
              <div className="text-sm text-green-700 font-medium flex items-center justify-center space-x-1">
                <TrendingUp className="w-4 h-4" />
                <span>A+ Grades</span>
              </div>
            </div>

            {/* Excellence Rate */}
            <div className="bg-teal-600 rounded-xl p-6 text-center text-white">
              <div className="text-4xl font-bold mb-2">{resultData.performance.excellenceRate}%</div>
              <div className="text-sm font-medium flex items-center justify-center space-x-1">
                <Star className="w-4 h-4" />
                <span>Excellence Rate</span>
              </div>
            </div>

            {/* Target CGPA */}
            <div className="bg-white rounded-xl p-6 text-center border border-gray-200">
              <div className="text-4xl font-bold text-gray-900 mb-2">{resultData.performance.targetCGPA}</div>
              <div className="text-sm text-gray-700 font-medium flex items-center justify-center space-x-1">
                <Target className="w-4 h-4" />
                <span>Target CGPA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button className="flex items-center justify-center space-x-3 bg-blue-600 text-white p-4 rounded-xl hover:bg-blue-700 transition-colors">
            <BarChart3 className="w-5 h-5" />
            <span className="font-semibold">Download Transcript</span>
          </button>
          <button className="flex items-center justify-center space-x-3 bg-green-600 text-white p-4 rounded-xl hover:bg-green-700 transition-colors">
            <TrendingUp className="w-5 h-5" />
            <span className="font-semibold">Performance Report</span>
          </button>
          <button className="flex items-center justify-center space-x-3 bg-purple-600 text-white p-4 rounded-xl hover:bg-purple-700 transition-colors">
            <Award className="w-5 h-5" />
            <span className="font-semibold">Academic Certificate</span>
          </button>
        </div>
      </div>
    </div>
  );
}