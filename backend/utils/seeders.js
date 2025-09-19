const mongoose = require('mongoose');
const { User, Student, Faculty, Subject, AcademicDetails, Attendance, Fee, Notice, Helpdesk } = require('../models');

// Comprehensive fake data - 12 Faculty + 30 Students + 2 Admins
const sampleUsers = [
  // Faculty Members (12 unique professors)
  { username: 'prof.agarwal', email: 'agarwal@college.edu', password: 'Password123', firstName: 'Amit', lastName: 'Agarwal', role: 'faculty', phone: '+1234567890' },
{ username: 'prof.desai', email: 'desai@college.edu', password: 'Password123', firstName: 'Nisha', lastName: 'Desai', role: 'faculty', phone: '+1234567891' },
{ username: 'prof.kulkarni', email: 'kulkarni@college.edu', password: 'Password123', firstName: 'Sanjay', lastName: 'Kulkarni', role: 'faculty', phone: '+1234567892' },
{ username: 'prof.menon', email: 'menon@college.edu', password: 'Password123', firstName: 'Rekha', lastName: 'Menon', role: 'faculty', phone: '+1234567893' },
{ username: 'prof.banerjee', email: 'banerjee@college.edu', password: 'Password123', firstName: 'Debashish', lastName: 'Banerjee', role: 'faculty', phone: '+1234567894' },
{ username: 'prof.kapoor', email: 'kapoor@college.edu', password: 'Password123', firstName: 'Sunita', lastName: 'Kapoor', role: 'faculty', phone: '+1234567895' },
{ username: 'prof.raman', email: 'raman@college.edu', password: 'Password123', firstName: 'Harish', lastName: 'Raman', role: 'faculty', phone: '+1234567896' },
{ username: 'prof.bhatt', email: 'bhatt@college.edu', password: 'Password123', firstName: 'Deepa', lastName: 'Bhatt', role: 'faculty', phone: '+1234567897' },
{ username: 'prof.chawla', email: 'chawla@college.edu', password: 'Password123', firstName: 'Naveen', lastName: 'Chawla', role: 'faculty', phone: '+1234567898' },
{ username: 'prof.pillai', email: 'pillai@college.edu', password: 'Password123', firstName: 'Shalini', lastName: 'Pillai', role: 'faculty', phone: '+1234567899' },
{ username: 'prof.rathore', email: 'rathore@college.edu', password: 'Password123', firstName: 'Prakash', lastName: 'Rathore', role: 'faculty', phone: '+1234567810' },
{ username: 'prof.chatterjee', email: 'chatterjee@college.edu', password: 'Password123', firstName: 'Madhuri', lastName: 'Chatterjee', role: 'faculty', phone: '+1234567811' },

  
  // Students (30 diverse students)
 { username: 'student001', email: 'student001@college.edu', password: 'Password123', firstName: 'Aarav', lastName: 'Sharma', role: 'student', phone: '+1234567820' },
{ username: 'student002', email: 'student002@college.edu', password: 'Password123', firstName: 'Ishita', lastName: 'Verma', role: 'student', phone: '+1234567821' },
{ username: 'student003', email: 'student003@college.edu', password: 'Password123', firstName: 'Rohan', lastName: 'Singh', role: 'student', phone: '+1234567822' },
{ username: 'student004', email: 'student004@college.edu', password: 'Password123', firstName: 'Priya', lastName: 'Patel', role: 'student', phone: '+1234567823' },
{ username: 'student005', email: 'student005@college.edu', password: 'Password123', firstName: 'Aditya', lastName: 'Reddy', role: 'student', phone: '+1234567824' },
{ username: 'student006', email: 'student006@college.edu', password: 'Password123', firstName: 'Kavya', lastName: 'Nair', role: 'student', phone: '+1234567825' },
{ username: 'student007', email: 'student007@college.edu', password: 'Password123', firstName: 'Arjun', lastName: 'Mehta', role: 'student', phone: '+1234567826' },
{ username: 'student008', email: 'student008@college.edu', password: 'Password123', firstName: 'Ananya', lastName: 'Chopra', role: 'student', phone: '+1234567827' },
{ username: 'student009', email: 'student009@college.edu', password: 'Password123', firstName: 'Vivaan', lastName: 'Gupta', role: 'student', phone: '+1234567828' },
{ username: 'student010', email: 'student010@college.edu', password: 'Password123', firstName: 'Sneha', lastName: 'Bansal', role: 'student', phone: '+1234567829' },
{ username: 'student011', email: 'student011@college.edu', password: 'Password123', firstName: 'Manav', lastName: 'Jain', role: 'student', phone: '+1234567830' },
{ username: 'student012', email: 'student012@college.edu', password: 'Password123', firstName: 'Riya', lastName: 'Kapoor', role: 'student', phone: '+1234567831' },
{ username: 'student013', email: 'student013@college.edu', password: 'Password123', firstName: 'Krishna', lastName: 'Desai', role: 'student', phone: '+1234567832' },
{ username: 'student014', email: 'student014@college.edu', password: 'Password123', firstName: 'Meera', lastName: 'Bhatt', role: 'student', phone: '+1234567833' },
{ username: 'student015', email: 'student015@college.edu', password: 'Password123', firstName: 'Kabir', lastName: 'Joshi', role: 'student', phone: '+1234567834' },
{ username: 'student016', email: 'student016@college.edu', password: 'Password123', firstName: 'Tanya', lastName: 'Mishra', role: 'student', phone: '+1234567835' },
{ username: 'student017', email: 'student017@college.edu', password: 'Password123', firstName: 'Siddharth', lastName: 'Agarwal', role: 'student', phone: '+1234567836' },
{ username: 'student018', email: 'student018@college.edu', password: 'Password123', firstName: 'Pooja', lastName: 'Srivastava', role: 'student', phone: '+1234567837' },
{ username: 'student019', email: 'student019@college.edu', password: 'Password123', firstName: 'Aryan', lastName: 'Banerjee', role: 'student', phone: '+1234567838' },
{ username: 'student020', email: 'student020@college.edu', password: 'Password123', firstName: 'Diya', lastName: 'Ghosh', role: 'student', phone: '+1234567839' },
{ username: 'student021', email: 'student021@college.edu', password: 'Password123', firstName: 'Yash', lastName: 'Malhotra', role: 'student', phone: '+1234567840' },
{ username: 'student022', email: 'student022@college.edu', password: 'Password123', firstName: 'Aditi', lastName: 'Chatterjee', role: 'student', phone: '+1234567841' },
{ username: 'student023', email: 'student023@college.edu', password: 'Password123', firstName: 'Kunal', lastName: 'Pillai', role: 'student', phone: '+1234567842' },
{ username: 'student024', email: 'student024@college.edu', password: 'Password123', firstName: 'Neha', lastName: 'Rajput', role: 'student', phone: '+1234567843' },
{ username: 'student025', email: 'student025@college.edu', password: 'Password123', firstName: 'Rajat', lastName: 'Saxena', role: 'student', phone: '+1234567844' },
{ username: 'student026', email: 'student026@college.edu', password: 'Password123', firstName: 'Shreya', lastName: 'Kulkarni', role: 'student', phone: '+1234567845' },
{ username: 'student027', email: 'student027@college.edu', password: 'Password123', firstName: 'Dev', lastName: 'Iyer', role: 'student', phone: '+1234567846' },
{ username: 'student028', email: 'student028@college.edu', password: 'Password123', firstName: 'Nisha', lastName: 'Menon', role: 'student', phone: '+1234567847' },
{ username: 'student029', email: 'student029@college.edu', password: 'Password123', firstName: 'Parth', lastName: 'Rana', role: 'student', phone: '+1234567848' },
{ username: 'student030', email: 'student030@college.edu', password: 'Password123', firstName: 'Simran', lastName: 'Gill', role: 'student', phone: '+1234567849' },
 
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
    await Subject.deleteMany({});
    await AcademicDetails.deleteMany({});
    await Attendance.deleteMany({});
    await Fee.deleteMany({});
    await Notice.deleteMany({});
    await Helpdesk.deleteMany({});

    // Create users
    const users = await User.create(sampleUsers);
    console.log(`👥 Created ${users.length} users`);

    const facultyUsers = users.filter(u => u.role === 'faculty');
    const studentUsers = users.filter(u => u.role === 'student');

    // Create comprehensive subjects for all semesters
    console.log('📚 Creating subject records...');
    const subjectsData = [
      // Semester 1
      { subject_id: 'SUB001', subject_code: 'CS101', subject_name: 'Programming Fundamentals', department: 'Computer Science', credits: 4, semester: 1, subject_type: 'Core', theory_hours: 3, practical_hours: 2, total_hours: 5, description: 'Introduction to programming concepts and C programming language' },
      { subject_id: 'SUB002', subject_code: 'MATH101', subject_name: 'Engineering Mathematics I', department: 'Mathematics', credits: 4, semester: 1, subject_type: 'Core', theory_hours: 4, practical_hours: 0, total_hours: 4, description: 'Differential calculus, integral calculus, and series' },
      { subject_id: 'SUB003', subject_code: 'PHY101', subject_name: 'Engineering Physics', department: 'Physics', credits: 3, semester: 1, subject_type: 'Core', theory_hours: 2, practical_hours: 2, total_hours: 4, description: 'Basic physics concepts for engineering students' },
      { subject_id: 'SUB004', subject_code: 'ENG101', subject_name: 'English Communication', department: 'English', credits: 2, semester: 1, subject_type: 'Core', theory_hours: 2, practical_hours: 0, total_hours: 2, description: 'English language and communication skills' },
      { subject_id: 'SUB005', subject_code: 'CS102', subject_name: 'Digital Logic Design', department: 'Computer Science', credits: 3, semester: 1, subject_type: 'Core', theory_hours: 2, practical_hours: 2, total_hours: 4, description: 'Boolean algebra, logic gates, and digital circuits' },
      { subject_id: 'SUB006', subject_code: 'CHEM101', subject_name: 'Engineering Chemistry', department: 'Chemistry', credits: 3, semester: 1, subject_type: 'Core', theory_hours: 2, practical_hours: 2, total_hours: 4, description: 'Chemical bonding, thermodynamics, and electrochemistry' },
      
      // Semester 2
      { subject_id: 'SUB007', subject_code: 'CS201', subject_name: 'Java Programming', department: 'Computer Science', credits: 4, semester: 2, subject_type: 'Core', theory_hours: 3, practical_hours: 2, total_hours: 5, description: 'Object-oriented programming using Java' },
      { subject_id: 'SUB008', subject_code: 'MATH201', subject_name: 'Engineering Mathematics II', department: 'Mathematics', credits: 4, semester: 2, subject_type: 'Core', theory_hours: 4, practical_hours: 0, total_hours: 4, description: 'Differential equations, Laplace transforms, and Fourier series' },
      { subject_id: 'SUB009', subject_code: 'CS202', subject_name: 'Computer Organization', department: 'Computer Science', credits: 3, semester: 2, subject_type: 'Core', theory_hours: 3, practical_hours: 0, total_hours: 3, description: 'Computer architecture and organization concepts' },
      { subject_id: 'SUB010', subject_code: 'EE201', subject_name: 'Basic Electrical Engineering', department: 'Electrical', credits: 3, semester: 2, subject_type: 'Core', theory_hours: 2, practical_hours: 2, total_hours: 4, description: 'DC circuits, AC circuits, and electrical machines' },
      { subject_id: 'SUB011', subject_code: 'MATH202', subject_name: 'Discrete Mathematics', department: 'Mathematics', credits: 3, semester: 2, subject_type: 'Core', theory_hours: 3, practical_hours: 0, total_hours: 3, description: 'Set theory, relations, functions, and graph theory' },
      { subject_id: 'SUB012', subject_code: 'ENG201', subject_name: 'Technical Writing', department: 'English', credits: 2, semester: 2, subject_type: 'Core', theory_hours: 2, practical_hours: 0, total_hours: 2, description: 'Technical documentation and report writing' },
      
      // Semester 3
      { subject_id: 'SUB013', subject_code: 'CS301', subject_name: 'Data Structures', department: 'Computer Science', credits: 4, semester: 3, subject_type: 'Core', theory_hours: 3, practical_hours: 2, total_hours: 5, description: 'Linear and non-linear data structures and algorithms' },
      { subject_id: 'SUB014', subject_code: 'CS302', subject_name: 'Database Management Systems', department: 'Computer Science', credits: 4, semester: 3, subject_type: 'Core', theory_hours: 3, practical_hours: 2, total_hours: 5, description: 'Database design, SQL, and database administration' },
      { subject_id: 'SUB015', subject_code: 'CS303', subject_name: 'Computer Networks', department: 'Computer Science', credits: 3, semester: 3, subject_type: 'Core', theory_hours: 3, practical_hours: 0, total_hours: 3, description: 'Network protocols, OSI model, and TCP/IP' },
      { subject_id: 'SUB016', subject_code: 'MATH301', subject_name: 'Mathematics', department: 'Mathematics', credits: 3, semester: 3, subject_type: 'Core', theory_hours: 3, practical_hours: 0, total_hours: 3, description: 'Advanced mathematics for computer science' },
      { subject_id: 'SUB017', subject_code: 'CS304', subject_name: 'Operating Systems', department: 'Computer Science', credits: 3, semester: 3, subject_type: 'Core', theory_hours: 3, practical_hours: 0, total_hours: 3, description: 'Process management, memory management, and file systems' },
      { subject_id: 'SUB018', subject_code: 'CS305', subject_name: 'Web Development Lab', department: 'Computer Science', credits: 2, semester: 3, subject_type: 'Lab', theory_hours: 0, practical_hours: 4, total_hours: 4, description: 'HTML, CSS, JavaScript, and web frameworks' },
      
      // Semester 4
      { subject_id: 'SUB019', subject_code: 'CS401', subject_name: 'Algorithm Analysis', department: 'Computer Science', credits: 4, semester: 4, subject_type: 'Core', theory_hours: 3, practical_hours: 2, total_hours: 5, description: 'Algorithm design and complexity analysis' },
      { subject_id: 'SUB020', subject_code: 'CS402', subject_name: 'Software Engineering', department: 'Computer Science', credits: 3, semester: 4, subject_type: 'Core', theory_hours: 3, practical_hours: 0, total_hours: 3, description: 'Software development life cycle and project management' },
      { subject_id: 'SUB021', subject_code: 'CS403', subject_name: 'Theory of Computation', department: 'Computer Science', credits: 3, semester: 4, subject_type: 'Core', theory_hours: 3, practical_hours: 0, total_hours: 3, description: 'Automata theory, formal languages, and computability' },
      { subject_id: 'SUB022', subject_code: 'CS404', subject_name: 'Computer Graphics', department: 'Computer Science', credits: 3, semester: 4, subject_type: 'Elective', theory_hours: 2, practical_hours: 2, total_hours: 4, description: '2D and 3D graphics, rendering, and animation' },
      { subject_id: 'SUB023', subject_code: 'MGMT401', subject_name: 'Engineering Economics', department: 'Management', credits: 2, semester: 4, subject_type: 'Core', theory_hours: 2, practical_hours: 0, total_hours: 2, description: 'Economic analysis for engineering decisions' },
      { subject_id: 'SUB024', subject_code: 'CS405', subject_name: 'Mobile App Development', department: 'Computer Science', credits: 3, semester: 4, subject_type: 'Elective', theory_hours: 2, practical_hours: 2, total_hours: 4, description: 'Android and iOS app development' },
      
      // Semester 5 (Current)
      { subject_id: 'SUB025', subject_code: 'CS501', subject_name: 'Machine Learning', department: 'Computer Science', credits: 4, semester: 5, subject_type: 'Core', theory_hours: 3, practical_hours: 2, total_hours: 5, description: 'Supervised and unsupervised learning algorithms' },
      { subject_id: 'SUB026', subject_code: 'CS502', subject_name: 'Compiler Design', department: 'Computer Science', credits: 3, semester: 5, subject_type: 'Core', theory_hours: 3, practical_hours: 0, total_hours: 3, description: 'Lexical analysis, parsing, and code generation' },
      { subject_id: 'SUB027', subject_code: 'CS503', subject_name: 'Distributed Systems', department: 'Computer Science', credits: 3, semester: 5, subject_type: 'Core', theory_hours: 3, practical_hours: 0, total_hours: 3, description: 'Distributed computing, consistency, and fault tolerance' },
      { subject_id: 'SUB028', subject_code: 'CS504', subject_name: 'Information Security', department: 'Computer Science', credits: 3, semester: 5, subject_type: 'Elective', theory_hours: 2, practical_hours: 2, total_hours: 4, description: 'Cryptography, network security, and ethical hacking' },
      { subject_id: 'SUB029', subject_code: 'CS505', subject_name: 'Data Mining', department: 'Computer Science', credits: 3, semester: 5, subject_type: 'Elective', theory_hours: 2, practical_hours: 2, total_hours: 4, description: 'Data preprocessing, pattern mining, and classification' },
      { subject_id: 'SUB030', subject_code: 'MGMT501', subject_name: 'Project Management', department: 'Management', credits: 2, semester: 5, subject_type: 'Core', theory_hours: 2, practical_hours: 0, total_hours: 2, description: 'Project planning, execution, and control' }
    ];
    
    const subjects = await Subject.create(subjectsData);
    console.log(`📚 Created ${subjects.length} subject records`);
    
    // Create subject mapping for easy reference
    const subjectMap = {};
    subjects.forEach(subject => {
      subjectMap[subject.subject_code] = subject;
    });

    // Create faculty profiles with subjects assignment
    const facultyData = facultyUsers.map((user, index) => {
      // Assign subjects to faculty based on their expertise
      const facultySubjects = [];
      const allSubjects = Object.values(subjectMap);
      
      // Each faculty gets 2-3 subjects from their department
      const csSubjects = allSubjects.filter(s => s.department === 'Computer Science');
      const mathSubjects = allSubjects.filter(s => s.department === 'Mathematics');
      const otherSubjects = allSubjects.filter(s => !['Computer Science', 'Mathematics'].includes(s.department));
      
      if (index < 8) {
        // CS faculty
        const startIndex = Math.floor(index * csSubjects.length / 8);
        facultySubjects.push(...csSubjects.slice(startIndex, startIndex + 3));
      } else if (index < 10) {
        // Math faculty
        facultySubjects.push(...mathSubjects.slice((index - 8) * 2, (index - 8) * 2 + 2));
      } else {
        // Other departments
        facultySubjects.push(...otherSubjects.slice((index - 10) * 2, (index - 10) * 2 + 2));
      }
      
      const departments = ['Computer Science', 'Mathematics', 'Physics', 'English', 'Management', 'Chemistry', 'Electrical'];
      const designations = ['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer'];
      
      return {
        user: user._id,
        employeeId: `FAC${String(index + 1).padStart(3, '0')}`,
        department: departments[index % departments.length],
        designation: designations[index % designations.length],
        qualification: index < 8 ? 'Ph.D.' : 'M.Tech/M.A.',
        experience: Math.floor(Math.random() * 20) + 5,
        dateOfJoining: new Date(2010 + Math.floor(Math.random() * 14), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        dateOfBirth: new Date(1970 + Math.floor(Math.random() * 25), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        gender: index % 2 === 0 ? 'male' : 'female',
        subjects: facultySubjects.slice(0, 3).map(subject => ({
          subjectCode: subject.subject_code,
          subjectName: subject.subject_name,
          credits: subject.credits,
          semester: subject.semester,
          course: 'Computer Science',
          classSchedule: [{
            day: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'][index % 5],
            startTime: `${9 + (index % 6)}:00`,
            endTime: `${10 + (index % 6)}:00`,
            roomNumber: `Room-${101 + index}`,
            classType: subject.subject_type === 'Lab' ? 'Practical' : 'Lecture'
          }]
        }))
      };
    });

    const faculty = await Faculty.create(facultyData);
    console.log(`👨‍🏫 Created ${faculty.length} faculty profiles`);

    // Create student profiles with new schema structure
    const studentData = studentUsers.map((user, index) => {
      const studentNumber = String(index + 1).padStart(3, '0');
      const sections = ['A', 'B', 'C', 'D'];
      const branches = ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical'];
      const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
      const mentors = ['Dr. Amit Sharma', 'Dr. Priya Gupta', 'Dr. Rajesh Kumar', 'Dr. Sunita Singh'];
      
      return {
        student_id: `STU2023${studentNumber}`,
        name: `${user.firstName} ${user.lastName}`,
        father_name: `Mr. ${user.lastName} Sr.`,
        roll_no: `CS23${studentNumber}`,
        branch: branches[index % branches.length],
        semester: 5,
        section: sections[index % sections.length],
        email: user.email,
        phone_no: user.phone,
        father_phone: `+91${String(9000000000 + index).slice(-10)}`,
        address: `${index + 1}, Model Town, City-${Math.floor(index/5) + 1}, State, India - ${110000 + index}`,
        date_of_birth: new Date(2002 + (index % 3), (index % 12), (index % 28) + 1),
        blood_group: bloodGroups[index % bloodGroups.length],
        batch: '2023-2027',
        mentor_name: mentors[index % mentors.length],
        join_date: new Date('2023-08-15')
      };
    });

    const students = await Student.create(studentData);
    console.log(`👨‍🎓 Created ${students.length} student profiles`);

    // Create academic details for students with subject references
    console.log('📚 Generating academic details...');
    const academicDetailsData = [];
    
    for (let i = 0; i < students.length; i++) {
      const student = students[i];
      
      // Generate academic records for completed semesters (1-4)
      for (let semester = 1; semester <= 4; semester++) {
        // Get subjects for this semester
        const semesterSubjects = subjects.filter(s => s.semester === semester);
        
        for (let j = 0; j < semesterSubjects.length; j++) {
          const subject = semesterSubjects[j];
          
          // Generate realistic marks based on assessment pattern
          const internalMarks = 15 + Math.floor(Math.random() * 25); // 15-40 (out of 40)
          const externalMarks = 25 + Math.floor(Math.random() * 35); // 25-60 (out of 60)
          const practicalMarks = subject.subject_type === 'Lab' ? 0 : 0; // Labs handled separately
          const totalMarks = Math.min(100, internalMarks + externalMarks + practicalMarks);
          
          // Calculate grade and grade point
          let grade, gradePoint;
          if (totalMarks >= 90) {
            grade = 'A+';
            gradePoint = 10;
          } else if (totalMarks >= 80) {
            grade = 'A';
            gradePoint = 9;
          } else if (totalMarks >= 70) {
            grade = 'B+';
            gradePoint = 8;
          } else if (totalMarks >= 60) {
            grade = 'B';
            gradePoint = 7;
          } else if (totalMarks >= 50) {
            grade = 'C+';
            gradePoint = 6;
          } else if (totalMarks >= 40) {
            grade = 'C';
            gradePoint = 5;
          } else if (totalMarks >= 35) {
            grade = 'D';
            gradePoint = 4;
          } else {
            grade = 'F';
            gradePoint = 0;
          }
          
          academicDetailsData.push({
            academic_id: `ACD${student.student_id}S${semester}${subject.subject_code}`,
            student_id: student._id,
            subject_id: subject._id,
            semester_no: semester,
            academic_year: semester <= 2 ? '2023-2024' : '2024-2025',
            internal_marks: internalMarks,
            external_marks: externalMarks,
            practical_marks: practicalMarks,
            total_marks: totalMarks,
            grade: grade,
            grade_point: gradePoint,
            credits_earned: totalMarks >= 40 ? subject.credits : 0,
            exam_type: 'Regular',
            exam_date: new Date(2023 + Math.floor((semester-1)/2), ((semester-1) % 2) * 6 + 5, 15),
            result_status: totalMarks >= 40 ? 'Pass' : 'Fail'
          });
        }
      }
    }
    
    await AcademicDetails.create(academicDetailsData);
    console.log(`📚 Created ${academicDetailsData.length} academic detail records`);

    // Generate attendance data with subject references and detailed records
    console.log('📋 Generating attendance records...');
    const attendanceData = [];
    
    // Define the 6 specific subjects for attendance tracking
    const attendanceSubjects = [
      { code: 'MATH301', name: 'Mathematics' },
      { code: 'CS301', name: 'Data Structures' },
      { code: 'CS201', name: 'Java Programming' },
      { code: 'PHY101', name: 'Physics' },
      { code: 'CS302', name: 'Database Management' },
      { code: 'CS303', name: 'Computer Networks' }
    ];
    
    // Find the actual subject documents for these codes
    const subjectsForAttendance = [];
    for (const subjectInfo of attendanceSubjects) {
      const subject = subjects.find(s => s.subject_code === subjectInfo.code);
      if (subject) {
        subjectsForAttendance.push(subject);
      } else {
        // If subject doesn't exist, create a placeholder (shouldn't happen with our data)
        console.log(`⚠️ Subject ${subjectInfo.code} not found, using placeholder`);
        subjectsForAttendance.push({
          _id: new mongoose.Types.ObjectId(),
          subject_code: subjectInfo.code,
          subject_name: subjectInfo.name,
          subject_type: 'Core'
        });
      }
    }
    
    for (let i = 0; i < students.length; i++) {
      const student = students[i];
      
      // Generate attendance for ALL 6 specified subjects for EVERY student
      for (let j = 0; j < subjectsForAttendance.length; j++) {
        const subject = subjectsForAttendance[j];
        
        // Find faculty teaching this subject
        const subjectFaculty = faculty.find(f => 
          f.subjects.some(s => s.subjectCode === subject.subject_code)
        ) || faculty[j % faculty.length];
        
        // Generate realistic attendance data
        const totalWeeks = 16; // Semester duration
        const classesPerWeek = subject.subject_type === 'Lab' ? 2 : 3;
        const totalClasses = totalWeeks * classesPerWeek;
        
        // Generate attendance records for each class
        const attendanceRecords = [];
        let presentCount = 0, absentCount = 0, lateCount = 0, excusedCount = 0;
        
        for (let week = 1; week <= totalWeeks; week++) {
          for (let classNum = 1; classNum <= classesPerWeek; classNum++) {
            const classDate = new Date(2024, 8, (week - 1) * 7 + classNum); // Starting from September
            
            // Skip weekends
            if (classDate.getDay() === 0 || classDate.getDay() === 6) continue;
            
            // Determine attendance status based on student performance pattern
            // Different students have different attendance patterns
            const studentPerformance = (i % 4) + 1; // 1-4 performance levels
            let baseAttendanceRate;
            
            switch (studentPerformance) {
              case 1: baseAttendanceRate = 0.95; break; // Excellent students
              case 2: baseAttendanceRate = 0.85; break; // Good students
              case 3: baseAttendanceRate = 0.75; break; // Average students
              case 4: baseAttendanceRate = 0.65; break; // Below average students
            }
            
            // Subject difficulty factor (some subjects have lower attendance)
            const subjectFactor = subject.subject_code.includes('MATH') ? 0.9 : 
                                subject.subject_code.includes('PHY') ? 0.85 : 1.0;
            
            const finalRate = baseAttendanceRate * subjectFactor;
            let status = 'Present';
            
            const randomVal = Math.random();
            if (randomVal > finalRate) {
              if (randomVal > finalRate + 0.15) {
                status = 'Absent';
                absentCount++;
              } else if (randomVal > finalRate + 0.08) {
                status = 'Late';
                lateCount++;
              } else {
                status = 'Excused';
                excusedCount++;
              }
            } else {
              status = 'Present';
              presentCount++;
            }
            
            attendanceRecords.push({
              date: classDate,
              status: status,
              class_type: subject.subject_type === 'Lab' ? 'Practical' : 'Theory',
              period: classNum,
              time_slot: {
                start_time: `${9 + classNum}:00`,
                end_time: `${10 + classNum}:00`
              },
              room_number: `Room-${101 + j}`,
              marked_by: subjectFaculty._id,
              marked_at: new Date(classDate.getTime() + (classNum * 60 + 10) * 60000),
              remarks: status === 'Late' ? 'Arrived 10 minutes late' : 
                      status === 'Excused' ? 'Medical leave' : 
                      status === 'Absent' ? 'Unexcused absence' : ''
            });
          }
        }
        
        attendanceData.push({
          attendance_id: `ATT${student.student_id}${subject.subject_code}`,
          student_id: student._id,
          subject_id: subject._id,
          faculty_id: subjectFaculty._id,
          semester_no: 5, // Current semester
          academic_year: '2024-2025',
          total_classes: presentCount + absentCount + lateCount + excusedCount,
          present_classes: presentCount,
          absent_classes: absentCount,
          late_classes: lateCount,
          excused_classes: excusedCount,
          attendance_records: attendanceRecords
        });
      }
    }
    
    await Attendance.create(attendanceData);
    console.log(`📋 Created ${attendanceData.length} attendance records`);
    console.log(`   ✓ Each of the ${students.length} students has attendance for all 6 subjects:`);
    console.log(`   ✓ Mathematics, Data Structures, Java Programming, Physics, Database Management, Computer Networks`);

    // Create fee management records
    console.log('💰 Generating fee management records...');
    const feeData = [];
    
    for (let i = 0; i < students.length; i++) {
      const student = students[i];
      
      // Generate fee records for semesters 1-5
      for (let semester = 1; semester <= 5; semester++) {
        const tuitionFee = 50000;
        const hostelFee = (i % 3 === 0) ? 25000 : 0; // 1/3 students in hostel
        const miscCharges = 5000;
        const totalAmount = tuitionFee + hostelFee + miscCharges;
        
        // Payment status logic
        let status, paidAmount, pendingAmount, transactionId, payDate;
        
        if (semester <= 3) {
          // Older semesters mostly paid
          status = 'Paid';
          paidAmount = totalAmount;
          pendingAmount = 0;
          transactionId = `TXN${student.student_id}S${semester}${Date.now().toString().slice(-6)}`;
          payDate = new Date(2023 + Math.floor((semester-1)/2), ((semester-1) % 2) * 6, 15);
        } else if (semester === 4) {
          // Semester 4 - mixed payment status
          if (i % 2 === 0) {
            status = 'Paid';
            paidAmount = totalAmount;
            pendingAmount = 0;
            transactionId = `TXN${student.student_id}S${semester}${Date.now().toString().slice(-6)}`;
            payDate = new Date(2024, 5, 15);
          } else {
            status = 'Pending';
            paidAmount = Math.floor(totalAmount * 0.6);
            pendingAmount = totalAmount - paidAmount;
            transactionId = paidAmount > 0 ? `TXN${student.student_id}S${semester}${Date.now().toString().slice(-6)}` : null;
            payDate = paidAmount > 0 ? new Date(2024, 5, 15) : null;
          }
        } else {
          // Current semester (5) - mostly pending
          if (i % 4 === 0) {
            status = 'Paid';
            paidAmount = totalAmount;
            pendingAmount = 0;
            transactionId = `TXN${student.student_id}S${semester}${Date.now().toString().slice(-6)}`;
            payDate = new Date(2024, 11, 10);
          } else {
            status = 'Pending';
            paidAmount = i % 3 === 0 ? Math.floor(totalAmount * 0.5) : 0;
            pendingAmount = totalAmount - paidAmount;
            transactionId = paidAmount > 0 ? `TXN${student.student_id}S${semester}${Date.now().toString().slice(-6)}` : null;
            payDate = paidAmount > 0 ? new Date(2024, 11, 10) : null;
          }
        }
        
        feeData.push({
          fee_id: `FEE${student.student_id}S${semester}`,
          student_id: student._id,
          semester_no: semester,
          tuition_fee: tuitionFee,
          hostel_fee: hostelFee,
          misc_charges: miscCharges,
          total_amount: totalAmount,
          due_date: new Date(2023 + Math.floor((semester-1)/2), ((semester-1) % 2) * 6 + 5, 30),
          status: status,
          transaction_id: transactionId,
          pay_date: payDate,
          pending_amount: pendingAmount,
          paid_amount: paidAmount
        });
      }
    }
    
    await Fee.create(feeData);
    console.log(`💰 Created ${feeData.length} fee management records`);

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
    console.log(`   Subjects: ${subjects.length} across 5 semesters`);
    console.log(`   Faculty Profiles: ${faculty.length} with subject assignments`);
    console.log(`   Student Profiles: ${students.length} across 4 sections`);
    console.log(`   Academic Details: ${academicDetailsData.length} subject-wise records across 4 semesters`);
    console.log(`   Attendance Records: ${attendanceData.length} detailed subject-wise tracking`);
    console.log(`   → Each student: 6 subjects (Mathematics, Data Structures, Java, Physics, Database Management, Computer Networks)`);
    console.log(`   → Total: ${students.length} students × 6 subjects = ${students.length * 6} attendance records`);
    console.log(`   Fee Records: ${feeData.length} across 5 semesters`);
    console.log(`   Notices: ${noticeData.length} covering all major categories`);

    console.log('\n🔑 Sample Login Credentials:');
    console.log('Student (High performer): student001 / Password123');
    console.log('Student (Average performer): student015 / Password123');
    console.log('Faculty (CS Professor): prof.agarwal / Password123');
    console.log('Faculty (IT Specialist): prof.desai / Password123');
    console.log('Admin: admin / Admin123');
    
    console.log('\n📚 New Schema Features:');
    console.log('   ✓ Subject-wise academic tracking');
    console.log('   ✓ Detailed attendance records with daily tracking');
    console.log('   ✓ Enhanced academic details with assessment breakdown');
    console.log('   ✓ Faculty-subject assignments');
    console.log('   ✓ Comprehensive academic year and semester tracking');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};

module.exports = { seedDatabase };