import express from 'express'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'
import settingCtrl from '../controllers/setting.controller'

const router = express.Router()

router.route('/api/setting/:userId')
  .post(authCtrl.requireSignin, settingCtrl.create)
  .put(authCtrl.requireSignin, settingCtrl.update)
  .get(authCtrl.requireSignin, settingCtrl.read)


router.param('userId', userCtrl.userByID)

export default router
