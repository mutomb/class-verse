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
      return res.status('401').json({
        error: "User not found"
      })
    }

    if (!user.authenticate(req.body.password)) {
      return res.status('401').send({
        error: "Email and password don't match."
      })
    }
    /**generate random JWT token signed with user ID and SECRET payload */
    const token = jwt.sign({
      _id: user._id
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
        teacher: user.teacher,
        role: user.role
      },
      setting: setting || undefined
    })

  } catch (err) {

    return res.status('401').json({
      error: "Could not sign in"
    })

  }
}

const signout = (req, res) => {
  res.clearCookie("token") /**deletes cookie 'token'*/
  return res.status('200').json({
    message: "signed out"
  })
}

const requireSignin = expressJwt({
  secret: config.jwtSecret,
  userProperty: 'auth'  /** If client-side jwt token is valid, req.auth will be set*/
})

const hasAuthorization = (req, res, next) => {
  const authorized = req.profile && req.auth && req.profile._id == req.auth._id
  if (!(authorized)) {
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

// const checkAuth0Status = (req, res, next) => {
//     return res.status('200').json({
//       user: req.oidc.user,
//       status: req.oidc.isAuthenticated()
//     })
// }

export default {
  signin,
  signout,
  requireSignin,
  hasAuthorization,
  cookieAuth
  // checkAuth0Status
}
