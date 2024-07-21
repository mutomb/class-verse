import {Anonymous} from '../models'
import errorHandler from '../helpers/dbErrorHandler'
import profileImage from '../../client/public/images/users/users-default.svg'
import formidable from 'formidable'
import path from 'path'
import extend from 'lodash/extend'

/** create new anonymous record */
const create = async (req, res) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error:errorHandler.getErrorMessage(err)? errorHandler.getErrorMessage(err): "anonymous could not be created"
      })
    }
    let anonymous = new Anonymous(fields)
  /** Save new anonymous in DB */
    try {
      anonymous =  await anonymous.save()
      return res.status(200).json(anonymous)
    } catch (err) { 
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)? errorHandler.getErrorMessage(err): err
      })
    }
  })
}

const update = async (req, res) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error:errorHandler.getErrorMessage(err)? errorHandler.getErrorMessage(err): "Anonymous could not be updated"
      })
    }
    let anonymous = req.anonymous
  /** Extends anonymous with primitive form fields */
    anonymous = extend(anonymous, fields)
    anonymous.updated = Date.now()
  /** Save updated anonymous in DB */
    try {
      anonymous =  await anonymous.save()
      res.json(anonymous)
    } catch (err) { 
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)? errorHandler.getErrorMessage(err): err
      })
    }
  })
}

/**
 * Gets a anonymous from DB and attaches it to request object so that it can be accessed by  next few methods
 */
const anonymousByID = async (req, res, next, id) => {
  try {
    let anonymous = await Anonymous.findById(id).exec()
    if (!anonymous){
      return res.status(400).json({
        error: "Anonymous not found"
      })
    }
    req.anonymous = anonymous
    next()
  } catch (err) {
    return res.status(400).json({
      error:errorHandler.getErrorMessage(err)? errorHandler.getErrorMessage(err): "Could not retrieve anonymous"
    })
  }
}
/** retreive single anonymous from DB */
const read = (req, res) => {
  let anonymous = req.anonymous
  if(anonymous){
    return res.json(anonymous)
  }
  return res.status(400).json({
    error:  "Could Read anonymous"
  })
}

/** retrieve all anonymouss in DB */
const list = async (req, res) => {
  try {
    let select = '_id email'
    let anonymouss = await Anonymous.find({}).select(select)
    res.json(anonymouss)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)? errorHandler.getErrorMessage(err): err
    })
  }
}

/** remove anonymous form DB */
const remove = async (req, res) => {
  try {
    let anonymous = req.anonymous
    let deletedAnonymous = await anonymous.remove()
    res.json(deletedAnonymous)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)? errorHandler.getErrorMessage(err): err
    })
  }
}
/** retrieve anonymous's profile photo */
const photo = (req, res, next) => {
  if(req.anonymous.photo && req.anonymous.photo.contentType && req.anonymous.photo.data){
    res.set("Content-Type", req.anonymous.photo.contentType)
    return res.send(req.anonymous.photo.data)
  }
  next()
}

/**returns a anonymous's default profile */
const defaultPhoto = (req, res) => {
  res.set("Access-Control-Expose-Headers","defaultPhoto")
  res.set({"defaultPhoto": true})
  return res.sendFile(path.resolve(process.cwd()+profileImage))
}

export default {
  create,
  anonymousByID,
  read,
  update,
  list,
  remove,
  photo,
  defaultPhoto,
}
