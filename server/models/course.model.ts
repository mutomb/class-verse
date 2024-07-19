import mongoose from 'mongoose'

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

//mongoose schema middlewares
CourseSchema.pre('remove',function(next){
  console.log("Removing enrollement of course" + this._id);
  /**remove any user's enrollments in this course */
  this.model('Enrollment').find({ course : this._id }, function(err, enrollments){
      if(err){
          console.log("Error, Enrollment was not deleted");
      }else if(enrollments.length == 0){
          console.log("No enrollment found for this course");
      }else{
          for (var i=0; i<enrollments.length; i++){
            enrollments[i].remove(function(delete_err, delete_data){
                  if(delete_err){
                      console.log("one of the enrollments for this course was not deleted");
                  }else{
                      console.log("enrollement deleted");
                  }
              });
          }
      }
  });
  next();
});

const Course = mongoose.model('Course', CourseSchema)

export default Course
