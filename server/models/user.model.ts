import mongoose from 'mongoose'
import crypto from 'crypto'
import config from '../config/config'
//mongoose schema
const RatingSchema = new mongoose.Schema({
  avg_rating: {
    type: Number,
    default: 0
  },
  count: {
    type: Number,
    default: 0
  },
})

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
    match: [/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/, 'Please fill in a valid email address'], // current specification for email addresses is RFC 5322
    required: true
  },
  resume: {
    data: Buffer,
    contentType: String,
  },
  resume_status: {
    type: String, 
    trim: true,
    enum: ['none' , 'pending', 'approved', 'rejected'],
    default: 'none'
  },
  qualification: {
    data: Buffer,
    contentType: String,
  },
  qualification_status: {
    type: String, 
    trim: true,
    enum: ['none' , 'pending', 'approved', 'rejected'],
    default: 'none'
  },
  rating: RatingSchema,
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
  specialist: {
    type: Boolean,
    default: false
  },
  complied: {
    type: Boolean
  },
  experience: {
    type: {},
    required: true,
    max: 100000
  },
  skills: [String],
  // role: {type: mongoose.Schema.ObjectId, ref: 'Role'}, //Continuous role to be implemented
  role: {
    type: String,
    trim: true,
    enum: ['user', 'client', 'moderator', 'specialist','admin'],
    default: 'user'
  },
  company: {type: mongoose.Schema.ObjectId, ref: 'Company'}, /** Mongoose can access 'Company' but MongoDB stores and references companies*/
  google_user: {},
  github_user: {},
  stripe_seller: {},
  stripe_customer: {},
  shopify_seller: {},
  shopify_customer: {},
  paypal_seller: {},
  paypal_customer: {},
  active_plan: {
    type: String,
    trim: true,
    enum: ['Free' , 'Study', 'Upskill'],
    default: 'Free'
  },
  upskill: {
    type: Number,
    default: 0,
    enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  },
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
  if (this._password && this._password.search(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/) < 0) {
    this.invalidate('password', 'Password must have minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character.')
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
        .createHmac('sha256', this.salt) /** Computing SHA-256 fingerprint/security is usually faster than SHA-512 (most secure) because it's half its size. SHA-512 presumably provides a higher security. SHA-256 algorithms are used to sign most certificates. */
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
UserSchema.pre(/delete/,function(next){
  console.log("Removing company of user " + this.get('_id'));
  /**remove any user's company */
  try{
    let companies = this.model('Company').find({ _id : this.company }).exec()
     if(companies.length == 0){
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
  }catch(err){
      console.log("Error, Company was not deleted", err);
  }
  /**remove user's settings */
  try{
    let setting = this.model('Setting').findByIdAndDelete(this.get('_id')).exec()
    if(setting){
      console.log("Setting deleted:", setting._id);
    }
  }catch(err){
    console.log("Error, Setting not deleted", err);
  }
  next();
});

UserSchema.pre(['save', 'updateOne', 'findOneAndUpdate'],function(next){
  console.log('user pre save, updateOne, findOneAndupdate', this.get('email'))
  if(this.get('email') === config.admin){
    this.set('role', 'admin')
  }
  next()
});

//mongoose model
export default mongoose.model('User', UserSchema)
