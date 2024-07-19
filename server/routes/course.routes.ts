import express from 'express'
import courseCtrl from '../controllers/course.controller'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'

const router = express.Router()

router.route('/api/courses/categories')
  .get(courseCtrl.listCategories)

router.route('/api/courses/currencies')
  .get(courseCtrl.listCurrencies)

router.route('/api/courses/published')
  .get(courseCtrl.listPublished)

router.route('/api/courses/pending')
  .get(authCtrl.requireSignin, authCtrl.isAdmin, courseCtrl.listPendingApproval)

router.route('/api/courses/popular')
  .get(courseCtrl.listPopular)
  
router.route('/api/courses/by/:userId')
  .post(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.isSpecialist, courseCtrl.create)
  .get(authCtrl.requireSignin, authCtrl.hasAuthorization, courseCtrl.listBySpecialist)

router.route('/api/courses/photo/:courseId')
  .get(courseCtrl.photo, courseCtrl.defaultPhoto)

router.route('/api/courses/defaultphoto')
  .get(courseCtrl.defaultPhoto)

router.route('/api/courses/:courseId/lesson/new')
  .put(authCtrl.requireSignin, courseCtrl.isSpecialist, courseCtrl.newLesson)

router.route('/api/courses/:courseId')
  .get(courseCtrl.read)
  .put(authCtrl.requireSignin, courseCtrl.isSpecialist, courseCtrl.update)
  .delete(authCtrl.requireSignin, courseCtrl.isSpecialist, courseCtrl.remove)

router.param('courseId', courseCtrl.courseByID)
router.param('userId', userCtrl.userByID)

export default router
