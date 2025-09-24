import React, { useState, useEffect } from 'react';
import FacultyHeader from './FacultyHeader';
import { apiClient } from '../config/api';

const FacultyAtRisk = () => {
  const [activeTab, setActiveTab] = useState('At-Risk Students');
  const [atRiskStudents, setAtRiskStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedStudent, setExpandedStudent] = useState(null);

  useEffect(() => {
    fetchAtRiskStudents();
  }, []);

  const fetchAtRiskStudents = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await apiClient.getAtRiskStudents();
      if (response.success) {
        setAtRiskStudents(response.data);
      } else {
        setError('Failed to fetch at-risk students');
      }
    } catch (err) {
      console.error('Error fetching at-risk students:', err);
      // Check if it's a connection error to the AI service
      if (err.message && err.message.includes('fetch')) {
        setError('AI Service is not available. Please ensure the AI service is running.');
      } else {
        setError('Error loading at-risk students: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-orange-100 text-orange-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskBadgeColor = (riskLevel) => {
    switch (riskLevel) {
      case 'High': return 'bg-red-500';
      case 'Medium': return 'bg-orange-500';
      case 'Low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const toggleStudentDetails = (studentId) => {
    setExpandedStudent(expandedStudent === studentId ? null : studentId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <FacultyHeader activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading at-risk students...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <FacultyHeader activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex items-center justify-center py-20">
          <div className="text-center max-w-2xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <h3 className="font-medium text-yellow-800 mb-2">To fix this issue:</h3>
              <ul className="text-yellow-700 text-left list-disc pl-5 space-y-1">
                <li>Make sure MongoDB is running on localhost:27017</li>
                <li>Start the AI service by running: <code className="bg-gray-100 px-1 rounded">start-ai-service.bat</code></li>
                <li>Ensure the main backend server is running</li>
              </ul>
            </div>
            <button 
              onClick={fetchAtRiskStudents}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <FacultyHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">At-Risk Students</h2>
          <p className="text-gray-600 mt-1">Students identified as at risk of dropping out</p>
        </div>

        {atRiskStudents.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No At-Risk Students Found</h3>
            <p className="text-gray-600">All students are currently performing within expected parameters.</p>
            <div className="mt-4 text-sm text-gray-500">
              <p>This analysis is based on attendance, CGPA, backlogs, and assignment submissions.</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Roll No
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Risk Score
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Risk Level
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {atRiskStudents.map((student) => (
                    <React.Fragment key={student.student_id}>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-gray-600 font-medium">
                                {student.name.charAt(0)}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{student.name}</div>
                              <div className="text-sm text-gray-500">{student.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.roll_no}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-medium">
                            {(student.risk_score * 100).toFixed(1)}%
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRiskColor(student.risk_level)}`}>
                            {student.risk_level}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => toggleStudentDetails(student.student_id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            {expandedStudent === student.student_id ? 'Hide Details' : 'View Details'}
                          </button>
                        </td>
                      </tr>
                      {expandedStudent === student.student_id && (
                        <tr>
                          <td colSpan="5" className="px-6 py-4 bg-gray-50">
                            <div className="rounded-lg bg-white p-4 border border-gray-200">
                              <h4 className="text-md font-semibold text-gray-900 mb-2">Risk Factors</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {student.top_reasons.map((reason, index) => (
                                  <div key={index} className="flex items-start">
                                    <div className={`flex-shrink-0 h-5 w-5 rounded-full ${getRiskBadgeColor(student.risk_level)} flex items-center justify-center mt-0.5`}>
                                      <span className="text-white text-xs">!</span>
                                    </div>
                                    <div className="ml-3">
                                      <p className="text-sm font-medium text-gray-900">{reason.factor}</p>
                                      <p className="text-sm text-gray-500">{reason.description}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <div className="mt-4 flex items-center">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className={`h-2 rounded-full ${getRiskBadgeColor(student.risk_level)}`} 
                                    style={{ width: `${student.risk_score * 100}%` }}
                                  ></div>
                                </div>
                                <span className="ml-2 text-sm font-medium text-gray-700">
                                  {(student.risk_score * 100).toFixed(1)}% Risk
                                </span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyAtRisk;