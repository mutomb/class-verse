import mongoose from 'mongoose'
// Create Schema for storing a private message between two users as well as the related conversation (tracking the last message)
const MessageSchema = new mongoose.Schema({
  to: {type: mongoose.Schema.ObjectId, ref: 'User'},
  from: {type: mongoose.Schema.ObjectId, ref: 'User'},
  course: {type: mongoose.Schema.ObjectId, ref: 'Course'},
  anonymous_email:{
    type: String,
    trim: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
  },
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
const Message =  mongoose.model('Message', MessageSchema)

export {Message, MessageSchema}

