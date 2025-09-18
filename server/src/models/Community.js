const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    replies: [
      {
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        content: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const ThreadSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    title: { type: String, required: true },
    messages: [MessageSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Thread', ThreadSchema);


