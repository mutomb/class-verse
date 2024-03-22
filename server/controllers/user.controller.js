import User from '../models/user.model'
import Company from '../models/company.model'
import extend from 'lodash/extend'
import errorHandler from '../helpers/dbErrorHandler'
import profileImage from '../../client/public/images/users/users-default.svg'
import fs from 'fs'
import formidable from 'formidable'
var path = require('path')

const create = async (req, res) => {
  let user = new User(req.body)
  try {
    user = await user.save()
    console.log('user created:', user.company)
    return res.status(200).json({
      message: "Successfully signed up!"
    })
  } catch (err) {
    console.log('error during user creation:', err)
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

/**
 * Load user and append to req.
 */
const userByID = async (req, res, next, id) => {
  try {
    console.log('userByID:', id)
    let user = await User.findById(id).populate('company').exec()
    console.log('userByID, populate company:', user.company)
    if (!user){
      console.log('userByID, user not found')
      return res.status('400').json({
        error: "User not found"
      })
    }
    req.profile = user
    next()
  } catch (err) {
    return res.status('400').json({
      error: "Could not retrieve user"
    })
  }
}

const read = (req, res) => {
  let user = req.profile
  console.log('user reading, company from req.profile:', user.company)
  user.hashed_password = undefined
  user.salt = undefined
  user.photo = undefined
  if(user.company) user.company.logo = undefined
  return res.json(user)
}

const list = async (req, res) => {
  try {
    let users = await User.find().select('name email updated created')
    res.json(users)
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
    console.log('client-side fields:', fields)
    console.log('client-side files:', files)

    if (err) {
      console.log('error during formidable form parsing:', err)
      return res.status(400).json({
        error: "Photos could not be uploaded"
      })
    }
    let user = req.profile
    console.log('user update, company from req.profile:', user. company)
    user = extend(user, fields)
    console.log('user update, extended, user company field:', user.company)
    user.updated = Date.now()
    if(fields.company){
      console.log('company fields:', fields.company)
      let company = JSON.parse(fields.company)
      console.log('company fields JSON string to JS object:', company)
      if (user.company){ //if company already associated with user in DB, company field has id, update company name
         company = await Company.findOneAndUpdate({_id: user.company._id}, {name:company.name}, {new: true}).exec()
         user.company = company
         console.log('updated company name attached to user as model:', user.company)
      }else{ 
        company = new Company(company)
        company= await company.save()
        user.company = company
        console.log('new company name attached to user as model:', user.company)
      }
    }else {
        if (user.company){ //if company already associated with user in DB, removed it
          await Company.findByIdAndRemove({_id: user.company._id}).exec()
          user.company = null
          console.log('removed company, null attached to user company:', user.company)
      }
    }

    if(files.logo){
      let logo = { data: fs.readFileSync(files.logo.path), contentType: files.logo.type }
      if (user.company){ //if company already associated with user updated above, update company logo
         let company = await Company.findOneAndUpdate({_id: user.company._id}, {logo:logo}, {new: true}).exec()
         user.company = company
         console.log('updated company logo attached to user as model:', user.company)
      }else{
        let company= new Company({logo:logo})
        company= await company.save()
        user.company = company
        console.log('new company logo attached to user as model:', user.company)
      }
    }else{
      if (user.company && user.company.logo){ //if logo already associated with company in DB, removed it
        let company = await Company.findByIdAndUpdate({_id: user.company._id}, {logo: null}, {new: true}).exec()
        user.company = company
        console.log('removed logo, null attached to company logo:', user.company)
      }
    }


    if(files.photo){
      user.photo.data = fs.readFileSync(files.photo.path)
      user.photo.contentType = files.photo.type
      console.log('photo file attached to user:', user.photo)
    }else{
      if (user.photo){ //if photo already associated with user in DB, removed it
        user = await User.findByIdAndUpdate({_id: user._id}, {photo: null}, {new: true}).exec()
        console.log('removed photo, null attached to company photo:', user.company)
      }
    }

    try {
      user =  await user.save()
      console.log('user updated in DB, company:', user.company)
      user.hashed_password = undefined
      user.salt = undefined
      user.photo = undefined
      user.company? user.company.logo = undefined: user.company = undefined 
      console.log('user update sent to client, company:', user.company)
      res.json(user)
    } catch (err) { 
      console.log('error during DB update')
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
  })
}

const remove = async (req, res) => {
  try {
    let user = req.profile
    let deletedUser = await user.remove()
    deletedUser.hashed_password = undefined
    deletedUser.salt = undefined
    res.json(deletedUser)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const photo = (req, res, next) => {
  console.log('user photo request, company:', req.profile.company)
  if(req.profile.photo && req.profile.photo.contentType && req.profile.photo.data){
    res.set("Content-Type", req.profile.photo.contentType)
    return res.send(req.profile.photo.data)
  }
  next()
}

const companyLogo = (req, res, next) => {
  console.log('company photo request, company:', req.profile.company)
  if(req.profile.company && req.profile.company.logo && req.profile.company.logo.contentType && req.profile.company.logo.data){
    console.log('company photo request, logo found company:', req.profile.company)
    res.set("Content-Type", req.profile.company.logo.contentType)
    return res.send(req.profile.company.logo.data)
  }
  next()
}

const defaultPhoto = (req, res) => {
  console.log('user default photo request')
  res.set("Access-Control-Expose-Headers","defaultPhoto")
  res.set({"defaultPhoto": true})
  return res.sendFile(path.resolve(process.cwd()+profileImage))
}


const isEducator = (req, res, next) => {
  const isEducator = req.profile && req.profile.teacher
  if (!isEducator) {
    return res.status('403').json({
      error: "User is not an teacher"
    })
  }
  next()
}

export default {
  create,
  userByID,
  read,
  list,
  remove,
  photo,
  defaultPhoto,
  companyLogo,
  update,
  isEducator
}
