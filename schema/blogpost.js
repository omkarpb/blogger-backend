const mongoose = require('mongoose');

const BlogpostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model for authors
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  tags: [String],
  category: {
    type: String,
    trim: true,
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  publishDate: {
    type: Date,
  },
  // You can add more fields as needed, like:
  // featuredImage: String,
  // comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
}, { timestamps: true }); // Alternatively use the timestamps option

const Blogpost = mongoose.model('BlogPost', BlogpostSchema);

module.exports = Blogpost;