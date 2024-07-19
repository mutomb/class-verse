import express from 'express'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'

const router = express.Router()

router.route('/api/users')
  .get(authCtrl.requireSignin, userCtrl.list)
  .post(userCtrl.create)
router.route('/api/users/pending/resume_qualification')
  .get(authCtrl.requireSignin, authCtrl.isAdmin, userCtrl.listPendingResumeQualification)
router.route('/api/users/specialists')
  .get(userCtrl.listSpecialists)
router.route('/api/users/specialists_auth')
  .get(authCtrl.requireSignin, userCtrl.listSpecialists)
router.route('/api/users/admins')
  .get(userCtrl.listAdmins)
router.route('/api/users/admins_auth')
  .get(authCtrl.requireSignin, userCtrl.listAdmins)
router.route('/api/users/clients')
  .get(userCtrl.listClients)
router.route('/api/users/clients_auth')
  .get(authCtrl.requireSignin, userCtrl.listClients)
router.route('/api/users/approved/specialists')
  .get(userCtrl.listSpecialists)
router.route('/api/users/approved/specialists_auth')
  .get(authCtrl.requireSignin, userCtrl.listSpecialists)
router.route('/api/users/photo/:userId')
  .get(userCtrl.photo, userCtrl.defaultPhoto)
router.route('/api/users/resume/:userId')
  .get(userCtrl.resume)

router.route('/api/users/qualification/:userId')
  .get(userCtrl.qualification)  

router.route('/api/users/defaultphoto')
  .get(userCtrl.defaultPhoto)
  
router.route('/api/users/:userId/company/photo/:companyId')
  .get(userCtrl.companyLogo, userCtrl.defaultPhoto)
  
router.route('/api/users/:userId')
  .get(userCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.remove)

router.route('/api/users_auth/:userId')
  .get(authCtrl.requireSignin, userCtrl.read)

router.route('/api/users/:userId/createcookie')
  .get(authCtrl.requireSignin, userCtrl.createCookie)
  
router.route('/api/stripe_auth/:userId')
  .put(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.stripe_auth, userCtrl.update)

router.param('userId', userCtrl.userByID)

export default router
