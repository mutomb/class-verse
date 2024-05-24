import express from 'express'
import authCtrl from '../controllers/auth.controller'

const router = express.Router()

router.route('/auth/signin')
  .post(authCtrl.signin)
router.route('/auth/signout')
  .get(authCtrl.signout)
// router.route('/auth0/checkAuth0Status')
//   .get(authCtrl.checkAuth0Status)

export default router
