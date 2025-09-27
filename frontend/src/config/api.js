// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

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
  FACULTY_STUDENTS_WITH_ATTENDANCE: `${API_BASE_URL}/faculty/students/with-attendance`,
  FACULTY_SCHEDULE: `${API_BASE_URL}/faculty/schedule`,
  FACULTY_AT_RISK: `${API_BASE_URL}/faculty/students/at-risk`,
  
  // Dropout Prediction
  DROPOUT_PREDICT: `${API_BASE_URL}/dropout/predict`,
  DROPOUT_TRAIN: `${API_BASE_URL}/dropout/train`,
  DROPOUT_FEATURE_IMPORTANCE: `${API_BASE_URL}/dropout/feature-importance`,
  
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

    // Add retry mechanism for failed requests
    let lastError;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const response = await fetch(url, config);
        
        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        let data;
        
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          // If not JSON, try to get text
          const text = await response.text();
          data = { 
            success: response.ok,
            message: text || `HTTP ${response.status}: ${response.statusText}`,
            data: null
          };
        }

        console.log('API Response:', { status: response.status, data, attempt }); // Debug log

        if (!response.ok) {
          throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
        }

        return data;
      } catch (error) {
        console.error(`API Error (attempt ${attempt}):`, error);
        lastError = error;
        
        // Don't retry on authentication errors or client errors
        if (error.message && (error.message.includes('401') || error.message.includes('403') || error.message.includes('400'))) {
          throw error;
        }
        
        // Wait before retrying (exponential backoff)
        if (attempt < 3) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
    }
    
    // If all attempts failed, throw the last error
    throw lastError;
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
    } catch (error) {
      console.log('Logout request failed:', error);
      // Continue with local cleanup even if server request fails
    } finally {
      // Clear all authentication data
      this.setToken(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Also clear any other possible auth-related items
      localStorage.removeItem('userRole');
      localStorage.removeItem('userId');
      
      // Clear session storage as well
      sessionStorage.clear();
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

  async getStudentProfile() {
    return this.request(API_ENDPOINTS.STUDENT_PROFILE);
  }

  // Faculty methods
  async getFacultyDashboard() {
    return this.request(API_ENDPOINTS.FACULTY_DASHBOARD);
  }

  async getFacultyStudents() {
    return this.request(API_ENDPOINTS.FACULTY_STUDENTS);
  }

  async getFacultyStudentsWithAttendance() {
    console.log('Making request to:', API_ENDPOINTS.FACULTY_STUDENTS_WITH_ATTENDANCE)
    return this.request(API_ENDPOINTS.FACULTY_STUDENTS_WITH_ATTENDANCE);
  }

  async getAtRiskStudents() {
    return this.request(API_ENDPOINTS.FACULTY_AT_RISK);
  }

  async predictStudentDropout(studentId) {
    return this.request(`${API_ENDPOINTS.DROPOUT_PREDICT}/${studentId}`, {
      method: 'POST'
    });
  }

  async trainDropoutModel() {
    return this.request(API_ENDPOINTS.DROPOUT_TRAIN, {
      method: 'POST'
    });
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