import mongoose from 'mongoose'
import crypto from 'crypto'
import config from '../config/config'
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
  complied: {
    type: Boolean
  },
  experience: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    trim: true
  },
  // role: {type: mongoose.Schema.ObjectId, ref: 'Role'}, //Continuous role to be implemented
  role: {
    type: String,
    trim: true,
    enum: ['anonymous' , 'user', 'student', 'moderator', 'teacher','admin'],
    default: 'user'
  },
  company: {type: mongoose.Schema.ObjectId, ref: 'Company'},
  auth0_account: {},
  stripe_seller: {},
  stripe_customer: {},
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
        .createHmac('sha256', this.salt) /** Computing SHA-256 fingerprint/security is usually faster than SHA-512 (most secure) because it's half its size. SHA-512 presumably provides a higher security. SHA-256 most algorithms are used to sign certificates. */
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
  /**remove any user's company */
  this.model('Company').find({ _id : this.company }, function(err, companies){
      if(err){
          console.log("Error, Company was not deleted");
      }else if(companies.length == 0){
          console.log("No company found for this user");
      }else{
          for (var i=0; i<companies.length; i++){
               companies[i].remove(function(delete_err, delete_data){
                  if(delete_err){
                      console.log("No company found for this user");
                  }else{
                      console.log("company deleted");
                  }
              });
          }
      }
  });
   /**remove any user's settings */
  this.model('Setting').find({ _id : this._id }, function(err, settings){
    if(err){
        console.log("Error, Setting was not deleted");
    }else if(settings.length == 0){
        console.log("No setting found for this user");
    }else{
        for (var i=0; i<settings.length; i++){
          settings[i].remove(function(delete_err, delete_data){
                if(delete_err){
                    console.log("No setting found for this user");
                }else{
                    console.log("setting deleted");
                }
            });
        }
    }
  });
  next();
});

UserSchema.pre('save',function(next){
  if(this.get('email') === config.admin){
    this.role = 'admin'
  }
  next()
});

//mongoose model
export default mongoose.model('User', UserSchema)
