import {Article, Course} from '../models'
import extend from 'lodash/extend'
import errorHandler from '../helpers/dbErrorHandler'
import formidable from 'formidable'
import fs from 'fs'

const create = (req, res) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(400).json({
          error: "Ariticle could not be uploaded"
        })
      }
      let article = new Article({postedBy: req.profile})
      if(!files.article) return res.status(400).json({error: "Please upload your Article"})
      if(files.article && files.article.path && files.article.type){
        article.file = {data: fs.readFileSync(files.article.path), contentType: files.article.type}
      }
      if(fields.lesson && fields.course) {
        try {
          let course = await Course.findById(fields.course)
          course.lessons.id(fields.lesson).article = article
          await course.save()
        } catch (err) {
            return res.status(400).json({
              error: errorHandler.getErrorMessage(err)? errorHandler.getErrorMessage(err): err
            })
        }
      }
      try {
        await article.save()
        res.status(200).json(article)
      }
      catch (err){
          return res.status(400).json({
            error: errorHandler.getErrorMessage(err)? errorHandler.getErrorMessage(err): err
          })
      }
    })
}
/** Attaches article to req for next handlers */
const articleByID = async (req, res, next, id) => {
  try{
  let article = await Article.findById(id).populate('postedBy', '_id name').exec()
    if (!article)
      return res.status('400').json({
        error: "Article not found"
      })
      req.article = article
      next()
    }catch(err) {
      return res.status(404).send({
        error: 'Could not retrieve article file'
      })
    }
}
/** retreive single Article from DB */
const read = (req, res) => {
  let article = req.article
  if(article){
    article.file = undefined
    return res.json(article)
  }
  res.status(400).json({error: 'Article not found. Try again later.'})
}
/** retreive article file */
const file = (req, res) => {
  if(req.article.file && req.article.file.contentType && req.article.file.data){
    res.set("Content-Type", req.article.file.contentType)
    return res.send(req.article.file.data)
  }
  res.status(400).json({error: 'File not found. Try again later.'})
}


const update = async (req, res) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Article could not be updated"
      })
    }
    let article = req.article
    article = extend(article, fields)
    article.updated = Date.now()
    if(!files.article) return res.status(400).json({error: "Please upload your Article"})
    if(files.article){
      article.file = {data: fs.readFileSync(files.article.path), contentType: files.article.type}
    }
    try {
      await article.save()
      res.status(200).json(article)
    }
    catch (err){
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)? errorHandler.getErrorMessage(err): err
      })
    }
  })
}

const isPoster = (req, res, next) => {
  let isPoster = (req.article && req.auth && req.article.postedBy._id == req.auth._id) || (req.auth && req.auth.role === 'admin')
  if(!isPoster){
    return res.status('403').json({
      error: "User is not authorized"
    })
  }
  next()
}

const remove = async (req, res) => {
  try {
    let article = req.article
    let deletedArticle = await article.remove()
    if(req.course){
      try {
        let course = req.course
        for (let i=0; i<course.lessons.length; i++){
          if(course.lessons[i].article && String(course.lessons[i].article._id) === String(req.article._id)){
            course.lessons[i].article=null
          }
        }
        await course.save()
      } catch (err) {
          return res.status(400).json({
            error: errorHandler.getErrorMessage(err)? errorHandler.getErrorMessage(err): err
          })
      }
    }
    res.json(deletedArticle)
  } catch(err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)? errorHandler.getErrorMessage(err): err
    })
  }
}

export default {
  create,
  articleByID,
  file,
  read,
  update,
  isPoster,
  remove,
}
