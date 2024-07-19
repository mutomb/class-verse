import mongoose from 'mongoose'
const ArticleSchema = new mongoose.Schema({
  file: {
    data: Buffer,
    contentType: String,
  }, 
  postedBy: {type: mongoose.Schema.ObjectId, ref: 'User'},
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date
  }
})

export default mongoose.model('Article', ArticleSchema)
