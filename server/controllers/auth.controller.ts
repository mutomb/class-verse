import {Setting, User} from '../models'
import jwt from 'jsonwebtoken'
import expressJwt from 'express-jwt'
import config from '../config/config'


const signin = async (req, res) => {
  try {
    let user = await User.findOne({
      "email": req.body.email
    })
    if (!user) {
      return res.status(401).json({
        error: "User not found"
      })
    }

    if (!user.authenticate(req.body.password)) {
      return res.status(401).send({
        error: "Email and password don't match."
      })
    }
    /**generate random JWT token signed with user ID and role payloads, and server-side SECRET */
    const token = jwt.sign({
      _id: user._id,
      role: user.role,
    }, config.jwtSecret)
    
    const setting = await Setting.findOne({
      user: user._id
    })
    return res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        specialist: user.specialist,
        role: user.role,
        stripe_seller: user.stripe_seller,
        stripe_customer: user.stripe_customer,
        shopify_seller: user.shopify_seller,
        shopify_customer: user.shopify_customer,
        paypal_seller: user.paypal_seller,
        paypal_customer: user.paypal_customer,
        active_plan: user.active_plan
      },
      setting: setting || undefined
    })

  } catch (err) {

    return res.status(401).json({
      error: errorHandler.getErrorMessage(err)? errorHandler.getErrorMessage(err): "Could not sign in"
    })

  }
}

const signout = (req, res) => {
  res.clearCookie("token") /**deletes cookie 'token'*/
  return res.status(200).json({
    message: "signed out"
  })
}

const requireSignin = expressJwt({
  secret: config.jwtSecret,
  userProperty: 'auth'  /** If client-side jwt token is valid, req.auth will be set*/
})

const hasAuthorization = (req, res, next) => {
  const authorized = (req.profile && req.auth && req.profile._id == req.auth._id) || (req.auth && req.auth.role === 'admin')
  if (!(authorized)) {
    return res.redirect(403, '/error/403/')
  }
  next()
}

const isAdmin = (req, res, next) => {
  const isAdmin = req.auth && req.auth.role === 'admin'
  if (!(isAdmin)) {
    return res.redirect(403, '/error/403/')
  }
  next()
}

const cookieAuth = async (req, res, next) => {
        /**Append authentication for next handler if cookie exist*/
        if(req.cookies && req.cookies.token){
          try{
            /**decode jwt token */
            let jwtoken = await jwt.verify(req.cookies.token, config.jwtSecret); 
            /**get logged-in user*/
            let user = await User.findById(jwtoken._id)
            if(user){
              req.jwt = {user: user, token: req.cookies.token}
            } 
          }catch(e){ /**invalid token */
            console.log(e)
            /**Delete any previously stored jwt or cookie and redirect to */
            res.clearCookie("token")
            req.url ='/error/403/'
          }
        }
        next()
}

export default {
  signin,
  signout,
  requireSignin,
  hasAuthorization,
  cookieAuth,
  isAdmin
}
