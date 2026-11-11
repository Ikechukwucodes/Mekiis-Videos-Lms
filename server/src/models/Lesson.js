import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'courseId is required'],
      index: true
    },
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Module',
      required: [true, 'moduleId is required'],
      index: true
    },
    title: {
      type: String,
      required: [true, 'Lesson title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
      type: String,
      default: '',
      trim: true
    },
    contentType: {
      type: String,
      enum: ['video', 'text', 'embed'],
      default: 'video'
    },
    videoUrl: {
      type: String,
      default: '',
      trim: true
    },
    embedUrl: {
      type: String,
      default: '',
      trim: true
    },
    duration: {
      type: Number,
      default: 0 // Duration in seconds
    },
    order: {
      type: Number,
      required: true,
      default: 0
    },
    published: {
      type: Boolean,
      default: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Compound index for sorted lesson lookup within a module
lessonSchema.index({ moduleId: 1, order: 1 });
lessonSchema.index({ courseId: 1, order: 1 });

export const Lesson = mongoose.model('Lesson', lessonSchema);
