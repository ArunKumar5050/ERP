import React from 'react';
import { Headphones, Phone, Mail, Calendar, Clock, User, MessageSquare, CheckCircle, AlertCircle, FileText, Zap } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

export default function HelpDesk() {
  const helpDeskData = {
    stats: {
      satisfaction: 92,
      avgResponseTime: '4.2h',
      openTickets: 15,
      resolvedToday: 23
    },
    supportCategories: [
      { name: 'Academic Support', count: 45, color: '#10b981' },
      { name: 'Technical Issues', count: 32, color: '#3b82f6' },
      { name: 'Fee Related', count: 28, color: '#f59e0b' },
      { name: 'General Inquiry', count: 18, color: '#8b5cf6' },
      { name: 'Examination', count: 15, color: '#ef4444' }
    ],
    satisfactionSetup: [
      { category: 'Academic Support', percentage: 95, color: '#10b981' },
      { category: 'Technical', percentage: 88, color: '#3b82f6' },
      { category: 'Fee Related', percentage: 92, color: '#f59e0b' },
      { category: 'General', percentage: 90, color: '#8b5cf6' }
    ],
    monthlyRequests: [
      { month: 'Jan', requests: 120 },
      { month: 'Feb', requests: 135 },
      { month: 'Mar', requests: 128 },
      { month: 'Apr', requests: 142 },
      { month: 'May', requests: 155 },
      { month: 'Jun', requests: 148 }
    ],
    availableCounselors: [
      {
        id: 1,
        name: 'Dr. Sarah Johnson',
        specialization: 'Academic Support',
        status: 'Available',
        rating: 4.9,
        nextSlot: '10:00 AM',
        avatar: 'SJ'
      },
      {
        id: 2,
        name: 'Prof. Michael Brown',
        specialization: 'Career Counseling',
        status: 'Available',
        rating: 4.8,
        nextSlot: '11:30 AM',
        avatar: 'MB'
      },
      {
        id: 3,
        name: 'Dr. Emily Davis',
        specialization: 'Personal Counseling',
        status: 'Busy',
        rating: 4.7,
        nextSlot: '2:00 PM',
        avatar: 'ED'
      },
      {
        id: 4,
        name: 'Mr. Robert Wilson',
        specialization: 'Technical Support',
        status: 'Available',
        rating: 4.6,
        nextSlot: '9:30 AM',
        avatar: 'RW'
      }
    ],
    recentTickets: [
      {
        id: 'T001',
        title: 'Login Issue with Student Portal',
        category: 'Technical',
        priority: 'High',
        status: 'Open',
        created: '2 hours ago',
        assignee: 'Tech Support'
      },
      {
        id: 'T002',
        title: 'Transcript Request',
        category: 'Academic',
        priority: 'Medium',
        status: 'In Progress',
        created: '4 hours ago',
        assignee: 'Academic Office'
      },
      {
        id: 'T003',
        title: 'Fee Payment Gateway Error',
        category: 'Financial',
        priority: 'High',
        status: 'Open',
        created: '1 day ago',
        assignee: 'Finance Team'
      },
      {
        id: 'T004',
        title: 'Library Book Renewal',
        category: 'General',
        priority: 'Low',
        status: 'Resolved',
        created: '2 days ago',
        assignee: 'Library Services'
      }
    ]
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Busy':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Away':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-700';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'Low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-300 text-white';
    }
  };

  const getTicketStatusColor = (status) => {
    switch (status) {
      case 'Open':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Helpdesk & Counselling</h1>
          <p className="text-gray-600">Get support and book counselling sessions with our expert team</p>
        </div>

        {/* Support Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Submit Ticket */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Submit Ticket</h3>
                  <p className="text-sm text-gray-600">Report issues and get help</p>
                </div>
              </div>
            </div>
          </div>

          {/* Call Support */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Phone className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Call Support</h3>
                  <p className="text-sm text-gray-600">Direct phone assistance</p>
                </div>
              </div>
            </div>
          </div>

          {/* Email Support */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Email Support</h3>
                  <p className="text-sm text-gray-600">Send detailed queries</p>
                </div>
              </div>
            </div>
          </div>

          {/* Book Counselling */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Book Counselling</h3>
                  <p className="text-sm text-gray-600">Schedule counselling sessions</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Support Category Analytics */}
          <div className="bg-green-50 rounded-xl border border-green-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Support Category Analytics</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={helpDeskData.supportCategories}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#6b7280' }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
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
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {helpDeskData.supportCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Satisfaction Setup */}
          <div className="bg-green-50 rounded-xl border border-green-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Satisfaction Setup</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={helpDeskData.satisfactionSetup}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="percentage"
                  >
                    {helpDeskData.satisfactionSetup.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value) => [`${value}%`, 'Satisfaction']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Monthly Support Requests */}
        <div className="bg-green-50 rounded-xl border border-green-200 p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Monthly Support Requests</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={helpDeskData.monthlyRequests}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="month" 
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
                />
                <Line 
                  type="monotone" 
                  dataKey="requests" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7, fill: '#059669' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Available Counselling Services */}
        <div className="bg-green-50 rounded-xl border border-green-200 p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Available Counselling Services</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {helpDeskData.availableCounselors.map((counselor) => (
              <div key={counselor.id} className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      {counselor.avatar}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{counselor.name}</h4>
                      <p className="text-sm text-gray-600">{counselor.specialization}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(counselor.status)}`}>
                    {counselor.status}
                  </span>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-sm text-gray-600">{counselor.rating}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Next slot: {counselor.nextSlot}
                  </div>
                </div>
                
                <button className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition-colors">
                  Book Session
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Support Tickets */}
        <div className="bg-green-50 rounded-xl border border-green-200 p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Support Tickets</h3>
          
          <div className="space-y-4">
            {helpDeskData.recentTickets.map((ticket) => (
              <div key={ticket.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-sm font-mono text-gray-500">{ticket.id}</span>
                      <h4 className="font-semibold text-gray-900">{ticket.title}</h4>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{ticket.category}</span>
                      <span>•</span>
                      <span>{ticket.created}</span>
                      <span>•</span>
                      <span>{ticket.assignee}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTicketStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Statistics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Satisfaction Rate */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{helpDeskData.stats.satisfaction}%</div>
            <div className="text-sm text-gray-600 font-medium">Satisfaction Rate</div>
          </div>

          {/* Average Response Time */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-gray-600 mb-2 flex items-center justify-center">
              <Clock className="w-8 h-8 mr-2" />
              {helpDeskData.stats.avgResponseTime}
            </div>
            <div className="text-sm text-gray-600 font-medium">Avg Response Time</div>
          </div>

          {/* Open Tickets */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-gray-600 mb-2 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 mr-2" />
              {helpDeskData.stats.openTickets}
            </div>
            <div className="text-sm text-gray-600 font-medium">Open Tickets</div>
          </div>

          {/* Resolved Today */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 mr-2" />
              {helpDeskData.stats.resolvedToday}
            </div>
            <div className="text-sm text-gray-600 font-medium">Resolved Today</div>
          </div>
        </div>
      </div>
    </div>
  );
}