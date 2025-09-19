const mongoose = require('mongoose');

const HelpdeskSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    required: [true, 'Ticket ID is required'],
    unique: true,
    trim: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'Student reference is required']
  },
  category: {
    type: String,
    enum: ['academic', 'technical', 'fee', 'hostel', 'library', 'transport', 'placement', 'general', 'counselling'],
    required: [true, 'Category is required']
  },
  subcategory: {
    type: String,
    trim: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: [200, 'Subject cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'waiting_for_customer', 'resolved', 'closed', 'cancelled'],
    default: 'open'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  assignedAt: {
    type: Date
  },
  estimatedResolutionTime: {
    type: Date
  },
  actualResolutionTime: {
    type: Date
  },
  attachments: [{
    filename: {
      type: String,
      required: true
    },
    originalName: {
      type: String,
      required: true
    },
    filePath: {
      type: String,
      required: true
    },
    fileSize: {
      type: Number,
      required: true
    },
    mimeType: {
      type: String,
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      maxlength: [1000, 'Comment cannot exceed 1000 characters']
    },
    commentedAt: {
      type: Date,
      default: Date.now
    },
    isInternal: {
      type: Boolean,
      default: false
    },
    attachments: [{
      filename: String,
      originalName: String,
      filePath: String,
      fileSize: Number,
      mimeType: String
    }]
  }],
  resolution: {
    summary: {
      type: String,
      maxlength: [1000, 'Resolution summary cannot exceed 1000 characters']
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    resolvedAt: {
      type: Date
    },
    resolutionTime: {
      type: Number // in minutes
    }
  },
  feedback: {
    rating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5']
    },
    comment: {
      type: String,
      maxlength: [1000, 'Feedback comment cannot exceed 1000 characters']
    },
    submittedAt: {
      type: Date
    }
  },
  escalation: {
    isEscalated: {
      type: Boolean,
      default: false
    },
    escalatedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    escalatedAt: {
      type: Date
    },
    escalationReason: {
      type: String,
      maxlength: [500, 'Escalation reason cannot exceed 500 characters']
    },
    escalationLevel: {
      type: Number,
      default: 0
    }
  },
  sla: {
    responseTime: {
      expected: { type: Number }, // in minutes
      actual: { type: Number }
    },
    resolutionTime: {
      expected: { type: Number }, // in minutes
      actual: { type: Number }
    }
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  relatedTickets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Helpdesk'
  }],
  isUrgent: {
    type: Boolean,
    default: false
  },
  contactPreference: {
    type: String,
    enum: ['email', 'phone', 'in_person', 'chat'],
    default: 'email'
  },
  customerSatisfactionScore: {
    type: Number,
    min: [1, 'Customer satisfaction score must be at least 1'],
    max: [10, 'Customer satisfaction score cannot exceed 10']
  }
}, {
  timestamps: true
});

// Indexes for better performance
HelpdeskSchema.index({ ticketId: 1 });
HelpdeskSchema.index({ student: 1, createdAt: -1 });
HelpdeskSchema.index({ status: 1, priority: 1 });
HelpdeskSchema.index({ assignedTo: 1, status: 1 });
HelpdeskSchema.index({ category: 1, subcategory: 1 });
HelpdeskSchema.index({ createdAt: -1 });

// Text index for search
HelpdeskSchema.index({ 
  subject: 'text', 
  description: 'text',
  tags: 'text'
});

// Pre-save middleware to generate ticket ID
HelpdeskSchema.pre('save', async function(next) {
  if (this.isNew && !this.ticketId) {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    
    // Count tickets for this month
    const ticketCount = await this.constructor.countDocuments({
      createdAt: {
        $gte: new Date(year, currentDate.getMonth(), 1),
        $lt: new Date(year, currentDate.getMonth() + 1, 1)
      }
    });
    
    const sequence = String(ticketCount + 1).padStart(4, '0');
    this.ticketId = `TKT${year}${month}${sequence}`;
  }
  
  // Calculate resolution time if resolved
  if (this.status === 'resolved' && this.resolution.resolvedAt && !this.resolution.resolutionTime) {
    const resolutionTimeMs = this.resolution.resolvedAt - this.createdAt;
    this.resolution.resolutionTime = Math.round(resolutionTimeMs / (1000 * 60)); // in minutes
  }
  
  next();
});

// Virtual for total comments count
HelpdeskSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

// Virtual for age of ticket in hours
HelpdeskSchema.virtual('ageInHours').get(function() {
  const now = new Date();
  const ageMs = now - this.createdAt;
  return Math.round(ageMs / (1000 * 60 * 60));
});

// Virtual to check if ticket is overdue
HelpdeskSchema.virtual('isOverdue').get(function() {
  if (!this.estimatedResolutionTime) return false;
  return new Date() > this.estimatedResolutionTime && !['resolved', 'closed'].includes(this.status);
});

// Method to add comment
HelpdeskSchema.methods.addComment = function(userId, content, isInternal = false, attachments = []) {
  this.comments.push({
    user: userId,
    content: content,
    commentedAt: new Date(),
    isInternal: isInternal,
    attachments: attachments
  });
  
  return this.save();
};

// Method to assign ticket
HelpdeskSchema.methods.assignTo = function(userId) {
  this.assignedTo = userId;
  this.assignedAt = new Date();
  this.status = 'in_progress';
  
  return this.save();
};

// Method to resolve ticket
HelpdeskSchema.methods.resolve = function(userId, summary) {
  this.status = 'resolved';
  this.resolution = {
    summary: summary,
    resolvedBy: userId,
    resolvedAt: new Date()
  };
  this.actualResolutionTime = new Date();
  
  return this.save();
};

// Method to escalate ticket
HelpdeskSchema.methods.escalate = function(escalatedTo, reason) {
  this.escalation = {
    isEscalated: true,
    escalatedTo: escalatedTo,
    escalatedAt: new Date(),
    escalationReason: reason,
    escalationLevel: this.escalation.escalationLevel + 1
  };
  this.priority = 'high';
  
  return this.save();
};

// Method to submit feedback
HelpdeskSchema.methods.submitFeedback = function(rating, comment) {
  this.feedback = {
    rating: rating,
    comment: comment,
    submittedAt: new Date()
  };
  this.status = 'closed';
  
  return this.save();
};

// Static method to get tickets summary for dashboard
HelpdeskSchema.statics.getTicketSummary = async function(filters = {}) {
  const pipeline = [
    { $match: filters },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        avgRating: { $avg: '$feedback.rating' }
      }
    }
  ];

  const statusSummary = await this.aggregate(pipeline);
  
  const categorySummary = await this.aggregate([
    { $match: filters },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        avgResolutionTime: { $avg: '$resolution.resolutionTime' }
      }
    },
    { $sort: { count: -1 } }
  ]);

  return {
    statusSummary,
    categorySummary
  };
};

// Static method to get SLA metrics
HelpdeskSchema.statics.getSLAMetrics = async function(startDate, endDate) {
  const pipeline = [
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
        status: { $in: ['resolved', 'closed'] }
      }
    },
    {
      $group: {
        _id: '$category',
        totalTickets: { $sum: 1 },
        avgResolutionTime: { $avg: '$resolution.resolutionTime' },
        avgRating: { $avg: '$feedback.rating' },
        onTimeResolution: {
          $sum: {
            $cond: [
              { $lte: ['$resolution.resolutionTime', '$sla.resolutionTime.expected'] },
              1,
              0
            ]
          }
        }
      }
    },
    {
      $addFields: {
        slaComplianceRate: {
          $multiply: [
            { $divide: ['$onTimeResolution', '$totalTickets'] },
            100
          ]
        }
      }
    }
  ];

  return await this.aggregate(pipeline);
};

module.exports = mongoose.model('Helpdesk', HelpdeskSchema);