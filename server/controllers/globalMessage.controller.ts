import {GlobalMessage} from '../models';
import errorHandler from '../helpers/dbErrorHandler'
import formidable from 'formidable'
import fs from 'fs'
/**POST new group messages */
const create = async (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(400).json({
            error: errorHandler.getErrorMessage(err)? errorHandler.getErrorMessage(err):"Global Message could not be created"
            })
        }
        let message = new GlobalMessage(fields)
        message.from = req.auth._id
        if(files.photo){
            message.photo = {data: fs.readFileSync(files.photo.path), contentType: files.photo.type}
        }
        try {
            message =  await message.save()
            message.photo = undefined
            req.io.sockets.emit(`messages`, message);
            res.json({ message: 'Global Message Created' });
        } catch (err) { 
            return res.status(400).json({
            error: errorHandler.getErrorMessage(err)? errorHandler.getErrorMessage(err): err? errorHandler.getErrorMessage(err): err
        })
    }
    })
};
const createByCourse = async (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(400).json({
            error:errorHandler.getErrorMessage(err)? errorHandler.getErrorMessage(err): "Global Message could not be created"
            })
        }
        let message = new GlobalMessage(fields)
        message.course = req.course._id 
        message.from = req.auth._id
        if(files.photo){
            message.photo = {data: fs.readFileSync(files.photo.path), contentType: files.photo.type}
        }
        try {
            message =  await message.save()
            message.photo = undefined
            if(req.course){
                req.io.sockets.emit(`messages-${req.course._id}`, {...message, global: true});
            }
            res.json({ message: 'Global Message Created' });
        } catch (err) { 
            return res.status(400).json({
            error: errorHandler.getErrorMessage(err)? errorHandler.getErrorMessage(err): err? errorHandler.getErrorMessage(err): err
        })
    }
    })
};
/**
 * GET all group messages
 * $lookup aggregation stage (using MongoDB aggregation Framework) populate GloabalMessage.from with users renaming the it as GlobalMessage.fromObj performing left outer join, adding documents to “joined” collection where localField (of GlobalMessage) and ForeignField (of Users) match. Similar to Mongoose populate or Relational DB UserGlobalMessage mapping table
 * project stage (using MongoDB $project stage) filters off password and documnet version and created date.
*/
const list = async (req, res) =>{
    GlobalMessage.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'from',
                foreignField: '_id',
                as: 'fromObj',
            },
        },
    ])
        .project({
            'fromObj.password': 0,
            'fromObj.photo': 0,
            'fromObj.email': 0,
            'fromObj.resume': 0,
            'fromObj.resume_status': 0,
            'fromObj.qualification': 0,
            'fromObj.qualification_status': 0,
            'fromObj.rating': 0,
            'fromObj.hashed_password': 0,
            'fromObj.salt': 0,
            'fromObj.updated': 0,
            'fromObj.complied': 0,
            'fromObj.experience': 0,
            'fromObj.skills': 0,
            'fromObj.company': 0,
            'fromObj.google_user': 0,
            'fromObj.github_user': 0,
            'fromObj.stripe_seller': 0,
            'fromObj.stripe_customer': 0,
            'fromObj.shopify_seller': 0,
            'fromObj.shopify_customer': 0,
            'fromObj.paypal_seller': 0,
            'fromObj.paypal_customer': 0,
            'fromObj.active_plan': 0,
            'fromObj.upskill': 0,
            'fromObj.__v': 0,
            'fromObj.created': 0,
            'photo': 0
        })
        .exec((err, messages) => {
            if (err) {
                console.log(err)
                return res.status(400).json({
                    error: err
                })
            } else {
                res.json(messages);
            }
        });
}
const listByCourse= async (req, res) =>{
    GlobalMessage.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'from',
                foreignField: '_id',
                as: 'fromObj',
            },
        },
    ])  .match({course: req.course._id })
        .project({
            'fromObj.password': 0,
            'fromObj.photo': 0,
            'fromObj.email': 0,
            'fromObj.resume': 0,
            'fromObj.resume_status': 0,
            'fromObj.qualification': 0,
            'fromObj.qualification_status': 0,
            'fromObj.rating': 0,
            'fromObj.hashed_password': 0,
            'fromObj.salt': 0,
            'fromObj.updated': 0,
            'fromObj.complied': 0,
            'fromObj.experience': 0,
            'fromObj.skills': 0,
            'fromObj.company': 0,
            'fromObj.google_user': 0,
            'fromObj.github_user': 0,
            'fromObj.stripe_seller': 0,
            'fromObj.stripe_customer': 0,
            'fromObj.shopify_seller': 0,
            'fromObj.shopify_customer': 0,
            'fromObj.paypal_seller': 0,
            'fromObj.paypal_customer': 0,
            'fromObj.active_plan': 0,
            'fromObj.upskill': 0,
            'fromObj.__v': 0,
            'fromObj.created': 0,
            'photo': 0
        })
        .exec((err, messages) => {
            if (err) {
                console.log(err)
                return res.status(400).json({
                    error: err
                })
            } else {
                res.json(messages);
            }
        });
}
const lastGlobalByCourse= async (req, res) =>{
    GlobalMessage.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'from',
                foreignField: '_id',
                as: 'fromObj',
            },
        },
    ])  .match({course: req.course._id })
        .project({
            'fromObj.password': 0,
            'fromObj.photo': 0,
            'fromObj.email': 0,
            'fromObj.resume': 0,
            'fromObj.resume_status': 0,
            'fromObj.qualification': 0,
            'fromObj.qualification_status': 0,
            'fromObj.rating': 0,
            'fromObj.hashed_password': 0,
            'fromObj.salt': 0,
            'fromObj.updated': 0,
            'fromObj.complied': 0,
            'fromObj.experience': 0,
            'fromObj.skills': 0,
            'fromObj.company': 0,
            'fromObj.google_user': 0,
            'fromObj.github_user': 0,
            'fromObj.stripe_seller': 0,
            'fromObj.stripe_customer': 0,
            'fromObj.shopify_seller': 0,
            'fromObj.shopify_customer': 0,
            'fromObj.paypal_seller': 0,
            'fromObj.paypal_customer': 0,
            'fromObj.active_plan': 0,
            'fromObj.upskill': 0,
            'fromObj.__v': 0,
            'fromObj.created': 0,
            'photo': 0
        })
        .exec((err, messages) => {
            if (err) {
                console.log(err)
                return res.status(400).json({
                    error: err
                })
            } else {
                res.json((messages && messages.length>0)?messages[messages.length-1]: {});
            }
        });
}
export default {list, listByCourse, create, createByCourse, lastGlobalByCourse}