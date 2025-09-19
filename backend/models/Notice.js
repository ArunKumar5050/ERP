const mongoose = require('mongoose');

const NoticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Notice title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Notice content is required'],
    maxlength: [5000, 'Content cannot exceed 5000 characters']
  },
  type: {
    type: String,
    enum: ['general', 'academic', 'exam', 'fee', 'event', 'holiday', 'urgent', 'placement'],
    required: [true, 'Notice type is required']
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  targetAudience: {
    students: {
      type: Boolean,
      default: true
    },
    faculty: {
      type: Boolean,
      default: false
    },
    specificCourses: [{
      type: String,
      trim: true
    }],
    specificSemesters: [{
      type: Number,
      min: 1,
      max: 8
    }],
    specificDepartments: [{
      type: String,
      trim: true
    }]
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
  publishDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Creator reference is required']
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  },
  status: {
    type: String,
    enum: ['draft', 'pending_approval', 'approved', 'published', 'expired', 'archived'],
    default: 'draft'
  },
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    likedAt: {
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
    isApproved: {
      type: Boolean,
      default: false
    }
  }],
  viewCount: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }]
}, {
  timestamps: true
});

// Indexes for better performance
NoticeSchema.index({ publishDate: -1, isActive: 1 });
NoticeSchema.index({ type: 1, priority: 1 });
NoticeSchema.index({ status: 1, publishDate: -1 });
NoticeSchema.index({ isPinned: -1, publishDate: -1 });
NoticeSchema.index({ tags: 1 });
NoticeSchema.index({ createdBy: 1 });

// Text index for search functionality
NoticeSchema.index({ 
  title: 'text', 
  content: 'text', 
  tags: 'text' 
});

// Virtual for read count
NoticeSchema.virtual('readCount').get(function() {
  return this.readBy.length;
});

// Virtual for like count
NoticeSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual for comment count
NoticeSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

// Virtual to check if notice is expired
NoticeSchema.virtual('isExpired').get(function() {
  return this.expiryDate && new Date() > this.expiryDate;
});

// Method to mark as read by user
NoticeSchema.methods.markAsRead = function(userId) {
  const alreadyRead = this.readBy.some(read => read.user.toString() === userId.toString());
  
  if (!alreadyRead) {
    this.readBy.push({ user: userId });
    this.viewCount += 1;
    return this.save();
  }
  
  return Promise.resolve(this);
};

// Method to toggle like
NoticeSchema.methods.toggleLike = function(userId) {
  const likeIndex = this.likes.findIndex(like => like.user.toString() === userId.toString());
  
  if (likeIndex > -1) {
    // Unlike
    this.likes.splice(likeIndex, 1);
  } else {
    // Like
    this.likes.push({ user: userId });
  }
  
  return this.save();
};

// Method to add comment
NoticeSchema.methods.addComment = function(userId, content) {
  this.comments.push({
    user: userId,
    content: content,
    commentedAt: new Date()
  });
  
  return this.save();
};

// Static method to get notices for specific user
NoticeSchema.statics.getNoticesForUser = async function(userRole, userCourse = null, userSemester = null, userDepartment = null) {
  const currentDate = new Date();
  
  let matchCondition = {
    isActive: true,
    status: 'published',
    publishDate: { $lte: currentDate },
    $or: [
      { expiryDate: { $exists: false } },
      { expiryDate: { $gte: currentDate } }
    ]
  };

  // Filter based on target audience
  if (userRole === 'student') {
    matchCondition['targetAudience.students'] = true;
    
    if (userCourse) {
      matchCondition.$and = [
        {
          $or: [
            { 'targetAudience.specificCourses': { $size: 0 } },
            { 'targetAudience.specificCourses': userCourse }
          ]
        }
      ];
    }
    
    if (userSemester) {
      if (!matchCondition.$and) matchCondition.$and = [];
      matchCondition.$and.push({
        $or: [
          { 'targetAudience.specificSemesters': { $size: 0 } },
          { 'targetAudience.specificSemesters': userSemester }
        ]
      });
    }
  } else if (userRole === 'faculty') {
    matchCondition['targetAudience.faculty'] = true;
    
    if (userDepartment) {
      matchCondition.$and = [
        {
          $or: [
            { 'targetAudience.specificDepartments': { $size: 0 } },
            { 'targetAudience.specificDepartments': userDepartment }
          ]
        }
      ];
    }
  }

  return await this.find(matchCondition)
    .populate('createdBy', 'firstName lastName role')
    .populate('approvedBy', 'firstName lastName role')
    .sort({ isPinned: -1, publishDate: -1 });
};

// Static method to get notice statistics
NoticeSchema.statics.getNoticeStats = async function(startDate, endDate) {
  const pipeline = [
    {
      $match: {
        publishDate: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
        totalViews: { $sum: '$viewCount' },
        totalLikes: { $sum: { $size: '$likes' } },
        totalComments: { $sum: { $size: '$comments' } }
      }
    },
    {
      $sort: { count: -1 }
    }
  ];

  return await this.aggregate(pipeline);
};

// Pre-save middleware to update status based on dates
NoticeSchema.pre('save', function(next) {
  const currentDate = new Date();
  
  if (this.expiryDate && currentDate > this.expiryDate) {
    this.status = 'expired';
    this.isActive = false;
  }
  
  next();
});

module.exports = mongoose.model('Notice', NoticeSchema);