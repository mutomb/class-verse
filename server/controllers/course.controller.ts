import {Course} from '../models'
import extend from 'lodash/extend'
import fs from 'fs'
import errorHandler from '../helpers/dbErrorHandler'
import formidable from 'formidable'
import defaultCourseCover from '../../client/public/images/courses/courses-default.svg'
import path from 'path'

const create = (req, res) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded"
      })
    }
    let course = new Course({...fields, rating: {avg_rating: 0, count: 0}})
    course.specialist= req.profile
    if(fields.programming_languages){
      course.programming_languages = JSON.parse(fields.programming_languages)
    }
    if(fields.technologies){
      course.technologies = JSON.parse(fields.technologies)
    }
    if(fields.sections){
      course.sections = JSON.parse(fields.sections)
    }
    if(fields.requirements){
      course.requirements = JSON.parse(fields.requirements)
    }
    if(fields.audiences){
      course.audiences = JSON.parse(fields.audiences)
    }
    if(files.cover && files.cover.path && files.cover.type){
      course.cover = {data: fs.readFileSync(files.cover.path), contentType: files.cover.type}
    }
    try {
      await course.save()
      course.cover = undefined
      res.json(course)
    }catch (err){
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)? errorHandler.getErrorMessage(err): err
      })
    }
  })
}

/**
 * Gets a course from DB and attaches it to request object so that it can be accessed by  next few methods
 */
const courseByID = async (req, res, next, id) => {
  try {
    let course = await Course.findById(id).populate('specialist', '_id name').populate('lessons.media').populate('media').populate('lessons.article', '_id postedBy').exec()
    if (!course){
      return res.status('400').json({
        error: "Course not found"
      })
    }
    if(course && course.lessons){
      for(let i=0; i<course.lessons.length; i++){
        if(course.lessons[i].media){
          course.lessons[i].media.postedBy = course.specialist
        }
      }
    }
    if(course && course.media){
      course.media.postedBy = course.specialist
    }
    req.course = course
    next()
  } catch (err) {
    return res.status('400').json({
      error: "Could not retrieve course"
    })
  }
}

const read = (req, res) => {
  let course = req.course
  if(course){course.cover = undefined
    return res.json(course)
  }
  return res.status('400').json({
    error: "Could not Read course"
  })
}

const update = async (req, res) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Course could not be updated"
      })
    }
    let course = req.course
    course = extend(course, fields)
    if(fields.lessons){
      course.lessons = JSON.parse(fields.lessons)
    }
    if(fields.programming_languages){
      course.programming_languages = JSON.parse(fields.programming_languages)
    }
    if(fields.technologies){
      course.technologies = JSON.parse(fields.technologies)
    }
    if(fields.sections){
      course.sections = JSON.parse(fields.sections)
    }
    if(fields.requirements){
      course.requirements = JSON.parse(fields.requirements)
    }
    if(fields.audiences){
      course.audiences = JSON.parse(fields.audiences)
    }
    course.updated = Date.now()
    if(files.cover && files.cover.path && files.cover.type){
      course.cover = {data: fs.readFileSync(files.cover.path), contentType: files.cover.type}
    }else{
      if(fields.cover && course.cover && (fields.cover === null || fields.cover === 'null')){
        course = await Course.findByIdAndUpdate({_id: course._id}, {cover: null}, {new: true}).exec()
      }
    }
    try {
      await course.save()
      course.cover = undefined
      if(fields.status === 'Pending approval'){
        req.io.sockets.emit('course pending approval admin')
      }
      res.json(course)
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)? errorHandler.getErrorMessage(err): err
      })
    }
  })
}

const newLesson = async (req, res) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Lesson could not be added"
      })
    }
    try {
      let lesson = {}
      for (let key of Object.keys(fields)){
        lesson[key] = fields[key]
      }
      if(Object.keys(lesson).length>0){
        let result = await Course.findByIdAndUpdate(req.course._id, {$push: {lessons: lesson}, updated: Date.now()}, {new: true})
        .select('-cover').populate('specialist', '_id name').populate('lessons.media').populate('media').populate('lessons.article', '_id postedBy')
        .exec()
        return res.json(result)
      }
      return res.status(400).json({
        error: 'Lesson could not be saved.'
      })
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)? errorHandler.getErrorMessage(err): err
      })
    }
  })
}

const remove = async (req, res) => {
  try {
    let course = req.course
    let deleteCourse = await course.remove()
    deleteCourse.cover=undefined
    res.json(deleteCourse)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)? errorHandler.getErrorMessage(err): err
    })
  }
}

const isSpecialist = (req, res, next) => {
    const isSpecialist = (req.course && req.auth && req.course.specialist._id == req.auth._id) || (req.auth && req.auth.role === 'admin')
    if(!isSpecialist){
      return res.status('403').json({
        error: "User is not authorized"
      })
    }
    next()
}

const listBySpecialist = (req, res) => {
  Course.find({specialist: req.profile._id}, (err, courses) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)? errorHandler.getErrorMessage(err): err
      })
    }
    res.json(courses)
  }).select('-cover -lessons.content -media -article').sort('-created').populate('specialist', '_id name')
}

const listCategories = async (req, res) => {
  try {
    let categories = await Course.distinct('category',{})
    res.json(['All', ...categories])
  } catch (err){
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)? errorHandler.getErrorMessage(err): err
    })
  }
}
const listCurrencies = async (req, res) => {
  res.json(Course.schema.path('currency').enumValues)
}

const listPublished = async (req, res) => {
  let query = {published: true, status: 'Approved'}
  if(req.query.search){
    query.$or=[] 
    query.$or.push({title : {'$regex': req.query.search, '$options': "i"} }) 
    query.$or.push({subtitle : {'$regex': req.query.search, '$options': "i"}  })
    query.$or.push({category : {'$regex': req.query.search, '$options': "i"}  })
    query.$or.push({language : {'$regex': req.query.search, '$options': "i"}  })
    query.$or.push({technologies : {'$regex': req.query.search, '$options': "i"}  })
    query.$or.push({sections : {'$regex': req.query.search, '$options': "i"}  })
    query.$or.push({requirements : {'$regex': req.query.search, '$options': "i"}  })
    query.$or.push({audiences : {'$regex': req.query.search, '$options': "i"} })
    query.$or.push({description : {'$regex': req.query.search, '$options': "i"} })
     
  }
  if(req.query.category && req.query.category != 'All') query.category =  req.query.category
  const { page = 1, limit = 10 } = req.query;
  try {
    const courses = await Course.find(query).limit(limit*1).skip((page - 1)*limit).sort({'created': -1}).populate('specialist', '_id name').select('-cover -lessons.content -media -article').exec()
    const allCoursesCount = await Course.find(query).countDocuments();
    res.json({
      courses: courses,
      count: Math.ceil(allCoursesCount/limit),
      page: page,
    });
  }catch (err){
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)? errorHandler.getErrorMessage(err): err
    })
  }
}

const listPopular = async (req, res) => {
  try {
    let courses = await Course.find({published: true, status: 'Approved'}).sort('-totalEnrolled').limit(10).populate('specialist', '_id name').select('-cover -lessons.content -media -article').exec()
    res.json(courses)
  }catch (err){
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)? errorHandler.getErrorMessage(err): err
    })
  }
}

const photo = (req, res, next) => {
  if(req.course.cover.data){
    res.set("Content-Type", req.course.cover.contentType)
    return res.send(req.course.cover.data)
  }
  next()
}
const defaultPhoto = (req, res) => {
  return res.sendFile(path.resolve(process.cwd()+defaultCourseCover))
}

const listPendingApproval = async (req, res) => {
  try {
    let courses = await Course.find({published: true, status: { "$ne": 'Approved'}}).sort({'created': -1}).populate('specialist', '_id name').select('-cover -lessons.content -media -article').exec()
    res.json(courses)
  }catch (err){
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)? errorHandler.getErrorMessage(err): err
    })
  }
}

export default {
  create,
  courseByID,
  read,
  listCategories,
  remove,
  update,
  isSpecialist,
  listBySpecialist,
  photo,
  defaultPhoto,
  newLesson,
  listPublished,
  listPopular,
  listCurrencies,
  listPendingApproval
}
