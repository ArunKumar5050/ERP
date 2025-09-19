import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { LogOut, User, Settings, ChevronDown } from 'lucide-react'
import { apiClient } from '../config/api'

const FacultyHeader = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [facultyInfo, setFacultyInfo] = useState(null)
  const dropdownRef = useRef(null)
  const tabs = ['Home', 'Schedule', 'Attendance', 'All Stud', 'Results', 'My Attendance', 'Reports']

  // Get faculty info from localStorage
  useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) {
      setFacultyInfo(JSON.parse(user))
    }
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Update active tab based on current route
  useEffect(() => {
    const path = location.pathname
    switch (path) {
      case '/faculty/dashboard':
        setActiveTab('Home')
        break
      case '/faculty/schedule':
        setActiveTab('Schedule')
        break
      case '/faculty/attendance':
        setActiveTab('Attendance')
        break
      case '/faculty/at-risk':
        setActiveTab('All Stud')
        break
      case '/faculty/results':
        setActiveTab('Results')
        break
      case '/faculty/my-attendance':
        setActiveTab('My Attendance')
        break
      case '/faculty/reports':
        setActiveTab('Reports')
        break
      default:
        break
    }
  }, [location.pathname, setActiveTab])

  // Handle logout
  const handleLogout = async () => {
    try {
      // Call the improved logout method which clears everything
      await apiClient.logout()
      
      // Navigate to login page
      navigate('/login', { replace: true })
      
      // Force a page reload to ensure all state is cleared
      window.location.reload()
    } catch (error) {
      console.error('Logout error:', error)
      // Even if logout fails, clear local data and redirect
      localStorage.clear()
      sessionStorage.clear()
      navigate('/login', { replace: true })
      window.location.reload()
    }
  }

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen)
  }

  const handleTabClick = (tab) => {
    setActiveTab(tab)
    
    // Navigate to appropriate routes
    switch (tab) {
      case 'Home':
        navigate('/faculty/dashboard')
        break
      case 'Schedule':
        navigate('/faculty/schedule')
        break
      case 'Attendance':
        navigate('/faculty/attendance')
        break
      case 'All Stud':
        navigate('/faculty/at-risk')
        break
      case 'Results':
        navigate('/faculty/results')
        break
      case 'My Attendance':
        navigate('/faculty/my-attendance')
        break
      case 'Reports':
        navigate('/faculty/reports')
        break
      default:
        // For other tabs, stay on current page for now
        break
    }
  }

  return (
    <>
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Professor Portal</h1>
                <p className="text-sm text-gray-500">Faculty Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={toggleProfileDropdown}
                  className="flex items-center space-x-3 hover:bg-gray-50 rounded-lg p-2 transition-colors duration-200"
                >
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {facultyInfo ? 
                        `${facultyInfo.firstName?.charAt(0) || ''}${facultyInfo.lastName?.charAt(0) || ''}` : 
                        'F'
                      }
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {facultyInfo ? 
                        `${facultyInfo.firstName || ''} ${facultyInfo.lastName || ''}` : 
                        'Faculty Member'
                      }
                    </p>
                    <p className="text-xs text-gray-500">Faculty</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                    isProfileDropdownOpen ? 'rotate-180' : ''
                  }`} />
                </button>

                {/* Profile Dropdown */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="py-2">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {facultyInfo ? 
                            `${facultyInfo.firstName || ''} ${facultyInfo.lastName || ''}` : 
                            'Faculty Member'
                          }
                        </p>
                        <p className="text-xs text-gray-500">
                          {facultyInfo?.email || 'faculty@college.edu'}
                        </p>
                      </div>
                      
                      <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </button>
                      
                      <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </button>
                      
                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <button 
                          onClick={handleLogout}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center space-x-2 py-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabClick(tab)}
                className={`py-2 px-6 text-sm font-medium border-2 rounded-lg transition-all duration-200 ${
                  activeTab === tab
                    ? 'border-green-600 bg-green-600 text-white shadow-md'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-green-500 hover:bg-green-50 hover:text-green-700 hover:shadow-sm'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default FacultyHeader