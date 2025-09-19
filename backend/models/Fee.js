const mongoose = require('mongoose');

const FeeManagementSchema = new mongoose.Schema({
  fee_id: {
    type: String,
    required: [true, 'Fee ID is required'],
    unique: true,
    trim: true
  },
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'Student reference is required']
  },
  semester_no: {
    type: Number,
    required: [true, 'Semester number is required'],
    min: [1, 'Semester must be at least 1'],
    max: [8, 'Semester cannot exceed 8']
  },
  tuition_fee: {
    type: Number,
    required: [true, 'Tuition fee is required'],
    min: [0, 'Tuition fee cannot be negative']
  },
  hostel_fee: {
    type: Number,
    default: 0,
    min: [0, 'Hostel fee cannot be negative']
  },
  misc_charges: {
    type: Number,
    default: 0,
    min: [0, 'Miscellaneous charges cannot be negative']
  },
  total_amount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Total amount cannot be negative']
  },
  due_date: {
    type: Date,
    required: [true, 'Due date is required']
  },
  status: {
    type: String,
    enum: ['Paid', 'Pending'],
    default: 'Pending',
    required: [true, 'Status is required']
  },
  transaction_id: {
    type: String,
    trim: true,
    sparse: true // Allows null values but ensures uniqueness when present
  },
  pay_date: {
    type: Date
  },
  pending_amount: {
    type: Number,
    default: 0,
    min: [0, 'Pending amount cannot be negative']
  },
  paid_amount: {
    type: Number,
    default: 0,
    min: [0, 'Paid amount cannot be negative']
  }
}, {
  timestamps: true
});

// Compound indexes for better performance
FeeManagementSchema.index({ student_id: 1, semester_no: 1 }, { unique: true });
FeeManagementSchema.index({ status: 1, due_date: 1 });
FeeManagementSchema.index({ fee_id: 1 });
FeeManagementSchema.index({ transaction_id: 1 }, { sparse: true });

// Pre-save middleware to calculate amounts
FeeManagementSchema.pre('save', function(next) {
  // Calculate total amount from fee components
  this.total_amount = this.tuition_fee + this.hostel_fee + this.misc_charges;
  
  // Calculate pending amount
  this.pending_amount = this.total_amount - this.paid_amount;
  
  // Update status based on payment
  if (this.pending_amount <= 0) {
    this.status = 'Paid';
  } else {
    this.status = 'Pending';
  }
  
  next();
});

// Virtual for payment progress percentage
FeeManagementSchema.virtual('payment_progress').get(function() {
  if (this.total_amount === 0) return 100;
  return Math.round((this.paid_amount / this.total_amount) * 100);
});

// Virtual to check if payment is overdue
FeeManagementSchema.virtual('is_overdue').get(function() {
  return new Date() > this.due_date && this.status !== 'Paid';
});

// Static method to get fee summary for a student
FeeManagementSchema.statics.getStudentFeeSummary = async function(studentId) {
  const pipeline = [
    { $match: { student_id: new mongoose.Types.ObjectId(studentId) } },
    {
      $group: {
        _id: null,
        totalFees: { $sum: '$total_amount' },
        totalPaid: { $sum: '$paid_amount' },
        totalPending: { $sum: '$pending_amount' },
        paidSemesters: {
          $sum: {
            $cond: [{ $eq: ['$status', 'Paid'] }, 1, 0]
          }
        },
        pendingSemesters: {
          $sum: {
            $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0]
          }
        }
      }
    }
  ];

  const result = await this.aggregate(pipeline);
  return result[0] || {
    totalFees: 0,
    totalPaid: 0,
    totalPending: 0,
    paidSemesters: 0,
    pendingSemesters: 0
  };
};

// Method to make payment
FeeManagementSchema.methods.makePayment = function(amount, transactionId = null, paymentDate = new Date()) {
  this.paid_amount += amount;
  this.transaction_id = transactionId;
  this.pay_date = paymentDate;
  return this.save();
};

module.exports = mongoose.model('FeeManagement', FeeManagementSchema);