const mongoose = require('mongoose');

const FeeSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'Student reference is required']
  },
  semester: {
    type: Number,
    required: [true, 'Semester is required'],
    min: [1, 'Semester must be at least 1'],
    max: [8, 'Semester cannot exceed 8']
  },
  academicYear: {
    type: String,
    required: [true, 'Academic year is required'],
    match: [/^\d{4}-\d{4}$/, 'Academic year format should be YYYY-YYYY']
  },
  feeStructure: {
    tuitionFee: {
      type: Number,
      required: [true, 'Tuition fee is required'],
      min: [0, 'Tuition fee cannot be negative']
    },
    hostelFee: {
      type: Number,
      default: 0,
      min: [0, 'Hostel fee cannot be negative']
    },
    libraryFee: {
      type: Number,
      default: 0,
      min: [0, 'Library fee cannot be negative']
    },
    labFee: {
      type: Number,
      default: 0,
      min: [0, 'Lab fee cannot be negative']
    },
    examFee: {
      type: Number,
      default: 0,
      min: [0, 'Exam fee cannot be negative']
    },
    miscellaneousFee: {
      type: Number,
      default: 0,
      min: [0, 'Miscellaneous fee cannot be negative']
    },
    fine: {
      type: Number,
      default: 0,
      min: [0, 'Fine cannot be negative']
    }
  },
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Total amount cannot be negative']
  },
  amountPaid: {
    type: Number,
    default: 0,
    min: [0, 'Amount paid cannot be negative']
  },
  balanceAmount: {
    type: Number,
    default: 0,
    min: [0, 'Balance amount cannot be negative']
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required']
  },
  status: {
    type: String,
    enum: ['pending', 'partial', 'paid', 'overdue'],
    default: 'pending'
  },
  paymentHistory: [{
    transactionId: {
      type: String,
      required: true,
      unique: true
    },
    amount: {
      type: Number,
      required: true,
      min: [0, 'Payment amount cannot be negative']
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'online', 'bank_transfer', 'cheque', 'demand_draft'],
      required: true
    },
    paymentDate: {
      type: Date,
      required: true
    },
    receiptNumber: {
      type: String,
      required: true
    },
    bankDetails: {
      bankName: String,
      branchName: String,
      chequeNumber: String,
      ddNumber: String
    },
    paymentGateway: {
      gateway: String,
      gatewayTransactionId: String,
      gatewayResponse: String
    },
    remarks: {
      type: String,
      maxlength: [500, 'Remarks cannot exceed 500 characters']
    },
    receivedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    verifiedAt: Date,
    status: {
      type: String,
      enum: ['pending', 'verified', 'failed', 'refunded'],
      default: 'pending'
    }
  }],
  discounts: [{
    type: {
      type: String,
      enum: ['merit', 'financial_aid', 'sports', 'cultural', 'sibling', 'staff_ward', 'other'],
      required: true
    },
    description: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: [0, 'Discount amount cannot be negative']
    },
    percentage: {
      type: Number,
      min: [0, 'Discount percentage cannot be negative'],
      max: [100, 'Discount percentage cannot exceed 100']
    },
    appliedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    appliedAt: {
      type: Date,
      default: Date.now
    },
    validTill: Date
  }],
  lateFeeApplied: {
    type: Boolean,
    default: false
  },
  lateFeeAmount: {
    type: Number,
    default: 0,
    min: [0, 'Late fee amount cannot be negative']
  },
  isRefundInitiated: {
    type: Boolean,
    default: false
  },
  refundDetails: {
    refundAmount: {
      type: Number,
      min: [0, 'Refund amount cannot be negative']
    },
    refundReason: String,
    refundStatus: {
      type: String,
      enum: ['initiated', 'processed', 'completed', 'failed']
    },
    refundDate: Date,
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }
}, {
  timestamps: true
});

// Compound indexes for better performance
FeeSchema.index({ student: 1, semester: 1, academicYear: 1 }, { unique: true });
FeeSchema.index({ status: 1, dueDate: 1 });
FeeSchema.index({ academicYear: 1, semester: 1 });
FeeSchema.index({ 'paymentHistory.transactionId': 1 });

// Pre-save middleware to calculate totals
FeeSchema.pre('save', function(next) {
  // Calculate total amount from fee structure
  const feeStructure = this.feeStructure;
  this.totalAmount = feeStructure.tuitionFee + 
                    feeStructure.hostelFee + 
                    feeStructure.libraryFee + 
                    feeStructure.labFee + 
                    feeStructure.examFee + 
                    feeStructure.miscellaneousFee + 
                    feeStructure.fine + 
                    this.lateFeeAmount;

  // Apply discounts
  const totalDiscount = this.discounts.reduce((sum, discount) => {
    return sum + discount.amount;
  }, 0);
  
  this.totalAmount -= totalDiscount;

  // Calculate balance amount
  this.balanceAmount = this.totalAmount - this.amountPaid;

  // Update status based on payment
  if (this.balanceAmount <= 0) {
    this.status = 'paid';
  } else if (this.amountPaid > 0) {
    this.status = 'partial';
  } else if (new Date() > this.dueDate) {
    this.status = 'overdue';
  } else {
    this.status = 'pending';
  }

  next();
});

// Method to add payment
FeeSchema.methods.addPayment = function(paymentData) {
  this.paymentHistory.push(paymentData);
  this.amountPaid += paymentData.amount;
  return this.save();
};

// Method to apply discount
FeeSchema.methods.applyDiscount = function(discountData) {
  this.discounts.push(discountData);
  return this.save();
};

// Method to apply late fee
FeeSchema.methods.applyLateFee = function(amount, appliedBy) {
  this.lateFeeAmount = amount;
  this.lateFeeApplied = true;
  return this.save();
};

// Static method to get fee summary for a student
FeeSchema.statics.getStudentFeeSummary = async function(studentId) {
  const pipeline = [
    { $match: { student: new mongoose.Types.ObjectId(studentId) } },
    {
      $group: {
        _id: null,
        totalFees: { $sum: '$totalAmount' },
        totalPaid: { $sum: '$amountPaid' },
        totalBalance: { $sum: '$balanceAmount' },
        paidSemesters: {
          $sum: {
            $cond: [{ $eq: ['$status', 'paid'] }, 1, 0]
          }
        },
        pendingSemesters: {
          $sum: {
            $cond: [{ $ne: ['$status', 'paid'] }, 1, 0]
          }
        }
      }
    }
  ];

  const result = await this.aggregate(pipeline);
  return result[0] || {
    totalFees: 0,
    totalPaid: 0,
    totalBalance: 0,
    paidSemesters: 0,
    pendingSemesters: 0
  };
};

// Virtual for payment progress percentage
FeeSchema.virtual('paymentProgress').get(function() {
  if (this.totalAmount === 0) return 100;
  return Math.round((this.amountPaid / this.totalAmount) * 100);
});

// Virtual to check if payment is overdue
FeeSchema.virtual('isOverdue').get(function() {
  return new Date() > this.dueDate && this.status !== 'paid';
});

module.exports = mongoose.model('Fee', FeeSchema);