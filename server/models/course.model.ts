import mongoose from 'mongoose'

const LessonSchema = new mongoose.Schema({
  title: String,
  content: String,
  media: {type: mongoose.Schema.ObjectId, ref: 'Media'}, 
  resource_url: String, 
})
const Lesson = mongoose.model('Lesson', LessonSchema)
const CourseSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },
  cover: {
    data: Buffer,
    contentType: String
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    default: 1
  },
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  },
  teacher: {type: mongoose.Schema.ObjectId, ref: 'User'},
  published: {
    type: Boolean,
    default: false
  },
  lessons: [LessonSchema],
  price: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true,
    trim: true,
    enum: ['ZAR' , 'USD', 'GBP', 'BTC'],
  },
  totalEnrolled: {
    type: Number,
    default: 0
  },
  type: {
    type: String,
    default: 'course'
  }
})

//mongoose schema middlewares
CourseSchema.pre('remove',function(next){
  console.log("Removing enrollement of course" + this._id);
  /**remove any user's company */
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

export{Lesson, Course}
