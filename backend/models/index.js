// Export all models
const User = require('./User');
const Student = require('./Student');
const Faculty = require('./Faculty');
const Subject = require('./Subject');
const AcademicDetails = require('./AcademicDetails');
const Attendance = require('./Attendance');
const Fee = require('./Fee');
const Notice = require('./Notice');
const Helpdesk = require('./Helpdesk');

module.exports = {
  User,
  Student,
  Faculty,
  Subject,
  AcademicDetails,
  Attendance,
  Fee,
  Notice,
  Helpdesk
};