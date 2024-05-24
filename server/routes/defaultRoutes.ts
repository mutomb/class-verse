import express from 'express'
import authCtrl from '../controllers/auth.controller'
import settingCtrl from '../controllers/setting.controller'

const router = express.Router()

router.route('*').get(authCtrl.cookieAuth, settingCtrl.setting)

export default router
