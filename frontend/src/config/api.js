// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// API endpoints
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  ME: `${API_BASE_URL}/auth/me`,
  CHANGE_PASSWORD: `${API_BASE_URL}/auth/change-password`,
  
  // Student
  STUDENT_DASHBOARD: `${API_BASE_URL}/student/dashboard`,
  STUDENT_PROFILE: `${API_BASE_URL}/student/profile`,
  STUDENT_ATTENDANCE: `${API_BASE_URL}/student/attendance`,
  STUDENT_SCHEDULE: `${API_BASE_URL}/student/schedule`,
  
  // Faculty
  FACULTY_DASHBOARD: `${API_BASE_URL}/faculty/dashboard`,
  FACULTY_PROFILE: `${API_BASE_URL}/faculty/profile`,
  FACULTY_STUDENTS: `${API_BASE_URL}/faculty/students`,
  FACULTY_SCHEDULE: `${API_BASE_URL}/faculty/schedule`,
  FACULTY_AT_RISK: `${API_BASE_URL}/faculty/students/at-risk`,
  
  // Attendance
  MARK_ATTENDANCE: `${API_BASE_URL}/attendance/mark`,
  ATTENDANCE_OVERVIEW: `${API_BASE_URL}/attendance/faculty/overview`,
  
  // Fee Management
  STUDENT_FEES: `${API_BASE_URL}/fee/student`,
  FEE_SUMMARY: `${API_BASE_URL}/fee/student/summary`,
  PAYMENT_HISTORY: `${API_BASE_URL}/fee/student/payments`,
  INITIATE_PAYMENT: `${API_BASE_URL}/fee/payment/initiate`,
  
  // Notice Board
  NOTICES: `${API_BASE_URL}/notice`,
  CREATE_NOTICE: `${API_BASE_URL}/notice`,
  
  // Helpdesk
  HELPDESK_TICKETS: `${API_BASE_URL}/helpdesk/tickets`,
  CREATE_TICKET: `${API_BASE_URL}/helpdesk/ticket`,
  
  // Health Check
  HEALTH: `${API_BASE_URL.replace('/api', '')}/api/health`
};

// HTTP client with authentication
export class ApiClient {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  getAuthHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  async request(url, options = {}) {
    const config = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    console.log('API Request:', { url, config }); // Debug log

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      console.log('API Response:', { status: response.status, data }); // Debug log

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth methods
  async login(credentials) {
    const data = await this.request(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (data.success && data.data.token) {
      this.setToken(data.data.token);
    }
    
    return data;
  }

  async logout() {
    try {
      await this.request(API_ENDPOINTS.LOGOUT, {
        method: 'POST',
      });
    } finally {
      this.setToken(null);
    }
  }

  async getCurrentUser() {
    return this.request(API_ENDPOINTS.ME);
  }

  // Student methods
  async getStudentDashboard() {
    return this.request(API_ENDPOINTS.STUDENT_DASHBOARD);
  }

  async getStudentAttendance(params = {}) {
    const url = new URL(API_ENDPOINTS.STUDENT_ATTENDANCE);
    Object.keys(params).forEach(key => {
      if (params[key]) url.searchParams.append(key, params[key]);
    });
    return this.request(url.toString());
  }

  // Faculty methods
  async getFacultyDashboard() {
    return this.request(API_ENDPOINTS.FACULTY_DASHBOARD);
  }

  async markAttendance(attendanceData) {
    return this.request(API_ENDPOINTS.MARK_ATTENDANCE, {
      method: 'POST',
      body: JSON.stringify(attendanceData),
    });
  }

  // Fee methods
  async getStudentFees() {
    return this.request(API_ENDPOINTS.STUDENT_FEES);
  }

  // Notice methods
  async getNotices(params = {}) {
    const url = new URL(API_ENDPOINTS.NOTICES);
    Object.keys(params).forEach(key => {
      if (params[key]) url.searchParams.append(key, params[key]);
    });
    return this.request(url.toString());
  }

  // Health check
  async healthCheck() {
    return this.request(API_ENDPOINTS.HEALTH);
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

export default apiClient;