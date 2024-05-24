import mongoose from 'mongoose'
//mongoose schema
const SettingSchema = new mongoose.Schema({
  colorMode: {
    type: String,
    enum: ['dark' , 'light', 'system'],
    default: 'system'
  },
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  },
  user: {type: mongoose.Schema.ObjectId, ref: 'User'},
})

//mongoose model
export default mongoose.model('Setting', SettingSchema)
