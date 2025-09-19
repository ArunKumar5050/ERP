import React, { useState } from 'react'
import FacultyHeader from './FacultyHeader'

const FacultySchedule = () => {
  const [activeTab, setActiveTab] = useState('Schedule')

  // Weekly schedule data
  const weeklySchedule = [
    {
      day: 'Monday',
      date: '19/06/2024',
      classes: [
        {
          time: '09:00 AM - 10:30 AM',
          subject: 'Data Structures',
          code: 'CS-L-301',
          room: 'A-25',
          status: 'Lecture'
        },
        {
          time: '11:00 AM - 12:30 PM',
          subject: 'Database Systems',
          code: 'CS-L-402',
          room: 'B-18',
          status: 'Practical'
        },
        {
          time: '02:00 PM - 03:30 PM',
          subject: 'Web Development',
          code: 'CS-L-503',
          room: 'C-07',
          status: 'Lab'
        }
      ]
    },
    {
      day: 'Tuesday',
      date: '20/06/2024',
      classes: [
        {
          time: '10:00 AM - 11:30 AM',
          subject: 'Algorithm Analysis',
          code: 'CS-L-304',
          room: 'A-12',
          status: 'Lecture'
        },
        {
          time: '01:00 PM - 02:30 PM',
          subject: 'Database Systems',
          code: 'CS-T-402',
          room: 'B-05',
          status: 'Tutorial'
        }
      ]
    },
    {
      day: 'Wednesday',
      date: '21/06/2024',
      classes: [
        {
          time: '09:00 AM - 10:30 AM',
          subject: 'Data Structures',
          code: 'CS-L-301',
          room: 'A-25',
          status: 'Tutorial'
        },
        {
          time: '11:00 AM - 12:30 PM',
          subject: 'Software Engineering',
          code: 'CS-L-405',
          room: 'B-14',
          status: 'Lecture'
        },
        {
          time: '03:00 PM - 04:30 PM',
          subject: 'Web Development',
          code: 'CS-L-503',
          room: 'C-07',
          status: 'Practical'
        }
      ]
    },
    {
      day: 'Thursday',
      date: '22/06/2024',
      classes: [
        {
          time: '10:00 AM - 11:30 AM',
          subject: 'Algorithm Analysis',
          code: 'CS-L-304',
          room: 'A-12',
          status: 'Practical'
        },
        {
          time: '02:00 PM - 03:30 PM',
          subject: 'Software Engineering',
          code: 'CS-T-405',
          room: 'B-21',
          status: 'Lab'
        }
      ]
    },
    {
      day: 'Friday',
      date: '23/06/2024',
      classes: [
        {
          time: '09:00 AM - 10:30 AM',
          subject: 'Database Systems',
          code: 'CS-L-402',
          room: 'B-18',
          status: 'Lecture'
        },
        {
          time: '11:00 AM - 12:30 PM',
          subject: 'Web Development',
          code: 'CS-L-503',
          room: 'C-07',
          status: 'Tutorial'
        }
      ]
    }
  ]

  // Summary statistics
  const weekStats = {
    totalClasses: 11,
    totalHours: 16.5,
    studentsEnrolled: 200
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'lecture':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'practical':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'tutorial':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'lab':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <FacultyHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Class Schedule</h2>
        </div>

        {/* Weekly Schedule */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Weekly Schedule</h3>
            <p className="text-sm text-gray-600">Complete schedule for this week</p>
          </div>
          
          <div className="p-6">
            {weeklySchedule.map((daySchedule, dayIndex) => (
              <div key={dayIndex} className="mb-6 last:mb-0">
                <div className="flex items-center mb-3">
                  <h4 className="text-base font-semibold text-gray-900 mr-3">{daySchedule.day}</h4>
                  <span className="text-sm text-gray-500">{daySchedule.date}</span>
                </div>
                
                <div className="space-y-2">
                  {daySchedule.classes.map((classItem, classIndex) => (
                    <div 
                      key={classIndex} 
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-sm font-medium text-gray-900 w-32">
                          {classItem.time}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{classItem.subject}</p>
                          <p className="text-xs text-gray-500">{classItem.code}</p>
                        </div>
                        <div className="text-xs text-gray-600">
                          Room: {classItem.room}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(classItem.status)}`}>
                          {classItem.status}
                        </span>
                        <button className="px-4 py-2 bg-gray-900 text-white text-xs rounded hover:bg-gray-800 transition-colors">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">{weekStats.totalClasses}</div>
              <div className="text-sm text-gray-600">Total Classes This Week</div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">{weekStats.totalHours}</div>
              <div className="text-sm text-gray-600">Total Teaching Hours</div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">{weekStats.studentsEnrolled}</div>
              <div className="text-sm text-gray-600">Students Enrolled</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FacultySchedule