import express from 'express'
import orderCtrl from '../controllers/order.controller'
import courseCtrl from '../controllers/course.controller'
import authCtrl from '../controllers/auth.controller'
import userCtrl from '../controllers/user.controller'

const router = express.Router()

router.route('/api/orders/:userId')
  .post(authCtrl.requireSignin, userCtrl.stripeCustomer, orderCtrl.create)
  // .post(authCtrl.requireSignin, userCtrl.stripeCustomer, courseCtrl.decreaseQuantity, orderCtrl.create)

router.route('/api/orders/user/:userId')
  .get(authCtrl.requireSignin, orderCtrl.listByUser)

router.route('/api/orders/teacher/:userId')
  .get(authCtrl.requireSignin, authCtrl.hasAuthorization, orderCtrl.listByTeacher)

router.route('/api/order/status_values')
  .get(authCtrl.requireSignin, orderCtrl.getStatusValues)

router.route('/api/order/:userId/cancel/:courseId')
  .put(authCtrl.requireSignin, courseCtrl.isTeacher, orderCtrl.update)
  // .put(authCtrl.requireSignin, courseCtrl.isTeacher, courseCtrl.increaseQuantity, orderCtrl.update)

router.route('/api/order/:orderId/charge/:userId')
  .put(authCtrl.requireSignin, courseCtrl.isTeacher, userCtrl.createCharge, orderCtrl.update)

router.route('/api/order/status/:userId')
  .put(authCtrl.requireSignin, courseCtrl.isTeacher, orderCtrl.update)

router.route('/api/order/:orderId')
  .get(authCtrl.requireSignin, orderCtrl.read)

router.param('userId', userCtrl.userByID)
router.param('courseId', courseCtrl.courseByID)
router.param('orderId', orderCtrl.orderByID)

export default router
