import express from 'express'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'

const router = express.Router()

router.route('/api/users')
  .get(userCtrl.list)
  .post(userCtrl.create)

router.route('/api/users/photo/:userId')
  .get(userCtrl.photo, userCtrl.defaultPhoto)

router.route('/api/users/defaultphoto')
  .get(userCtrl.defaultPhoto)
  
router.route('/api/users/:userId/company/photo/:companyId')
  .get(userCtrl.companyLogo, userCtrl.defaultPhoto)
  
router.route('/api/users/:userId')
  .get(authCtrl.requireSignin, userCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.remove)

router.route('/api/users/:userId/createcookie')
  .get(authCtrl.requireSignin, userCtrl.createCookie)
  
// router.route('/api/auth0_auth/:userId')
//   .put(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.auth0_auth, userCtrl.update)

  router.route('/api/stripe_auth/:userId')
  .put(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.stripe_auth, userCtrl.update)

router.param('userId', userCtrl.userByID)

export default router
