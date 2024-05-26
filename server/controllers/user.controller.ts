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
  const user = new User(req.body)
  try {
    await user.save()
    return res.status(200).json({
      message: "Successfully signed up!",
      userId: user._id
    })
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
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
  user.hashed_password = undefined
  user.salt = undefined
  user.photo = undefined
  if(user.company) user.company.logo = undefined
  return res.json(user)
}

/** retrieve all users in DB */
const list = async (req, res) => {
  try {
    let users = await User.find().select('name surname email teacher role created')
    res.json(users)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
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
        error: "Photos could not be uploaded"
      })
    }
    let user = req.profile
    /** Extends user with primitive form fields */
    user = extend(user, fields)
    user.updated = Date.now()
    /** Extends user non-primitive compony-related form fields */
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
        if (user.company){ /**if company already associated with user in DB, removed it */
          await Company.findByIdAndRemove({_id: user.company._id}).exec()
          user.company = null
      }
    }
    /** Extends existing user non-primitive user's company logo-related form fields */
    if(files.logo){
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
      if (user.company && user.company.logo){ /**if logo already associated with company in DB, removed it */
        let company = await Company.findByIdAndUpdate({_id: user.company._id}, {logo: null}, {new: true}).exec()
        user.company = company
      }
    }

  /** Extends existing user with non-primitive user's profile photo-related form fields */
    if(files.photo){
      user.photo.data = fs.readFileSync(files.photo.path)
      user.photo.contentType = files.photo.type
    }else{
      if (user.photo){ /** if photo already associated with user in DB, removed it */
        user = await User.findByIdAndUpdate({_id: user._id}, {photo: null}, {new: true}).exec()
      }
    }
  /** Save updated user in DB */
    try {
      user =  await user.save()
      user.hashed_password = undefined
      user.salt = undefined
      user.photo = undefined
      user.company? user.company.logo = undefined: user.company = undefined 
      res.json(user)
    } catch (err) { 
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
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
      error: errorHandler.getErrorMessage(err)
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

/** check if user is teacher */
const isEducator = (req, res, next) => {
  const isEducator = req.profile && req.profile.teacher
  if (!isEducator) {
    return res.status('403').json({
      error: "User is not an teacher"
    })
  }
  next()
}

/** set cookie */
const createCookie = async (req, res) => {
  /**generate random JWT token signed with user ID and SECRET payload */
  const token = jwt.sign({
    _id: req.auth._id
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
  try {
    let response = await fetch("https://connect.stripe.com/oauth/token",
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_secret:config.stripe_test_secret_key,
        code:req.body.stripe, 
        grant_type:'authorization_code'})
    })
    response.json().then(data=>{
      console.log('stripe_data', data)
      if(data.error){
        return res.status('400').json({
          error:data.error_description
        })
      }
      req.body.stripe_seller = data 
      next()
    })
  } catch(err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
  }
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
                  error: errorHandler.getErrorMessage(err)
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
  remove,
  photo,
  defaultPhoto,
  companyLogo,
  update,
  isEducator,
  stripe_auth,
  stripeCustomer,
  createCharge
}
