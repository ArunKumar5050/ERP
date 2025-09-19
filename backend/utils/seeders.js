const mongoose = require('mongoose');
const { User, Student, Faculty, Attendance, Fee, Notice, Helpdesk } = require('../models');

// Comprehensive fake data - 12 Faculty + 30 Students + 2 Admins
const sampleUsers = [
  // Faculty Members (12 unique professors)
  { username: 'prof.smith', email: 'smith@college.edu', password: 'Password123', firstName: 'John', lastName: 'Smith', role: 'faculty', phone: '+1234567890' },
  { username: 'prof.johnson', email: 'johnson@college.edu', password: 'Password123', firstName: 'Alice', lastName: 'Johnson', role: 'faculty', phone: '+1234567891' },
  { username: 'prof.wilson', email: 'wilson@college.edu', password: 'Password123', firstName: 'Robert', lastName: 'Wilson', role: 'faculty', phone: '+1234567892' },
  { username: 'prof.davis', email: 'davis@college.edu', password: 'Password123', firstName: 'Emily', lastName: 'Davis', role: 'faculty', phone: '+1234567893' },
  { username: 'prof.williams', email: 'williams@college.edu', password: 'Password123', firstName: 'Michael', lastName: 'Williams', role: 'faculty', phone: '+1234567894' },
  { username: 'prof.brown', email: 'brown@college.edu', password: 'Password123', firstName: 'Lisa', lastName: 'Brown', role: 'faculty', phone: '+1234567895' },
  { username: 'prof.taylor', email: 'taylor@college.edu', password: 'Password123', firstName: 'David', lastName: 'Taylor', role: 'faculty', phone: '+1234567896' },
  { username: 'prof.anderson', email: 'anderson@college.edu', password: 'Password123', firstName: 'Jennifer', lastName: 'Anderson', role: 'faculty', phone: '+1234567897' },
  { username: 'prof.thomas', email: 'thomas@college.edu', password: 'Password123', firstName: 'Christopher', lastName: 'Thomas', role: 'faculty', phone: '+1234567898' },
  { username: 'prof.miller', email: 'miller@college.edu', password: 'Password123', firstName: 'Susan', lastName: 'Miller', role: 'faculty', phone: '+1234567899' },
  { username: 'prof.garcia', email: 'garcia@college.edu', password: 'Password123', firstName: 'Carlos', lastName: 'Garcia', role: 'faculty', phone: '+1234567810' },
  { username: 'prof.martinez', email: 'martinez@college.edu', password: 'Password123', firstName: 'Maria', lastName: 'Martinez', role: 'faculty', phone: '+1234567811' },
  
  // Students (30 diverse students)
  { username: 'student001', email: 'student001@college.edu', password: 'Password123', firstName: 'Alex', lastName: 'Anderson', role: 'student', phone: '+1234567820' },
  { username: 'student002', email: 'student002@college.edu', password: 'Password123', firstName: 'Sarah', lastName: 'Miller', role: 'student', phone: '+1234567821' },
  { username: 'student003', email: 'student003@college.edu', password: 'Password123', firstName: 'James', lastName: 'Wilson', role: 'student', phone: '+1234567822' },
  { username: 'student004', email: 'student004@college.edu', password: 'Password123', firstName: 'Emma', lastName: 'Garcia', role: 'student', phone: '+1234567823' },
  { username: 'student005', email: 'student005@college.edu', password: 'Password123', firstName: 'William', lastName: 'Martinez', role: 'student', phone: '+1234567824' },
  { username: 'student006', email: 'student006@college.edu', password: 'Password123', firstName: 'Olivia', lastName: 'Taylor', role: 'student', phone: '+1234567825' },
  { username: 'student007', email: 'student007@college.edu', password: 'Password123', firstName: 'Benjamin', lastName: 'Thomas', role: 'student', phone: '+1234567826' },
  { username: 'student008', email: 'student008@college.edu', password: 'Password123', firstName: 'Sophia', lastName: 'Jackson', role: 'student', phone: '+1234567827' },
  { username: 'student009', email: 'student009@college.edu', password: 'Password123', firstName: 'Ethan', lastName: 'White', role: 'student', phone: '+1234567828' },
  { username: 'student010', email: 'student010@college.edu', password: 'Password123', firstName: 'Isabella', lastName: 'Harris', role: 'student', phone: '+1234567829' },
  { username: 'student011', email: 'student011@college.edu', password: 'Password123', firstName: 'Mason', lastName: 'Clark', role: 'student', phone: '+1234567830' },
  { username: 'student012', email: 'student012@college.edu', password: 'Password123', firstName: 'Ava', lastName: 'Lewis', role: 'student', phone: '+1234567831' },
  { username: 'student013', email: 'student013@college.edu', password: 'Password123', firstName: 'Lucas', lastName: 'Walker', role: 'student', phone: '+1234567832' },
  { username: 'student014', email: 'student014@college.edu', password: 'Password123', firstName: 'Mia', lastName: 'Hall', role: 'student', phone: '+1234567833' },
  { username: 'student015', email: 'student015@college.edu', password: 'Password123', firstName: 'Noah', lastName: 'Young', role: 'student', phone: '+1234567834' },
  { username: 'student016', email: 'student016@college.edu', password: 'Password123', firstName: 'Charlotte', lastName: 'King', role: 'student', phone: '+1234567835' },
  { username: 'student017', email: 'student017@college.edu', password: 'Password123', firstName: 'Liam', lastName: 'Wright', role: 'student', phone: '+1234567836' },
  { username: 'student018', email: 'student018@college.edu', password: 'Password123', firstName: 'Amelia', lastName: 'Lopez', role: 'student', phone: '+1234567837' },
  { username: 'student019', email: 'student019@college.edu', password: 'Password123', firstName: 'Oliver', lastName: 'Hill', role: 'student', phone: '+1234567838' },
  { username: 'student020', email: 'student020@college.edu', password: 'Password123', firstName: 'Harper', lastName: 'Scott', role: 'student', phone: '+1234567839' },
  { username: 'student021', email: 'student021@college.edu', password: 'Password123', firstName: 'Elijah', lastName: 'Green', role: 'student', phone: '+1234567840' },
  { username: 'student022', email: 'student022@college.edu', password: 'Password123', firstName: 'Evelyn', lastName: 'Adams', role: 'student', phone: '+1234567841' },
  { username: 'student023', email: 'student023@college.edu', password: 'Password123', firstName: 'Sebastian', lastName: 'Baker', role: 'student', phone: '+1234567842' },
  { username: 'student024', email: 'student024@college.edu', password: 'Password123', firstName: 'Abigail', lastName: 'Gonzalez', role: 'student', phone: '+1234567843' },
  { username: 'student025', email: 'student025@college.edu', password: 'Password123', firstName: 'Daniel', lastName: 'Nelson', role: 'student', phone: '+1234567844' },
  { username: 'student026', email: 'student026@college.edu', password: 'Password123', firstName: 'Elizabeth', lastName: 'Carter', role: 'student', phone: '+1234567845' },
  { username: 'student027', email: 'student027@college.edu', password: 'Password123', firstName: 'Henry', lastName: 'Mitchell', role: 'student', phone: '+1234567846' },
  { username: 'student028', email: 'student028@college.edu', password: 'Password123', firstName: 'Sofia', lastName: 'Perez', role: 'student', phone: '+1234567847' },
  { username: 'student029', email: 'student029@college.edu', password: 'Password123', firstName: 'Jackson', lastName: 'Roberts', role: 'student', phone: '+1234567848' },
  { username: 'student030', email: 'student030@college.edu', password: 'Password123', firstName: 'Scarlett', lastName: 'Turner', role: 'student', phone: '+1234567849' },
  
  // Admins (2)
  { username: 'admin', email: 'admin@college.edu', password: 'Admin123', firstName: 'Admin', lastName: 'User', role: 'admin', phone: '+1234567800' },
  { username: 'admin.registrar', email: 'registrar@college.edu', password: 'Admin123', firstName: 'Jane', lastName: 'Registrar', role: 'admin', phone: '+1234567801' }
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting comprehensive database seeding...');

    // Clear existing data more thoroughly
    console.log('🗑️ Dropping existing collections...');
    try {
      await mongoose.connection.db.dropDatabase();
      console.log('Database dropped successfully');
    } catch (error) {
      console.log('Database drop error (might not exist):', error.message);
    }
    
    // Additional cleanup
    await User.deleteMany({});
    await Student.deleteMany({});
    await Faculty.deleteMany({});
    await Attendance.deleteMany({});
    await Fee.deleteMany({});
    await Notice.deleteMany({});
    await Helpdesk.deleteMany({});

    // Create users
    const users = await User.create(sampleUsers);
    console.log(`👥 Created ${users.length} users`);

    const facultyUsers = users.filter(u => u.role === 'faculty');
    const studentUsers = users.filter(u => u.role === 'student');

    // Create diverse subjects for better variety
    const subjects = [
      { code: 'CS301', name: 'Data Structures & Algorithms', credits: 4, dept: 'Computer Science' },
      { code: 'CS302', name: 'Database Management Systems', credits: 4, dept: 'Computer Science' },
      { code: 'CS303', name: 'Operating Systems', credits: 3, dept: 'Computer Science' },
      { code: 'CS304', name: 'Computer Networks', credits: 3, dept: 'Computer Science' },
      { code: 'CS305', name: 'Software Engineering', credits: 4, dept: 'Computer Science' },
      { code: 'CS306', name: 'Web Development', credits: 3, dept: 'Computer Science' },
      { code: 'MATH301', name: 'Advanced Mathematics', credits: 4, dept: 'Mathematics' },
      { code: 'PHY302', name: 'Applied Physics', credits: 3, dept: 'Physics' },
      { code: 'ENG301', name: 'Technical Communication', credits: 2, dept: 'English' },
      { code: 'MGMT301', name: 'Project Management', credits: 2, dept: 'Management' },
      { code: 'CS307', name: 'Machine Learning', credits: 4, dept: 'Computer Science' },
      { code: 'CS308', name: 'Mobile App Development', credits: 3, dept: 'Computer Science' }
    ];

    // Create faculty profiles with unique data
    const facultyData = facultyUsers.map((user, index) => ({
      user: user._id,
      employeeId: `FAC${String(index + 1).padStart(3, '0')}`,
      department: subjects[index].dept,
      designation: ['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer'][index % 4],
      qualification: index < 8 ? 'Ph.D.' : 'M.Tech/M.A.',
      experience: Math.floor(Math.random() * 20) + 5,
      dateOfJoining: new Date(2010 + Math.floor(Math.random() * 14), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
      dateOfBirth: new Date(1970 + Math.floor(Math.random() * 25), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
      gender: index % 2 === 0 ? 'male' : 'female',
      subjects: [{
        subjectCode: subjects[index].code,
        subjectName: subjects[index].name,
        credits: subjects[index].credits,
        semester: 5,
        course: 'Computer Science',
        classSchedule: [{
          day: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'][index % 5],
          startTime: `${9 + (index % 6)}:00`,
          endTime: `${10 + (index % 6)}:00`,
          roomNumber: `Room-${101 + index}`,
          classType: ['Lecture', 'Tutorial', 'Practical'][index % 3]
        }]
      }]
    }));

    const faculty = await Faculty.create(facultyData);
    console.log(`👨‍🏫 Created ${faculty.length} faculty profiles`);

    // Create student profiles with more variety
    const studentData = studentUsers.map((user, index) => {
      const studentNumber = String(index + 1).padStart(3, '0');
      const sections = ['A', 'B', 'C', 'D'];
      const cgpaOptions = [7.2, 7.5, 7.8, 8.0, 8.2, 8.5, 8.7, 9.0, 9.2, 9.5];
      
      return {
        user: user._id,
        studentId: `STU2023${studentNumber}`,
        rollNumber: `CS23${studentNumber}`,
        course: 'Computer Science',
        batch: '2023-2027',
        semester: 5,
        section: sections[index % sections.length],
        dateOfBirth: new Date(2002 + (index % 3), (index % 12), (index % 28) + 1),
        gender: index % 2 === 0 ? 'male' : 'female',
        academicInfo: {
          admissionDate: new Date('2023-08-15'),
          currentCGPA: cgpaOptions[index % cgpaOptions.length],
          status: index < 28 ? 'active' : (index === 28 ? 'inactive' : 'dropped')
        },
        subjects: subjects.slice(0, 8).map(s => ({
          subjectCode: s.code,
          subjectName: s.name,
          credits: s.credits,
          semester: 5,
          course: 'Computer Science',
          faculty: faculty[subjects.findIndex(sub => sub.code === s.code)]?._id
        }))
      };
    });

    const students = await Student.create(studentData);
    console.log(`👨‍🎓 Created ${students.length} student profiles`);

    // Generate realistic attendance data for 45 days
    console.log('📋 Generating comprehensive attendance records...');
    const attendanceData = [];
    const today = new Date();
    
    for (let day = 0; day < 45; day++) {
      const date = new Date(today);
      date.setDate(date.getDate() - day);
      
      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue;
      
      for (const student of students) {
        // Each student has 4-5 classes per day
        const dailyClasses = Math.floor(Math.random() * 2) + 4;
        const todaysFaculty = faculty.sort(() => 0.5 - Math.random()).slice(0, dailyClasses);
        
        todaysFaculty.forEach((facultyMember, period) => {
          const subject = facultyMember.subjects[0];
          let status = 'present';
          
          // More realistic attendance patterns based on student performance
          const dayOfWeek = date.getDay();
          const isRecentWeek = day < 7;
          const studentPerformance = student.academicInfo.currentCGPA;
          
          // High performers have better attendance
          const baseAttendanceRate = studentPerformance > 8.5 ? 0.95 : 
                                   studentPerformance > 8.0 ? 0.90 : 
                                   studentPerformance > 7.5 ? 0.85 : 0.80;
          
          // Monday/Friday factor (lower attendance)
          const dayFactor = (dayOfWeek === 1 || dayOfWeek === 5) ? 0.85 : 1.0;
          
          // Recent week factor (better attendance recently)
          const recencyFactor = isRecentWeek ? 1.05 : 1.0;
          
          const finalRate = baseAttendanceRate * dayFactor * recencyFactor;
          
          if (Math.random() > finalRate) {
            status = Math.random() > 0.7 ? 'absent' : (Math.random() > 0.5 ? 'late' : 'excused');
          }
          
          attendanceData.push({
            student: student._id,
            faculty: facultyMember._id,
            subject: {
              subjectCode: subject.subjectCode,
              subjectName: subject.subjectName,
              credits: subject.credits
            },
            date: date,
            status: status,
            classType: ['Lecture', 'Tutorial', 'Practical'][period % 3],
            period: period + 1,
            timeSlot: {
              startTime: `${9 + period}:00`,
              endTime: `${10 + period}:00`
            },
            roomNumber: `Room-${101 + (period * 3)}`,
            markedBy: facultyMember._id,
            remarks: status === 'late' ? 'Arrived 15 minutes late' : 
                    status === 'excused' ? 'Medical leave approved' : 
                    status === 'absent' ? 'Unexcused absence' : '',
            markedAt: new Date(date.getTime() + ((9 + period) * 60 + 10) * 60000)
          });
        });
      }
    }
    
    await Attendance.create(attendanceData);
    console.log(`📋 Created ${attendanceData.length} attendance records`);

    // Create fee records (skip for now due to schema constraints)
    console.log('💰 Skipping fee records (will create manually later)');
    /*
    const feeData = students.map((student, index) => {
      const feeStructure = {
        tuitionFee: 50000,
        hostelFee: student.hostelInfo?.isHostelResident ? 25000 : 0,
        libraryFee: 2000,
        labFee: 5000,
        examFee: 3000,
        miscellaneousFee: 2000,
        fine: 0
      };
      
      // Calculate total amount
      const totalAmount = feeStructure.tuitionFee + feeStructure.hostelFee + 
                         feeStructure.libraryFee + feeStructure.labFee + 
                         feeStructure.examFee + feeStructure.miscellaneousFee + feeStructure.fine;
      
      const amountPaid = index < 20 ? (index % 2 === 0 ? totalAmount : Math.floor(totalAmount * 0.5)) : 0;
      
      return {
        student: student._id,
        semester: 5,
        academicYear: '2024-2025',
        feeStructure,
        totalAmount,
        amountPaid,
        balanceAmount: totalAmount - amountPaid,
        dueDate: new Date('2024-12-31')
      };
    });
    
    await Fee.create(feeData);
    console.log(`💰 Created ${feeData.length} fee records`);
    */

    // Create comprehensive notices
    const noticeData = [
      {
        title: 'Semester 5 Final Examination Schedule Released',
        content: 'The final examination schedule for Semester 5 has been published on the student portal. Students are advised to check their exam dates and prepare accordingly. All exams will be conducted in offline mode.',
        type: 'exam',
        priority: 'high',
        targetAudience: { students: true, specificSemesters: [5] },
        createdBy: users.find(u => u.role === 'admin')._id,
        status: 'published',
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Extended Library Hours During Exam Period',
        content: 'To facilitate better preparation for upcoming examinations, the library will remain open 24/7 from December 1st to December 20th. Additional study spaces have been arranged in the auditorium.',
        type: 'general',
        priority: 'medium',
        targetAudience: { students: true, faculty: true },
        createdBy: users.find(u => u.role === 'admin')._id,
        status: 'published'
      },
      {
        title: 'Workshop on Machine Learning and AI Applications',
        content: 'A comprehensive three-day workshop on Machine Learning and AI Applications will be conducted from November 25-27, 2024. Industry experts from top tech companies will be conducting the sessions. Registration is mandatory for CS students.',
        type: 'event',
        priority: 'medium',
        targetAudience: { students: true, specificSemesters: [5, 6, 7, 8] },
        createdBy: users.find(u => u.role === 'admin')._id,
        status: 'published'
      },
      {
        title: 'Fee Payment Deadline Extension Notice',
        content: 'Due to technical issues with the online payment gateway, the fee payment deadline has been extended to November 30th, 2024. Students can also make payments through bank transfer or demand draft.',
        type: 'fee',
        priority: 'high',
        targetAudience: { students: true },
        createdBy: users.find(u => u.role === 'admin')._id,
        status: 'published'
      },
      {
        title: 'Campus Placement Drive - December 2024',
        content: 'Major IT companies including Google, Microsoft, Amazon, and TCS will be visiting campus for placement drives. Final year students should register by November 20th. Mock interviews and aptitude tests will be conducted from November 21-25.',
        type: 'placement',
        priority: 'high',
        targetAudience: { students: true, specificSemesters: [7, 8] },
        createdBy: users.find(u => u.role === 'admin')._id,
        status: 'published'
      },
      {
        title: 'Holiday Notice - Diwali Break',
        content: 'The college will remain closed from November 10-15, 2024 for Diwali celebrations. Regular classes will resume from November 16th. Hostel students planning to go home should inform the warden.',
        type: 'holiday',
        priority: 'medium',
        targetAudience: { students: true, faculty: true },
        createdBy: users.find(u => u.role === 'admin')._id,
        status: 'published'
      }
    ];
    
    await Notice.create(noticeData);
    console.log(`📢 Created ${noticeData.length} notices`);

    console.log('✅ Comprehensive database seeding completed successfully!');
    console.log(`\n📊 Final Summary:`);
    console.log(`   Total Users: ${users.length} (${facultyUsers.length} Faculty, ${studentUsers.length} Students, 2 Admins)`);
    console.log(`   Faculty Profiles: ${faculty.length} with diverse subjects`);
    console.log(`   Student Profiles: ${students.length} across 4 sections`);
    console.log(`   Attendance Records: ${attendanceData.length} over 45 days`);
    console.log(`   Fee Records: 0 (skipped due to schema constraints)`);
    console.log(`   Notices: ${noticeData.length} covering all major categories`);

    console.log('\n🔑 Sample Login Credentials:');
    console.log('Student (High performer): student001 / Password123');
    console.log('Student (Average performer): student015 / Password123');
    console.log('Faculty (CS Professor): prof.smith / Password123');
    console.log('Faculty (ML Specialist): prof.garcia / Password123');
    console.log('Admin: admin / Admin123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};

module.exports = { seedDatabase };