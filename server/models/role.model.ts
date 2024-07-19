import mongoose from 'mongoose'
//mongoose schema
const RoleSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    enum: ['anonymous' , 'user', 'specialist', 'moderator','administrator'],
    default: 'user'
  },
  permission: {
    type: Number
  },
  user: {type: mongoose.Schema.ObjectId, ref: 'User'},
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  }
})

//mongoose model
export default mongoose.model('Role', RoleSchema)
