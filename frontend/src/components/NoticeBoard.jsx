import React, { useState } from 'react';
import { Bell, AlertCircle, Clock, Calendar, User, Building, BookOpen, CreditCard, Users, ChevronRight, Eye, Download, Pin } from 'lucide-react';

export default function NoticeBoard() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All', count: 6, color: 'bg-gray-100 text-gray-800' },
    { id: 'urgent', label: 'Urgent', count: 1, color: 'bg-red-100 text-red-800' },
    { id: 'academic', label: 'Academic', count: 3, color: 'bg-blue-100 text-blue-800' },
    { id: 'events', label: 'Events', count: 1, color: 'bg-green-100 text-green-800' },
    { id: 'general', label: 'General', count: 1, color: 'bg-yellow-100 text-yellow-800' }
  ];

  const notices = [
    {
      id: 1,
      title: 'Mid Semester Examination Schedule Released',
      category: 'academic',
      priority: 'new',
      department: 'Academic',
      date: '2024-01-15',
      time: '10:20 AM',
      description: 'The mid-semester examination schedule for all courses has been published. Please check the academic portal for detailed timings and venue information.',
      author: 'Academic Office',
      type: 'Academic',
      isImportant: true,
      hasAttachment: true,
      views: 245
    },
    {
      id: 2,
      title: 'Library Extended Hours During Exam Period',
      category: 'general',
      priority: 'general',
      department: 'Library',
      date: '2024-01-14',
      time: '09:15 AM',
      description: 'The college library will be open 24/7 from January 20th to February 5th to support students during the examination period. Additional study spaces have been arranged.',
      author: 'Library Services',
      type: 'General',
      isImportant: false,
      hasAttachment: false,
      views: 189
    },
    {
      id: 3,
      title: 'Attendance Requirements - Important Reminder',
      category: 'academic',
      priority: 'critical',
      department: 'Academic',
      date: '2024-01-12',
      time: '02:00 PM',
      description: 'Students are reminded that minimum 75% attendance is mandatory for semester completion. Students with attendance below 65% in any subject may face academic disciplinary action.',
      author: 'Academic Office',
      type: 'Academic',
      isImportant: true,
      hasAttachment: false,
      views: 412
    },
    {
      id: 4,
      title: 'Cultural Fest Registration Open',
      category: 'events',
      priority: 'info',
      department: 'Events',
      date: '2024-01-10',
      time: '04:30 PM',
      description: 'Annual cultural festival "Spectrum 2024" registration is now open. Students can participate in various events including music, dance, drama, and literature competitions.',
      author: 'Student Affairs',
      type: 'Events',
      isImportant: false,
      hasAttachment: true,
      views: 156
    },
    {
      id: 5,
      title: 'Hostel Fee Payment Deadline Extension',
      category: 'urgent',
      priority: 'urgent',
      department: 'Financial',
      date: '2024-01-08',
      time: '11:45 AM',
      description: 'The deadline for hostel fee payment has been extended to January 25th. Late payment charges will apply after this date. Payment can be made online or at the accounts office.',
      author: 'Accounts Office',
      type: 'Financial',
      isImportant: true,
      hasAttachment: false,
      views: 298
    },
    {
      id: 6,
      title: 'Guest Lecture Series on Artificial Intelligence',
      category: 'academic',
      priority: 'general',
      department: 'Academic',
      date: '2024-01-07',
      time: '03:15 PM',
      description: 'A series of guest lectures on "AI and Future Technologies" will be conducted from January 22-26. Industry experts from leading tech companies will share their insights with our students.',
      author: 'Computer Science Dept',
      type: 'Academic',
      isImportant: false,
      hasAttachment: true,
      views: 203
    }
  ];

  const filteredNotices = selectedCategory === 'all' 
    ? notices 
    : notices.filter(notice => notice.category === selectedCategory);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'new': return 'bg-blue-500 text-white';
      case 'critical': return 'bg-red-500 text-white';
      case 'urgent': return 'bg-orange-500 text-white';
      case 'info': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'new': return 'NEW';
      case 'critical': return 'CRITICAL';
      case 'urgent': return 'URGENT';
      case 'info': return 'INFO';
      default: return 'GENERAL';
    }
  };

  const getCardBorderColor = (priority) => {
    switch (priority) {
      case 'new': return 'border-l-blue-400';
      case 'critical': return 'border-l-red-400';
      case 'urgent': return 'border-l-orange-400';
      case 'info': return 'border-l-green-400';
      default: return 'border-l-gray-300';
    }
  };

  const getBackgroundColor = (priority) => {
    switch (priority) {
      case 'new': return 'bg-blue-50';
      case 'critical': return 'bg-red-50';
      case 'urgent': return 'bg-orange-50';
      case 'info': return 'bg-green-50';
      default: return 'bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Notice Board</h1>
          <p className="text-gray-600">Stay updated with the latest announcements and important information</p>
        </div>

        {/* Alert Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-start space-x-3">
            <Bell className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-blue-800 font-semibold mb-1">You have 1 new notification that requires your attention.</h3>
            </div>
          </div>
        </div>

        {/* Critical Notice Alert */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-red-800 font-semibold mb-1">1 critical notice requires immediate attention.</h3>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-4 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              <span className="font-medium">{category.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                selectedCategory === category.id ? 'bg-white text-blue-500' : category.color
              }`}>
                {category.count}
              </span>
            </button>
          ))}
        </div>

        {/* Notices List */}
        <div className="space-y-4">
          {filteredNotices.map((notice) => (
            <div 
              key={notice.id} 
              className={`${getBackgroundColor(notice.priority)} rounded-xl border border-l-4 ${getCardBorderColor(notice.priority)} p-6 hover:shadow-lg transition-shadow`}
            >
              {/* Notice Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{notice.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getPriorityColor(notice.priority)}`}>
                      {getPriorityLabel(notice.priority)}
                    </span>
                    {notice.isImportant && (
                      <Pin className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  
                  {/* Meta Information */}
                  <div className="flex items-center space-x-6 text-sm text-gray-600 mb-3">
                    <div className="flex items-center space-x-1">
                      <Building className="w-4 h-4" />
                      <span>{notice.department}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{notice.date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{notice.time}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{notice.views} views</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notice Content */}
              <div className="mb-4">
                <p className="text-gray-700 leading-relaxed">{notice.description}</p>
              </div>

              {/* Notice Footer */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    <span>{notice.author}</span>
                  </div>
                  {notice.hasAttachment && (
                    <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm">
                      <Download className="w-4 h-4" />
                      <span>Download Attachment</span>
                    </button>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="flex items-center space-x-1 bg-white text-gray-700 px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 text-sm transition-colors">
                    <Eye className="w-4 h-4" />
                    <span>View Details</span>
                  </button>
                  {notice.hasAttachment && (
                    <button className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 text-sm transition-colors">
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-8">
          <button className="bg-white text-gray-700 px-6 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors flex items-center space-x-2 mx-auto">
            <span>Load More Notices</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}