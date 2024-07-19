import {User, Company} from '../models'
import jwt from 'jsonwebtoken'
import extend from 'lodash/extend'
import errorHandler from '../helpers/dbErrorHandler'
import profileImage from '../../client/public/images/users/users-default.svg'
import fs from 'fs'
import formidable from 'formidable'
import config from '../config/config'
import { convertToUSD } from '../helpers'
import stripe from 'stripe'
import path from 'path'

const myStripe = new stripe(config.stripe_test_secret_key)
/** create new user record */
const create = async (req, res) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "user could not be created"
      })
    }
    let user = new User(fields)
    if(fields.specialist && !files.qualification && !files.resume) return res.status(400).json({error: "Please upload your Resume/Qualification"})
    if(files.resume){
      user.resume = {data: fs.readFileSync(files.resume.path), contentType: files.resume.type}
    }
    if(files.qualification){
      user.qualification = {data: fs.readFileSync(files.qualification.path), contentType: files.qualification.type}
    }
  /** Save new user in DB */
    try {
      user =  await user.save()
      user.hashed_password = undefined
      user.salt = undefined
      user.photo = undefined
      user.resume = undefined
      user.qualification = undefined
      user.company? user.company.logo = undefined: user.company = undefined 
      return res.status(200).json({
        message: "Successfully signed up!",
        userId: user._id
      })
    } catch (err) { 
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)? errorHandler.getErrorMessage(err): err
      })
    }
  })
}

/**
 * Gets a user from DB and attaches it to request object so that it can be accessed by  next few methods
 */
const userByID = async (req, res, next, id) => {
  try {
    let user = await User.findById(id).populate('company').exec()
    if (!user){
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
/** retreive single user from DB */
const read = (req, res) => {
  let user = req.profile
  if(user){
    user.hashed_password = undefined
    user.salt = undefined
    user.photo = undefined
    user.resume = undefined
    user.qualification = undefined
    if(user.company) user.company.logo = undefined
    return res.json(user)
  }
  return res.status('400').json({
    error: "Could Read user"
  })
}

/** retrieve all users in DB */
const list = async (req, res) => {
  try {
    let select = '_id name surname specialist role skills experience rating company resume_status qualification_status active_plan complied'
    if (req.auth && req.auth.role === 'admin') select += ' email active_plan' 
    let users = await User.find({}).select(select)
    res.json(users)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)? errorHandler.getErrorMessage(err): err
    })
  }
}
/** retrieve all Specialist */
const listSpecialists = async (req, res) => {
  let select = '_id name surname specialist role skills experience rating company resume_status qualification_status active_plan complied'
  if (req.auth && req.auth.role === 'admin') select += ' email active_plan' 
  try {
    let users = await User.find({specialist: true, role: { "$ne": 'admin'}}).select(select)
    res.json(users)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)? errorHandler.getErrorMessage(err): err
    })
  }
}
const listAdmins = async (req, res) => {
  let select = '_id name surname specialist role skills experience rating company resume_status qualification_status active_plan complied'
  if (req.auth && req.auth.role === 'admin') select += ' email active_plan' 
  try {
    let users = await User.find({specialist: true, role: 'admin'}).select(select)
    res.json(users)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)? errorHandler.getErrorMessage(err): err
    })
  }
}

/** retrieve all Clients*/
const listClients = async (req, res) => {
  let select = '_id name surname specialist role skills experience rating company resume_status qualification_status active_plan complied'
  if (req.auth && req.auth.role === 'admin') select += ' email active_plan' 
  try {
    let users = await User.find({specialist: false}).select(select)
    res.json(users)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)? errorHandler.getErrorMessage(err): err
    })
  }
}
/** retrieve all approved Specialists*/
const listApprovedSpecialists = async (req, res) => {
  let select = '_id name surname specialist role skills experience rating company resume_status qualification_status active_plan complied'
  if (req.auth && req.auth.role === 'admin') select += ' email active_plan' 
  try {
    let users = await User.find({specialist: true, $or: [{resume_status: 'approved'}, {qualification_status: 'approved'}]}).select(select)
    res.json(users)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)? errorHandler.getErrorMessage(err): err
    })
  }
}
/** retrieve all users with not approved resume or qualifications */
const listPendingResumeQualification = async (req, res) => {
  let select = '_id name surname specialist role skills experience rating company resume_status qualification_status active_plan complied'
  if (req.auth && req.auth.role === 'admin') select += ' email active_plan'
  try {
    let users = await User.find({$or: [{resume_status: { "$ne": 'approved'}}, {qualification_status: { "$ne": 'approved'}}]}).sort({'created': -1}).select(select).exec()
    res.json(users)
  }catch (err){
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)? errorHandler.getErrorMessage(err): err
    })
  }
}

/** update user in DB */
const update = async (req, res) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "User could not be updated"
      })
    }
    let user = req.profile
  /** Extends user with primitive form fields */
    user = extend(user, fields)
    user.updated = Date.now()
    if(req.stripe_seller){
      user.stripe_seller = req.stripe_seller
    }
    if(fields.skills){
      user.skills = JSON.parse(fields.skills)
    }
  /** Extends user non-primitive company-related form fields */
    if(fields.company){
      let company = JSON.parse(fields.company)
      if (user.company){ /**if company already associated with user in DB, company field has id, update company name */
         company = await Company.findOneAndUpdate({_id: user.company._id}, {name:company.name}, {new: true}).exec()
         user.company = company
      }else{ 
        company = new Company(company)
        company= await company.save()
        user.company = company
      }
    }else {
        if (user.company){ /**if company already associated with user in DB, remove it */
          await Company.findByIdAndRemove({_id: user.company._id}).exec()
          user.company = null
      }
    }
  /** Extends existing user non-primitive user's company logo-related form fields */
    if(files.logo && files.logo.path && files.logo.type){
      let logo = { data: fs.readFileSync(files.logo.path), contentType: files.logo.type }
      if (user.company){ /**if company already associated with user updated above, update company logo */
         let company = await Company.findOneAndUpdate({_id: user.company._id}, {logo:logo}, {new: true}).exec()
         user.company = company
      }else{
        let company= new Company({logo:logo})
        company= await company.save()
        user.company = company
      }
    }else{
      /**if logo already associated with company in DB and logo fields is null(deleted), removed it */
      if (user.company && user.company.logo && fields.logo && (fields.logo === null || fields.logo === 'null')){
        let company = await Company.findByIdAndUpdate({_id: user.company._id}, {logo: null}, {new: true}).exec()
        user.company = company
      }
    }
  /** Extends existing user with non-primitive user's profile photo-related form fields */
    if(files.photo && files.photo.path && files.photo.type){
      user.photo = { data: fs.readFileSync(files.photo.path), contentType: files.photo.type }
    }else{
      /** if photo already associated with user in DB  and photo fields is null(deleted, removed it */
      if(fields.photo && user.photo && (fields.photo === null || fields.photo === 'null')){
        user = await User.findByIdAndUpdate({_id: user._id}, {photo: null}, {new: true}).exec()
      }
    }
    if(files.resume){
      user.resume = {data: fs.readFileSync(files.resume.path), contentType: files.resume.type}
    }
    if(files.qualification){
      user.qualification = {data: fs.readFileSync(files.qualification.path), contentType: files.qualification.type}
    }
  /** Save updated user in DB */
    try {
      user =  await user.save()
      user.hashed_password = undefined
      user.salt = undefined
      user.photo = undefined
      user.resume = undefined
      user.qualification = undefined
      user.company? user.company.logo = undefined: user.company = undefined 
      res.json(user)
    } catch (err) { 
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)? errorHandler.getErrorMessage(err): err
      })
    }
  })
}
/** remove user form DB */
const remove = async (req, res) => {
  try {
    let user = req.profile
    let deletedUser = await user.remove()
    deletedUser.hashed_password = undefined
    deletedUser.salt = undefined
    res.json(deletedUser)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)? errorHandler.getErrorMessage(err): err
    })
  }
}
/** retrieve user's profile photo */
const photo = (req, res, next) => {
  if(req.profile.photo && req.profile.photo.contentType && req.profile.photo.data){
    res.set("Content-Type", req.profile.photo.contentType)
    return res.send(req.profile.photo.data)
  }
  next()
}
/** retrieve user's company logo*/
const companyLogo = (req, res, next) => {
  if(req.profile.company && req.profile.company.logo && req.profile.company.logo.contentType && req.profile.company.logo.data){
    res.set("Content-Type", req.profile.company.logo.contentType)
    return res.send(req.profile.company.logo.data)
  }
  next()
}
/**returns a user's default profile */
const defaultPhoto = (req, res) => {
  res.set("Access-Control-Expose-Headers","defaultPhoto")
  res.set({"defaultPhoto": true})
  return res.sendFile(path.resolve(process.cwd()+profileImage))
}

/** retrieve user's resume */
const resume = (req, res, next) => {
  if(req.profile.resume && req.profile.resume.contentType && req.profile.resume.data){
    res.set("Content-Type", req.profile.resume.contentType)
    return res.send(req.profile.resume.data)
  }
  next()
}
/** retrieve user's qualification */
const qualification = (req, res, next) => {
  if(req.profile.qualification && req.profile.qualification.contentType && req.profile.qualification.data){
    res.set("Content-Type", req.profile.qualification.contentType)
    return res.send(req.profile.qualification.data)
  }
  next()
}

/** check if user is specialist */
const isSpecialist = (req, res, next) => {
  const isSpecialist = req.profile && req.profile.specialist
  if (!isSpecialist) {
    return res.status('403').json({
      error: "User is not an specialist"
    })
  }
  next()
}

/** set cookie */
const createCookie = async (req, res) => {
  /**generate random JWT token signed with user ID and role payloads, and sever-side SECRET*/
  const token = jwt.sign({
    _id: req.auth._id,
    role: req.auth.role
  }, config.jwtSecret)
  /**set cookie 'token' for the client's browser*/
  const cookieExpiration = 1;
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + cookieExpiration);
  res.cookie("token", token, { 
    expires: expirationDate, /**expires after 1 day*/
    httpOnly: false, /**Default. Allows compliant client to see document.cookie.*/
    secure: false, /** Only send cookie over HTTPS/SSL. Must be set in Prod env */
    sameSite: 'strict', /**Do not receive cookies from all cross-site requests */
  })
  return res.status(200).json({message: 'Cookie created'})

}
/**Retrieve and attach stripe seller for next handler */
const stripe_auth = async (req, res, next) => {
  // req.body.stripe_seller = {stripe_user_id: 'stripe_user_id'}
  // next()
  let form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, async (err, fields, files) => {
  try {
    let response = await fetch("https://connect.stripe.com/oauth/token",
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_secret:config.stripe_test_secret_key,
        code:fields.stripe, 
        grant_type:'authorization_code'})
    })
    response.json().then(data=>{
      console.log('stripe_data', data)
      if(data && data.error){
        return res.status('400').json({
          error:data.error_description
        })
      }
      req.stripe_seller = data 
      next()
    })
  } catch(err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)? errorHandler.getErrorMessage(err): err
      })
  }
  })
}
/**Create or update a stripe stripe customer based on order details and attaches payment ID for next handler */
//https://docs.stripe.com/api/customers/update
const stripeCustomer = (req, res, next) => {
  // req.body.order.payment_id = 'payment_id'
  // next()
  if(req.profile.stripe_customer){
      //update stripe customer
      myStripe.customers.update(
        req.profile.stripe_customer,
        {source: req.body.token
        }).then((customer)=>{
        console.log('customer', customer )
        req.body.order.payment_id = customer.id
        next()
        }, (error)=>{
            return res.status(error.code).send({
              error: error.message
            })
        }).catch((err)=>{
          return res.status(400).send({
            error: err
          })
        })
  }else{
      myStripe.customers.create({
            email: req.profile.email,
            source: req.body.token
      }).then((customer) => {
          User.update({
            '_id':req.profile._id
            },
            {'$set': { 'stripe_customer': customer.id }},
            (err, user) => {
              if (err) {
                return res.status(400).send({
                  error: errorHandler.getErrorMessage(err)? errorHandler.getErrorMessage(err): err
                })
              }
              req.body.order.payment_id = customer.id
              next()
            })
      }).catch((err)=>{
        return res.status(400).send({
          error: err
        })
      })
  }
}

const createCharge = (req, res, next) => {
  // next()
  if(!req.profile.stripe_seller){
    return res.status('400').json({
      error: "Please connect your Stripe account"
    })
  }
  myStripe.tokens.create({
    customer: req.order.payment_id,
  }, {
    stripeAccount: req.profile.stripe_seller.stripe_user_id,
  }).then((token) => {
      let amount = convertToUSD(req.body.amount, req.body.currency)**100 //amount in cents
      myStripe.charges.create({
        amount: amount,
        currency: "usd",
        source: token.id,
      }, {
        stripeAccount: req.profile.stripe_seller.stripe_user_id,
      }).then((charge) => {
        next()
      })
  })
}

export default {
  create,
  userByID,
  read,
  createCookie,
  list,
  listSpecialists,
  listAdmins,
  listClients,
  listApprovedSpecialists,
  listPendingResumeQualification,
  remove,
  photo,
  defaultPhoto,
  companyLogo,
  update,
  isSpecialist,
  stripe_auth,
  stripeCustomer,
  createCharge,
  resume,
  qualification
}
