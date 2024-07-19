import express from 'express'
import anonymousCtrl from '../controllers/anonymous.controller'
import authCtrl from '../controllers/auth.controller'

const router = express.Router()

router.route('/api/anonymous')
  .get(authCtrl.requireSignin, anonymousCtrl.list)
  .post(anonymousCtrl.create)

router.route('/api/anonymous/photo/:anonymousId')
  .get(anonymousCtrl.photo, anonymousCtrl.defaultPhoto)

router.route('/api/anonymous/defaultphoto')
  .get(anonymousCtrl.defaultPhoto)
  
router.route('/api/anonymous/:anonymousId')
  .get(authCtrl.requireSignin, authCtrl.hasAuthorization, anonymousCtrl.read)
  .put(anonymousCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, anonymousCtrl.remove)
  
router.param('anonymousId', anonymousCtrl.anonymousByID)

export default router
