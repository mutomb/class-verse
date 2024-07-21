const mongoose = require('mongoose')
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/greenorangesquare')
mongoose.connection.on('connected', function () {
  console.log('Mongoose connected');
});
mongoose.connection.on('error',function (err) {
console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function () {
console.log('Mongoose disconnected');
});
// const User = require('./server/models/user.model.ts')
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
    type: String,
    trim: true
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

const User =  mongoose.model('User', UserSchema)

// const Course = require('./server/models/course.model.ts')
const LessonSchema = new mongoose.Schema({
  section: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },
  title: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },
  aim: {
    type: String,
    trim: true,
    required: true,
  },
  content: {
    type: {},
    required: true,
    max: 2000000
  },
  media: {type: mongoose.Schema.ObjectId, ref: 'Media'},
  article: {type: mongoose.Schema.ObjectId, ref: 'Article'},
  free: {type: Boolean, default: false} 
})
const Lesson = mongoose.model('Lesson', LessonSchema)


const Rating = mongoose.model('Rating', RatingSchema)

const CourseSchema = new mongoose.Schema({
  cover: {
    data: Buffer,
    contentType: String
  },
  media: {type: mongoose.Schema.ObjectId, ref: 'Media'},
  title: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },
  subtitle: {
    type: String,
    trim: true,
    required: true,
  },
  category: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true,
    enum: ['English', 'French']
  },
  programming_languages: [String],
  technologies: [String],
  sections: [String],
  requirements: [String],
  level: ['Beginner', 'Intermediate', 'Advanced'],
  audiences: [String],
  description: {
    type: String,
    trim: true
  },
  lessons: [LessonSchema],
  quantity: {
    type: Number,
    default: 1
  },
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  },
  specialist: {type: mongoose.Schema.ObjectId, ref: 'User'},
  published: {
    type: Boolean,
    default: false
  },
  rating: RatingSchema,
  price: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true,
    trim: true,
    enum: ['R' , '$'],
  },
  totalEnrolled: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    default: 'Not published',
    enum: ['Not published' , 'Pending approval', 'Approved', 'Not approved']
  },
  certificate: {
    data: Buffer,
    contentType: String,
  },
})

const Course = mongoose.model('Course', CourseSchema)


//mongoose test db schema
const MovieSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  },
  // postedBy: [UserSchema]
})

//mongoose model
const Movie = mongoose.model('Movie', MovieSchema)

const paginate_movies = async (page, limit) => {
  const movies = await Movie.find({}).limit(limit*1).skip((page - 1)*limit)
    const allmoviesCount = await Movie.find({}).countDocuments();
    return ({
      movies,
      totalPages: Math.ceil(allmoviesCount / limit),
      currentPage: page,
    });

}
// paginate_movies(1, 3).then(movies => console.log(movies))

const excluding_movies = async () => {
  const movies = await Movie.find({$or: [{title: { "$ne": 'Stand by Me'}, _id: { "$ne": '666c32bb32bd6868af6d72f0'}}]}).sort({'created': -1}).exec()
    return movies
}
// excluding_movies().then(movies=>console.log(movies))

//greenorangesquare db

const excluding_users= async () => {
  let users = await User.find({$or: [{resume_status: { "$ne": 'approved'}}, {qualification_status: { "$ne": 'approved'}}]}).sort({'created': -1}).select('_id name surname email specialist role created resume_status qualification_status').exec()
    return users
}
// excluding_users().then(users=>console.log(users))

const courseByID = async (id) => {
  try {
    console.log('id', id)
    // let course = await Course.findById(id).populate('specialist', '_id name').populate('lessons.media').populate('media').exec()
    let course = await Course.findById(id).populate('specialist', '_id name').exec()
    console.log('course', course)
    return course
  } catch (err) {
  }
}
// courseByID('66731cf65e74733f7ceecb0b').then((course)=>console.log(course))

const listCourses = async () => {
  let courses = await Course.find({}).select('-covers').sort('-created')
  return courses
}
listCourses().then((courses)=>{
  console.log(courses[0].lessons[0].content.substring(0, 1000))
})