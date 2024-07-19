import express from 'express'
import authCtrl from '../controllers/auth.controller'
import userCtrl from '../controllers/user.controller'
import anonymousCtrl from '../controllers/anonymous.controller'
import courseCtrl from '../controllers/course.controller'
import globalMessageCtrl from '../controllers/globalMessage.controller'
import conversationCtrl from '../controllers/conversation.controller'

const router = express.Router()
router.route("/api/messages")
  .post(authCtrl.requireSignin, conversationCtrl.create_update)
router.route("/api/messages/course/:courseId")
  .post(authCtrl.requireSignin, conversationCtrl.create_updateByCourse)
router.route("/api/messages/bot")
  .post(conversationCtrl.create_update_bot)

router.route("/api/messages/conversations")
  .get(authCtrl.requireSignin, conversationCtrl.list)
router.route("/api/messages/conversations/course/:courseId")
  .get(authCtrl.requireSignin, conversationCtrl.listByCourse)
router.route("/api/messages/conversations/bot")
  .get(authCtrl.requireSignin, conversationCtrl.list_bot)

router.route("/api/messages/conversations/:userId")
  .get(authCtrl.requireSignin, conversationCtrl.read)
router.route("/api/messages/conversations/:userId/course/:courseId")
  .get(authCtrl.requireSignin, conversationCtrl.readByCourse)
router.route("/api/messages/conversations/bot/user/:userId/anonymous/:anonymousId")
  .get(conversationCtrl.read_bot)

router.route("/api/messages/global")
  .get(globalMessageCtrl.list)
  .post(authCtrl.requireSignin, globalMessageCtrl.create)
router.route("/api/messages/global/course/:courseId")
  .get(globalMessageCtrl.listByCourse)
  .post(authCtrl.requireSignin, globalMessageCtrl.createByCourse)
  
router.route("/api/messages/global/course/:courseId/lastMessage")
  .get(globalMessageCtrl.lastGlobalByCourse)

router.param('userId', userCtrl.userByID)
router.param('courseId', courseCtrl.courseByID)
router.param('anonymousId', anonymousCtrl.anonymousByID)

export default router
