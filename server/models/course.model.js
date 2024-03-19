import mongoose from 'mongoose'

const LessonSchema = new mongoose.Schema({
  title: String,
  content: String,
  resource_url: String
})
const Lesson = mongoose.model('Lesson', LessonSchema)
const CourseSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },
  cover: {
    data: Buffer,
    contentType: String
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true
  },
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  },
  teacher: {type: mongoose.Schema.ObjectId, ref: 'User'},
  published: {
    type: Boolean,
    default: false
  },
  lessons: [LessonSchema],
  price: {
    type: Number,
    required: true
  }

})

export default mongoose.model('Course', CourseSchema)
