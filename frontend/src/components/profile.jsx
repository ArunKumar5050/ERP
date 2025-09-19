import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Hash, GraduationCap, Building, UserCheck, UserPlus, Phone as PhoneIcon } from 'lucide-react';
import { apiClient } from '../config/api';

export default function Profile() {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStudentProfile();
  }, []);

  const fetchStudentProfile = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await apiClient.getStudentProfile();
      
      if (response.success) {
        // Transform the API data to match the component's expected structure
        const transformedData = transformStudentData(response.data);
        setStudentData(transformedData);
      } else {
        setError('Failed to fetch student profile');
      }
    } catch (err) {
      console.error('Error fetching student profile:', err);
      setError('Error loading student profile');
    } finally {
      setLoading(false);
    }
  };

  const transformStudentData = (apiData) => {
    // Extract first name and last name from the name field
    const nameParts = apiData.name?.split(' ') || [];
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    
    return {
      name: apiData.name || 'Unknown Student',
      initials: initials || 'US',
      rollNumber: apiData.roll_no || 'N/A',
      semester: `${apiData.semester || 'N/A'}th Semester`,
      cgpa: 'N/A', // Not available in current data
      program: `Bachelor of ${apiData.branch || 'Engineering'}`,
      section: `Section ${apiData.section || 'N/A'}`,
      personalInfo: {
        email: apiData.email || 'N/A',
        phone: apiData.phone_no || 'N/A',
        address: apiData.address || 'N/A',
        dateOfBirth: apiData.date_of_birth ? new Date(apiData.date_of_birth).toLocaleDateString() : 'N/A',
        bloodGroup: apiData.blood_group || 'N/A'
      },
      academicInfo: {
        department: apiData.branch || 'N/A',
        batch: apiData.batch || 'N/A',
        mentor: apiData.mentor_name || 'N/A',
        joinDate: apiData.join_date ? new Date(apiData.join_date).toLocaleDateString() : 'N/A',
        studentType: 'Regular' // Default value
      },
      emergencyContact: {
        name: apiData.father_name || 'N/A',
        relation: 'Father', // Default value
        phone: apiData.father_phone || 'N/A'
      },
      academicProgress: {
        admissionYear: apiData.batch ? apiData.batch.split('-')[0] : 'N/A',
        currentSemester: `${apiData.semester || 'N/A'}th Semester`,
        cgpa: 'N/A', // Not available in current data
        expectedGraduation: apiData.batch ? `20${parseInt(apiData.batch.split('-')[1]) + 4}` : 'N/A'
      }
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading student profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-2xl mb-4">Error Loading Profile</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchStudentProfile}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 text-2xl mb-4">No Profile Data Available</div>
          <p className="text-gray-600">Unable to load student profile information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Student Header Section */}
        <div className="bg-gradient-to-r from-green-100 to-green-50 rounded-2xl p-8 border border-green-200">
          <div className="flex items-center space-x-6">
            {/* Profile Avatar */}
            <div className="w-24 h-24 bg-[#60a16c] rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {studentData.initials}
            </div>
            
            {/* Student Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-3">{studentData.name}</h1>
              
              {/* Badges */}
              <div className="flex items-center space-x-3 mb-3">
                <span className="bg-teal-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {studentData.rollNumber}
                </span>
                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {studentData.semester}
                </span>
                <span className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm font-medium">
                  CGPA: {studentData.cgpa}
                </span>
              </div>
              
              {/* Program Info */}
              <p className="text-gray-600 text-lg">
                {studentData.program} • {studentData.section}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="bg-gradient-to-b from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
            <div className="flex items-center mb-6">
              <User className="w-6 h-6 text-gray-600 mr-3" />
              <h2 className="text-xl font-bold text-gray-800">Personal Information</h2>
            </div>
            
            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-start space-x-4">
                <Mail className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <p className="text-gray-800 font-medium">{studentData.personalInfo.email}</p>
                </div>
              </div>
              
              {/* Phone */}
              <div className="flex items-start space-x-4">
                <Phone className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-500 mb-1">Phone</p>
                  <p className="text-gray-800 font-medium">{studentData.personalInfo.phone}</p>
                </div>
              </div>
              
              {/* Address */}
              <div className="flex items-start space-x-4">
                <MapPin className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-500 mb-1">Address</p>
                  <p className="text-gray-800 font-medium">{studentData.personalInfo.address}</p>
                </div>
              </div>
              
              {/* Date of Birth */}
              <div className="flex items-start space-x-4">
                <Calendar className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-500 mb-1">Date of Birth</p>
                  <p className="text-gray-800 font-medium">{studentData.personalInfo.dateOfBirth}</p>
                </div>
              </div>
              
              {/* Blood Group */}
              <div className="flex items-start space-x-4">
                <Hash className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-500 mb-1">Blood Group</p>
                  <p className="text-gray-800 font-medium">{studentData.personalInfo.bloodGroup}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="bg-gradient-to-b from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
            <div className="flex items-center mb-6">
              <GraduationCap className="w-6 h-6 text-gray-600 mr-3" />
              <h2 className="text-xl font-bold text-gray-800">Academic Information</h2>
            </div>
            
            <div className="space-y-6">
              {/* Department */}
              <div className="flex items-start space-x-4">
                <Building className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-500 mb-1">Department</p>
                  <p className="text-gray-800 font-medium">{studentData.academicInfo.department}</p>
                </div>
              </div>
              
              {/* Batch */}
              <div className="flex items-start space-x-4">
                <Calendar className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-500 mb-1">Batch</p>
                  <p className="text-gray-800 font-medium">{studentData.academicInfo.batch}</p>
                </div>
              </div>
              
              {/* Mentor */}
              <div className="flex items-start space-x-4">
                <UserCheck className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-500 mb-1">Mentor</p>
                  <p className="text-gray-800 font-medium">{studentData.academicInfo.mentor}</p>
                </div>
              </div>
              
              {/* Join Date */}
              <div className="flex items-start space-x-4">
                <Calendar className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-500 mb-1">Join Date</p>
                  <p className="text-gray-800 font-medium">{studentData.academicInfo.joinDate}</p>
                </div>
              </div>
              
              {/* Student Type */}
              <div className="flex items-start space-x-4">
                <Hash className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-500 mb-1">Student Type</p>
                  <p className="text-gray-800 font-medium">{studentData.academicInfo.studentType}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contact Section */}
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
          <div className="flex items-center mb-6">
            <PhoneIcon className="w-6 h-6 text-gray-600 mr-3" />
            <h2 className="text-xl font-bold text-gray-800">Emergency Contact</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-2">Contact Name</p>
              <p className="text-gray-800 font-bold text-lg">{studentData.emergencyContact.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">Relation</p>
              <p className="text-gray-800 font-bold text-lg">{studentData.emergencyContact.relation}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">Phone Number</p>
              <p className="text-gray-800 font-bold text-lg">{studentData.emergencyContact.phone}</p>
            </div>
          </div>
        </div>

        {/* Academic Progress Section */}
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
          <h2 className="text-xl font-bold text-gray-800 mb-8">Academic Progress</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Admission Year */}
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-800 mb-2">{studentData.academicProgress.admissionYear}</div>
              <p className="text-gray-600 font-medium">Admission Year</p>
            </div>
            
            {/* Current Semester */}
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-800 mb-2">{studentData.academicProgress.currentSemester}</div>
              <p className="text-gray-600 font-medium">Current Semester</p>
            </div>
            
            {/* CGPA */}
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-800 mb-2">{studentData.academicProgress.cgpa}</div>
              <p className="text-gray-600 font-medium">CGPA</p>
            </div>
            
            {/* Expected Graduation */}
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-800 mb-2">{studentData.academicProgress.expectedGraduation}</div>
              <p className="text-gray-600 font-medium">Expected Graduation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}