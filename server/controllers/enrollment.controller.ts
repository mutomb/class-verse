import {Enrollment} from '../models'
import {Course} from '../models'
import errorHandler from '../helpers/dbErrorHandler'

const create = async (req, res) => {
  let newEnrollment = {
    course: req.course,
    client: req.auth,
  }
  newEnrollment.lessonStatus = req.course.lessons.map((lesson)=>{
    return {lesson: lesson, complete:false}
  })
  const enrollment = new Enrollment(newEnrollment)
  try {
    await enrollment.save().then(async (enrollment)=>{
      try {
        await Course.findOneAndUpdate({_id: enrollment.course}, {$inc: {"totalEnrolled": 1}}, {new: true}).exec()
        req.io.sockets.emit(`users-${req.course._id}`, req.auth._id);
        return res.status(200).json(enrollment)
      }catch (err){
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)? errorHandler.getErrorMessage(err): err
        })
      }
    })
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)? errorHandler.getErrorMessage(err): err
    })
  }
}

/**
 * Gets an enrollment from DB and attaches it to request object so that it can be accessed by  next few methods
 */
const enrollmentByID = async (req, res, next, id) => {
  try {
    let enrollment = await Enrollment.findById(id).populate({path: 'course', populate:{ path: 'specialist media lessons.media lessons.article'}}).populate('client', '_id name')
    if (!enrollment){
      return res.status(400).json({
        error: "Enrollment not found"
      })
    }
    if(enrollment.course && enrollment.course.lessons){
      for(let i=0; i<enrollment.course.lessons.length; i++){
        if(enrollment.course.lessons[i].media){
          enrollment.course.lessons[i].media.postedBy = enrollment.course.specialist
        }
      }
    }
    if(enrollment.course && enrollment.course.media){
      enrollment.course.media.postedBy = enrollment.course.specialist
    }
    req.enrollment = enrollment
    next()
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)? errorHandler.getErrorMessage(err):"Could not retrieve enrollment"
    })
  }
}

const read = (req, res) => {
  let enrollment = req.enrollment
  if(enrollment){
    return res.json(enrollment)
  }
  return res.status(400).json({
    error: "Could not Read enrollment"
  })
}

const complete = async (req, res) => {
  let updatedData = {}
  updatedData['lessonStatus.$.complete']= req.body.complete 
  updatedData.updated = Date.now()
  if(req.body.courseCompleted)
    updatedData.completed = req.body.courseCompleted

    try {
      let enrollment = await Enrollment.updateOne({'lessonStatus._id':req.body.lessonStatusId}, {'$set': updatedData})
      res.json(enrollment)
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)? errorHandler.getErrorMessage(err): err
      })
    }
}

const remove = async (req, res) => {
  try {
    let enrollment = req.enrollment
    let deletedEnrollment = await enrollment.remove()
    res.json(deletedEnrollment)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)? errorHandler.getErrorMessage(err): err
    })
  }
}

const isClient = (req, res, next) => {
  const isClient = req.auth && req.auth._id == req.enrollment.client._id
  if (!isClient) {
    return res.status(403).json({
      error: "User is not enrolled"
    })
  }
  next()
}

const listEnrolled = async (req, res) => {
  try {
    let enrollments = await Enrollment.find({client: req.auth._id}).sort({'completed': 1}).populate('course', '_id title subtitle level category price currency description totalEnrolled')
    res.json(enrollments)
  } catch (err) {
    console.log(err)
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)? errorHandler.getErrorMessage(err): err
    })
  }
}


const findEnrollment = async (req, res, next) => {
  try {
    let enrollments = await Enrollment.find({course:req.course._id, client: req.auth._id})
    if(enrollments.length == 0){
      next()
    }else{
      res.json(enrollments[0])
    }
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)? errorHandler.getErrorMessage(err): err
    })
  }
}

const enrollmentStats = async (req, res) => {
  try {
    let stats = {}
    stats.totalEnrolled = await Enrollment.find({course:req.course._id}).countDocuments()
    stats.totalCompleted = await Enrollment.find({course:req.course._id}).exists('completed', true).countDocuments()
      res.json(stats)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)? errorHandler.getErrorMessage(err): err
    })
  }
} 

const listClientsAndSpecialist = async (req, res) => {
  try {
    let users = await Enrollment.find({course:req.course._id}).populate('client', '_id name surname specialist').populate({path: 'course', populate:{ path: 'specialist'}})
      res.json(users)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)? errorHandler.getErrorMessage(err): err
    })
  }
} 



export default {
  create,
  enrollmentByID,
  read,
  remove,
  complete,
  isClient,
  listEnrolled,
  findEnrollment,
  enrollmentStats,
  listClientsAndSpecialist
}
