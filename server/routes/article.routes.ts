import express from 'express'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'
import articleCtrl from '../controllers/article.controller'
import courseCtrl from '../controllers/course.controller'

const router = express.Router()

router.route('/api/article/new/:userId')
    .post(authCtrl.requireSignin, articleCtrl.create)

router.route('/api/article/file/:articleId')
    .get(articleCtrl.file)

router.route('/api/articles')
    .get(articleCtrl.file)

router.route('/api/article/:articleId')
    .get(articleCtrl.read)
    .put(authCtrl.requireSignin, articleCtrl.isPoster, articleCtrl.update)
    .delete(authCtrl.requireSignin, articleCtrl.isPoster, articleCtrl.remove)

router.route('/api/article/:articleId/course/:courseId')
      .delete(authCtrl.requireSignin, articleCtrl.isPoster, articleCtrl.remove)

router.param('userId', userCtrl.userByID)
router.param('articleId', articleCtrl.articleByID)
router.param('courseId', courseCtrl.courseByID)
export default router
