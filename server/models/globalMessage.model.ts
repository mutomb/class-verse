import mongoose from 'mongoose'
// Create Schema for storing a group messages between users in a chat room
const GlobalMessageSchema = new mongoose.Schema({
  from: {type: mongoose.Schema.ObjectId, ref: 'User'},
  course: {type: mongoose.Schema.ObjectId, ref: 'Course'},
  photo: {
    data: Buffer,
    contentType: String
  },
  body: {
    type: String,
  },
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  },
})
//mongoose model
const GlobalMessage =  mongoose.model('GlobalMessage', GlobalMessageSchema)

export default GlobalMessage

