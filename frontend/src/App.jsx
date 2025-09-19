import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import './App.css'
import LoginForm from './components/Login'
import StudentDashboard from './components/StudentDashboard'
import FacultyDashboard from './components/FacultyDashboard'
import FacultySchedule from './components/FacultySchedule'
import FacultyAttendance from './components/FacultyAttendance'
import FacultyResult from './components/FacultyResult'
import FacultySelfAttendance from './components/FacultySelfAttendance'
import FacultyReport from './components/FacultyReport'
import FacultyAtRisk from './components/FacultyAtRisk'
import Navbar from './components/navbar'
import Profile from './components/profile'
import FeeManagement from './components/FeeManagement'
import NoticeBoard from './components/NoticeBoard'
import Attendance from './components/Attendance'
import Result from './components/Result'
import HelpDesk from './components/HelpDesk'
import ProtectedRoute from './components/ProtectedRoute'

function AppContent() {
  const location = useLocation()
  const isLoginPage = location.pathname === '/login'
  const isFacultyPortal = location.pathname.startsWith('/faculty')
  const isStudentPortal = location.pathname.startsWith('/student') || 
                         location.pathname === '/' ||
                         ['/dashboard', '/profile', '/fee-management', '/notice-board', '/attendance', '/results', '/helpdesk'].includes(location.pathname)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Show navbar for student portal routes, hide for login and faculty portal */}
      {!isLoginPage && !isFacultyPortal && isStudentPortal && <Navbar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginForm />} />
        
        {/* Protected Student Routes */}
        <Route path="/" element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        } />
        <Route path="/student-dashboard" element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        } />
        <Route path="/student/dashboard" element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        } />
        <Route path="/student/profile" element={
          <ProtectedRoute allowedRoles={['student']}>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/student/fee-management" element={
          <ProtectedRoute allowedRoles={['student']}>
            <FeeManagement />
          </ProtectedRoute>
        } />
        <Route path="/student/notice-board" element={
          <ProtectedRoute allowedRoles={['student']}>
            <NoticeBoard />
          </ProtectedRoute>
        } />
        <Route path="/student/attendance" element={
          <ProtectedRoute allowedRoles={['student']}>
            <Attendance />
          </ProtectedRoute>
        } />
        <Route path="/student/results" element={
          <ProtectedRoute allowedRoles={['student']}>
            <Result />
          </ProtectedRoute>
        } />
        <Route path="/student/helpdesk" element={
          <ProtectedRoute allowedRoles={['student']}>
            <HelpDesk />
          </ProtectedRoute>
        } />
        
        {/* Protected Faculty Routes */}
        <Route path="/faculty-dashboard" element={
          <ProtectedRoute allowedRoles={['faculty']}>
            <FacultyDashboard />
          </ProtectedRoute>
        } />
        <Route path="/faculty/dashboard" element={
          <ProtectedRoute allowedRoles={['faculty']}>
            <FacultyDashboard />
          </ProtectedRoute>
        } />
        <Route path="/faculty/schedule" element={
          <ProtectedRoute allowedRoles={['faculty']}>
            <FacultySchedule />
          </ProtectedRoute>
        } />
        <Route path="/faculty/attendance" element={
          <ProtectedRoute allowedRoles={['faculty']}>
            <FacultyAttendance />
          </ProtectedRoute>
        } />
        <Route path="/faculty/results" element={
          <ProtectedRoute allowedRoles={['faculty']}>
            <FacultyResult />
          </ProtectedRoute>
        } />
        <Route path="/faculty/my-attendance" element={
          <ProtectedRoute allowedRoles={['faculty']}>
            <FacultySelfAttendance />
          </ProtectedRoute>
        } />
        <Route path="/faculty/reports" element={
          <ProtectedRoute allowedRoles={['faculty']}>
            <FacultyReport />
          </ProtectedRoute>
        } />
        <Route path="/faculty/at-risk" element={
          <ProtectedRoute allowedRoles={['faculty']}>
            <FacultyAtRisk />
          </ProtectedRoute>
        } />
        
        {/* Protected Admin Routes */}
        <Route path="/admin-dashboard" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <StudentDashboard /> {/* Temporary, should be AdminDashboard */}
          </ProtectedRoute>
        } />
        
        {/* Legacy protected routes for backward compatibility */}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute allowedRoles={['student']}>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/fee-management" element={
          <ProtectedRoute allowedRoles={['student']}>
            <FeeManagement />
          </ProtectedRoute>
        } />
        <Route path="/notice-board" element={
          <ProtectedRoute allowedRoles={['student']}>
            <NoticeBoard />
          </ProtectedRoute>
        } />
        <Route path="/attendance" element={
          <ProtectedRoute allowedRoles={['student']}>
            <Attendance />
          </ProtectedRoute>
        } />
        <Route path="/results" element={
          <ProtectedRoute allowedRoles={['student']}>
            <Result />
          </ProtectedRoute>
        } />
        <Route path="/helpdesk" element={
          <ProtectedRoute allowedRoles={['student']}>
            <HelpDesk />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
