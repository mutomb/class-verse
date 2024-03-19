import mongoose from 'mongoose'

const CompanySchema = new mongoose.Schema({
    name: {
      type: String,
      trim: true
    },
    logo: {
      data: Buffer,
      contentType: String
    }
  })
  export default mongoose.model('Company', CompanySchema)