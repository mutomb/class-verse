import mongoose from 'mongoose'
import crypto from 'crypto'
//mongoose schema
const UserSchema = new mongoose.Schema({
  photo: {
    data: Buffer,
    contentType: String
  },
  name: {
    type: String,
    trim: true,
    required: true
  },
  surname: {
    type: String,
    trim: true,
    required: true
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
    required: true
  },
  hashed_password: {
    type: String,
    required: true
  },
  salt: String,
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  },
  teacher: {
    type: Boolean,
    default: false
  },
  experience: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    trim: true
  },
  company: {type: mongoose.Schema.ObjectId, ref: 'Company'}
})

//mongoose schema methods
UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password
    this.salt = this.makeSalt()
    this.hashed_password = this.encryptPassword(password)
  })
  .get(function() {
    return this._password
  })

UserSchema.path('hashed_password').validate(function(v) {
  if (this._password && this._password.length < 6) {
    this.invalidate('password', 'Password must be at least 6 characters.')
  }
  if (this.isNew && !this._password) {
    this.invalidate('password', 'Password is required')
  }
}, null)

UserSchema.methods = {
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashed_password
  },
  encryptPassword: function(password) {
    if (!password) return ''
    try {
      return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex')
    } catch (err) {
      return ''
    }
  },
  makeSalt: function() {
    return Math.round((new Date().valueOf() * Math.random())) + ''
  }
}

//mongoose schema middlewares
UserSchema.pre('remove',function(next){
  console.log("Removing company of user " + this._id);
  this.model('Company').find({ _id : this.company }, function(err, companies){
      if(err){
          console.log("Error, No company found in this user");
      }else if(companies.length == 0){
          console.log("No company found in this user");
      }else{
          for (var i=0; i<companies.length; i++){
               companies[i].remove(function(delete_err,delete_data){
                  if(delete_err){
                      console.log("No company found in this user");
                  }else{
                      console.log("company deleted");
                  }
              });
          }
      }
  });
  next();
});

//mongoose model
export default mongoose.model('User', UserSchema)
