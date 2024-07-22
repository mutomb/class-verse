import {Media, Course, User} from '../models'
import extend from 'lodash/extend'
import errorHandler from './../helpers/dbErrorHandler'
import formidable from 'formidable'
import fs from 'fs'
import mongoose from 'mongoose'

let gridfs = null
mongoose.connection.on('connected', () => {
  gridfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db)
})

const create = (req, res) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)? errorHandler.getErrorMessage(err):"Video could not be uploaded"
        })
      }
      let media = new Media(fields)
      media.postedBy= req.profile
      if(files.cover && files.cover.path && files.cover.type){
        media.cover = {data: fs.readFileSync(files.cover.path), contentType: files.cover.type}
      }
      if(files.video){
        let writestream = gridfs.openUploadStream(media._id, {
          contentType: files.video.type || 'binary/octet-stream'})
        fs.createReadStream(files.video.path).pipe(writestream)
      }
      if(fields.lesson && fields.course) { /** for lessons */
        try {
          let course = await Course.findById(fields.course)
          if(!course){
            return res.status(400).json({
              error: "Course not found"
            })
          }
          course.lessons.id(fields.lesson).media = media._id
          await course.save()
        } catch (err) {
            return res.status(400).json({
              error: errorHandler.getErrorMessage(err)? errorHandler.getErrorMessage(err): err
            })
        }
      }
      if(!fields.lesson && fields.course) { /** for  course preview */
        try {
          let course = await Course.findById(fields.course)
          if(!course){
            return res.status(400).json({
              error: "Course not found"
            })
          }
          course.media = media._id
          await course.save()
        } catch (err) {
            return res.status(400).json({
              error: errorHandler.getErrorMessage(err)? errorHandler.getErrorMessage(err): err
            })
        }
      }
      try {
        let result = await media.save()
        result.cover = undefined
        res.status(200).json(result)
      }
      catch (err){
          return res.status(400).json({
            error: errorHandler.getErrorMessage(err)? errorHandler.getErrorMessage(err): err
          })
      }
    })
}
/** Attaches media (meta) and file (video) to req for next handlers */
const mediaByID = async (req, res, next, id) => {
  try{
  let media = await Media.findById(id).populate('postedBy', '_id name').exec()
    if (!media){
      return res.status(400).json({
        error: "Media not found"
      })
    }
    req.media = media
    let files = await gridfs.find({filename:media._id}).toArray()
      if (!files[0]) {
        return res.status(404).send({
          error: 'No video found'
        })
      }     
      req.file = files[0]
      next()
    }catch(err) {
      return res.status(404).send({
        error: 'Could not retrieve media file'
      })
    }
}

const video = (req, res) => {
  const range = req.headers["range"]
  if (range && typeof range === "string") {
    const parts = range.replace(/bytes=/, "").split("-")
    const partialstart = parts[0]
    const partialend = parts[1]

    const start = parseInt(partialstart, 10)
    const end = partialend ? parseInt(partialend, 10) : req.file.length - 1
    const chunksize = (end - start) + 1

    res.writeHead(206, {
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Range': 'bytes ' + start + '-' + end + '/' + req.file.length,
        'Content-Type': req.file.contentType
    })

    let downloadStream = gridfs.openDownloadStream(req.file._id, {start, end: end+1})
    downloadStream.pipe(res)
    downloadStream.on('error', () => {
      res.sendStatus(404)
    })
    downloadStream.on('end', () => {
      res.end()
    })
  } else {
      res.header('Content-Length', req.file.length)
      res.header('Content-Type', req.file.contentType)

      let downloadStream = gridfs.openDownloadStream(req.file._id)
      downloadStream.pipe(res)
      downloadStream.on('error', () => {
        res.sendStatus(404)
      })
      downloadStream.on('end', () => {
        res.end()
      })
  }
}

const photo = (req, res, next) => {
  if(req.media.cover.data && req.media.cover.contentType){
    res.set("Content-Type", req.media.cover.contentType)
    return res.send(req.media.cover.data)
  }
  return res.status(400).json({
    error: 'Media cover image not found'
  })
}
const listPopular = async (req, res) => {
  try{
    let media = await Media.find({}).limit(9)
    .populate('postedBy', '_id name')
    .sort('-views')
    .exec()
    res.json(media)
  } catch(err){
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)? errorHandler.getErrorMessage(err): err
    })
  }
}

const listAdmin = async (req, res) => {
  try{
    let admin = await User.findOne({'role': 'admin'}).exec()
    if(!admin) {
      return res.status(400).json({
        error: 'List Admin Not found'
      })
    }
    let media = await Media.find({'postedBy': admin._id}).populate('postedBy', '_id name').select('-cover').exec()
    res.json(media)
  } catch(err){
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)? errorHandler.getErrorMessage(err): err
    })
  }
}

const listByUser = async (req, res) => {
  try{
    let media = await Media.find({postedBy: req.profile._id})
      .populate('postedBy', '_id name')
      .select('-cover')
      .sort('-created')
      .exec()
    res.json(media)
  } catch(err){
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)? errorHandler.getErrorMessage(err): err
      })
  }
}

const read = (req, res) => {
  let media=req.media
  if(media){
    media.cover = undefined
    return res.json(media)
  }
  res.status(400).json({error: 'Could not Read Media. Try again later.'})
}

const incrementViews = async (req, res, next) => {
  try {
    await Media.findByIdAndUpdate(req.media._id, {$inc: {"views": 1}}, {new: true}).exec()
    next()
  } catch(err){
      return res.status(400).json({
          error: errorHandler.getErrorMessage(err)? errorHandler.getErrorMessage(err): err
      })
  }
}

const update = async (req, res) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true
  console.log('passed')
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)? errorHandler.getErrorMessage(err):"Video could not be updated"
      })
    }
    let media = req.media
    console.log('req.media', media)
    media = extend(media, fields)
    console.log('media', media)
    media.updated = Date.now()
    if(files.cover && files.cover.path && files.cover.type){
      media.cover = {data: fs.readFileSync(files.cover.path), contentType: files.cover.type}
    }else{
      if(fields.cover && media.cover && (fields.cover === null || fields.cover === 'null')){
        media = await Media.findByIdAndUpdate({_id: media._id}, {cover: null}, {new: true}).exec()
      }
    }
    if(files.video){
      gridfs.delete(req.file._id) /**Delete all fs files and chunks, then upload new ones but using previous mediaID filename*/
      let writestream = gridfs.openUploadStream(media._id, {
        contentType: files.video.type || 'binary/octet-stream'})
      fs.createReadStream(files.video.path).pipe(writestream)
    }
    try {
      await media.save()
      media.cover.cover = undefined
      console.log('result', media)
      res.status(200).json(media)
    }
    catch (err){
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)? errorHandler.getErrorMessage(err): err
      })
    }
  })
}

const isPoster = (req, res, next) => {
  let isPoster = (req.media && req.auth && req.media.postedBy._id == req.auth._id) || (req.auth && req.auth.role === 'admin')
  if(!isPoster){
    return res.status(403).json({
      error: "User is not authorized"
    })
  }
  next()
}

const remove = async (req, res) => {
  try {
    let media = req.media
    let deletedMedia = await media.remove()
    gridfs.delete(req.file._id)
    if(req.course){
      try {
        let course = req.course
        for (let i=0; i<course.lessons.length; i++){
          if(course.lessons[i].media && String(course.lessons[i].media._id) === String(req.media._id)){
            course.lessons[i].media=null
          }
        }
        if(course.media && String(course.media._id) === String(req.media._id)){
          course.media=null
        }
        await course.save()
      } catch (err) {
          return res.status(400).json({
            error: errorHandler.getErrorMessage(err)? errorHandler.getErrorMessage(err): err
          })
      }
    }
    res.json(deletedMedia)
  } catch(err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)? errorHandler.getErrorMessage(err): err
    })
  }
}

const listRelated = async (req, res) => {
  try {
    let media = await Media.find({ "_id": { "$ne": req.media }, $or: [{"genre": req.media.genre},{"postedBy": req.media.postedBy},  {"title": {'$regex': req.media.title, '$options': "i"}} ]})
      .limit(4)
      .sort('-views')
      .populate('postedBy', '_id name')
      .exec()
    res.json(media)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)? errorHandler.getErrorMessage(err): err
    })
  }
}

export default {
  create,
  mediaByID,
  video,
  photo,
  listPopular,
  listByUser,
  read,
  incrementViews,
  update,
  isPoster,
  remove,
  listRelated,
  listAdmin
}
