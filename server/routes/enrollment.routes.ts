import express from 'express'
import enrollmentCtrl from '../controllers/enrollment.controller'
import courseCtrl from '../controllers/course.controller'
import authCtrl from '../controllers/auth.controller'

const router = express.Router()

router.route('/api/enrollment/enrolled')
  .get(authCtrl.requireSignin, enrollmentCtrl.listEnrolled)
/** TO-DO: this controller should be server-side triggered after customer validated*/  
router.route('/api/enrollment/new/:courseId')
  .post(authCtrl.requireSignin, enrollmentCtrl.findEnrollment, enrollmentCtrl.create)  

router.route('/api/enrollment/stats/:courseId')
  .get(enrollmentCtrl.enrollmentStats)

router.route('/api/enrollment/clientsSpecialist/:courseId')
  .get(authCtrl.requireSignin, enrollmentCtrl.listClientsAndSpecialist)

router.route('/api/enrollment/complete/:enrollmentId')
  .put(authCtrl.requireSignin, enrollmentCtrl.isClient, enrollmentCtrl.complete) 

router.route('/api/enrollment/:enrollmentId')
  .get(authCtrl.requireSignin, enrollmentCtrl.isClient, enrollmentCtrl.read)
  .delete(authCtrl.requireSignin, enrollmentCtrl.isClient, enrollmentCtrl.remove)

router.param('courseId', courseCtrl.courseByID)
router.param('enrollmentId', enrollmentCtrl.enrollmentByID)

export default router
