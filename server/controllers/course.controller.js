import Course from '../models/course.model'
import extend from 'lodash/extend'
import fs from 'fs'
import errorHandler from '../helpers/dbErrorHandler'
import formidable from 'formidable'
import defaultCourseImage from '../../client/public/images/courses/courses-default.svg'

const create = (req, res) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded"
      })
    }
    let course = new Course(fields)
    course.teacher= req.profile
    if(files.cover){
      course.cover.data = fs.readFileSync(files.cover.path)
      course.cover.contentType = files.cover.type
    }
    try {
      let result = await course.save()
      res.json(result)
    }catch (err){
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
  })
}

/**
 * Load course and append to req.
 */
const courseByID = async (req, res, next, id) => {
  try {
    let course = await Course.findById(id).populate('teacher', '_id name')
    if (!course)
      return res.status('400').json({
        error: "Course not found"
      })
    req.course = course
    next()
  } catch (err) {
    return res.status('400').json({
      error: "Could not retrieve course"
    })
  }
}

const read = (req, res) => {
  req.course.cover = undefined
  return res.json(req.course)
}

const list = async (req, res) => {
  try {
    let courses = await Course.find().select('name email updated created')
    res.json(courses)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const update = async (req, res) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Photo could not be uploaded"
      })
    }
    let course = req.course
    course = extend(course, fields)
    if(fields.lessons){
      course.lessons = JSON.parse(fields.lessons)
    }
    course.updated = Date.now()
    if(files.image){
      course.cover.data = fs.readFileSync(files.image.path)
      course.cover.contentType = files.image.type
    }
    try {
      await course.save()
      res.json(course)
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
  })
}

const newLesson = async (req, res) => {
  try {
    let lesson = req.body.lesson
    let result = await Course.findByIdAndUpdate(req.course._id, {$push: {lessons: lesson}, updated: Date.now()}, {new: true})
                            .populate('teacher', '_id name')
                            .exec()
    res.json(result)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const remove = async (req, res) => {
  try {
    let course = req.course
    let deleteCourse = await course.remove()
    res.json(deleteCourse)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const isTeacher = (req, res, next) => {
    const isTeacher = req.course && req.auth && req.course.teacher._id == req.auth._id
    if(!isTeacher){
      return res.status('403').json({
        error: "User is not authorized"
      })
    }
    next()
}

const listByTeacher = (req, res) => {
  Course.find({teacher: req.profile._id}, (err, courses) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    res.json(courses)
  }).populate('teacher', '_id name')
}

const listPublished = (req, res) => {
  Course.find({published: true}, (err, courses) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    res.json(courses)
  }).populate('teacher', '_id name')
}

const photo = (req, res, next) => {
  if(req.course.cover.data){
    res.set("Content-Type", req.course.cover.contentType)
    return res.send(req.course.cover.data)
  }
  next()
}
const defaultPhoto = (req, res) => {
  return res.sendFile(process.cwd()+defaultCourseImage)
}


export default {
  create,
  courseByID,
  read,
  list,
  remove,
  update,
  isTeacher,
  listByTeacher,
  photo,
  defaultPhoto,
  newLesson,
  listPublished
}
