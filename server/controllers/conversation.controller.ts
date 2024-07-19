import mongoose from 'mongoose';
import {Message, Conversation} from '../models';
import errorHandler from '../helpers/dbErrorHandler'
import formidable from 'formidable'
import fs from 'fs'
/**
 *Post private message by atomically creating the message and creating/updating the related conversation with the last message (this message)
 *$all MongoBD array expression filters conversation to include on those that include the logged in user and other user in the recipients array
 * The upsert MongoDb option creates new conversation based on to and from IDs if none is found
 * Only response with the new message (last message)'s body, notifying clients that new message was created  
 * 
 * */ 
 const create_update = async (req, res) =>  {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Conversation could not be created"
            })
        }
        let from = mongoose.Types.ObjectId(req.auth._id);
        let to = mongoose.Types.ObjectId(fields.to);
        Conversation.findOneAndUpdate(
            {
                recipients: {
                    $all: [
                        { $elemMatch: { $eq: from } },
                        { $elemMatch: { $eq: to } },
                    ],
                },
            },
            {
                recipients: [req.auth._id, fields.to],
                lastMessage: fields.body,
                date: Date.now(),
            },
            { upsert: true, new: true, setDefaultsOnInsert: true },
            function(err, conversation) {
                if (err) {
                    console.log(err)
                    return res.status(400).json({
                        error: errorHandler.getErrorMessage(err) || err
                    })
                } else {
                    let message = new Message({
                        conversation: conversation._id,
                        to: fields.to,
                        from: req.auth._id,
                        body: fields.body,
                        
                    });
                    if(files.photo){
                        message.photo = {data: fs.readFileSync(files.photo.path), contentType: files.photo.type}
                    }
                    message.save(err => {
                        if (err) {
                            console.log(err)
                            return res.status(400).json({
                                error: errorHandler.getErrorMessage(err) || err
                            })
                        } else {
                            req.io.sockets.emit(`messages`, fields.body);
                            return res.json({
                                message: 'Success',
                                conversationId: conversation._id
                            })
                        }
                    });
                }
            }
        );
    })
}
const create_updateByCourse = async (req, res) =>  {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Conversation could not be created"
            })
        }
        let from = mongoose.Types.ObjectId(req.auth._id);
        let to = mongoose.Types.ObjectId(fields.to);
        let course = mongoose.Types.ObjectId(req.course._id);
        Conversation.findOneAndUpdate(
            {
                recipients: {
                    $all: [
                        { $elemMatch: { $eq: from } },
                        { $elemMatch: { $eq: to } },
                    ],
                },
                course: course
            },
            {
                recipients: [req.auth._id, fields.to],
                lastMessage: fields.body,
                date: Date.now(),
            },
            { upsert: true, new: true, setDefaultsOnInsert: true },
            function(err, conversation) {
                if (err) {
                    console.log(err)
                    return res.status(400).json({
                        error: errorHandler.getErrorMessage(err) || err
                    })
                } else {
                    let message = new Message({
                        conversation: conversation._id,
                        to: fields.to,
                        from: req.auth._id,
                        body: fields.body,
                        course: req.course._id
                        
                    });
                    if(files.photo){
                        message.photo = {data: fs.readFileSync(files.photo.path), contentType: files.photo.type}
                    }
                    message.save(err => {
                        if (err) {
                            console.log(err)
                            return res.status(400).json({
                                error: errorHandler.getErrorMessage(err) || err
                            })
                        } else {
                            req.io.sockets.emit(`messages-${req.course._id}`, fields.body);
                            return res.json({
                                message: 'Success',
                                conversationId: conversation._id
                            })
                        }
                    });
                }
            }
        );
    })
}
const create_update_bot = async (req, res) =>  {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Conversation could not be created"
            })
        }
        let from = mongoose.Types.ObjectId(fields.from);
        let to = mongoose.Types.ObjectId(fields.to);
        Conversation.findOneAndUpdate(
            {
                recipients: {
                    $all: [
                        { $elemMatch: { $eq: from } },
                        { $elemMatch: { $eq: to } },
                    ],
                },
            },
            {
                recipients: [fields.from, fields.to],
                lastMessage: fields.body,
                date: Date.now(),
            },
            { upsert: true, new: true, setDefaultsOnInsert: true },
            function(err, conversation) {
                if (err) {
                    console.log(err)
                    return res.status(400).json({
                        error: errorHandler.getErrorMessage(err) || err
                    })
                } else {
                    let message = new Message({
                        conversation: conversation._id,
                        to: fields.to,
                        from: fields.from,
                        body: fields.body,
                        
                    });
                    if(files.photo){
                        message.photo = {data: fs.readFileSync(files.photo.path), contentType: files.photo.type}
                    }
                    message.save(err => {
                        if (err) {
                            console.log(err)
                            return res.status(400).json({
                                error: errorHandler.getErrorMessage(err) || err
                            })
                        } else {
                            req.io.sockets.emit(`messages-${fields.to}`, fields.body);
                            req.io.sockets.emit(`messages-${fields.from}`, fields.body);
                            return res.json({
                                message: 'Success',
                                conversationId: conversation._id
                            })
                        }
                    });
                }
            }
        );
    })
}

/**
 * GET private conversations list (while not chatting) where each conversation includes only conversations where logged in user is a the receiver/recepient and its last message
 * $match aggregation stage (using MongoDB aggregation Framework) filters to include only conversations where logged in user is a the receiver/recepient  populated in the previous $lookup stage
*/
const list = async (req, res) => {
    let from = mongoose.Types.ObjectId(req.auth._id);
    Conversation.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'recipients',
                foreignField: '_id',
                as: 'recipientObj',
            },
        },
    ])
        .match({ recipients: { $all: [{ $elemMatch: { $eq: from } }] } })
        .project({
            'recipientObj.password': 0,
            'recipientObj.photo': 0,
            'recipientObj.email': 0,
            'recipientObj.resume': 0,
            'recipientObj.resume_status': 0,
            'recipientObj.qualification': 0,
            'recipientObj.qualification_status': 0,
            'recipientObj.rating': 0,
            'recipientObj.hashed_password': 0,
            'recipientObj.salt': 0,
            'recipientObj.updated': 0,
            'recipientObj.complied': 0,
            'recipientObj.experience': 0,
            'recipientObj.skills': 0,
            'recipientObj.company': 0,
            'recipientObj.google_user': 0,
            'recipientObj.github_user': 0,
            'recipientObj.stripe_seller': 0,
            'recipientObj.stripe_customer': 0,
            'recipientObj.shopify_seller': 0,
            'recipientObj.shopify_customer': 0,
            'recipientObj.paypal_seller': 0,
            'recipientObj.paypal_customer': 0,
            'recipientObj.active_plan': 0,
            'recipientObj.upskill': 0,
            'recipientObj.__v': 0,
            'recipientObj.created': 0,
        })
        .exec((err, conversations) => {
            if (err) {
                console.log(err);
                return res.status(400).json({
                    error: err
                })
            } else {
                return res.json(conversations)
            }
        });
};
const listByCourse = async (req, res) => {
    let from = mongoose.Types.ObjectId(req.auth._id);
    let course = mongoose.Types.ObjectId(req.course._id);
    Conversation.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'recipients',
                foreignField: '_id',
                as: 'recipientObj',
            },
        },
    ])
        .match({ recipients: { $all: [{ $elemMatch: { $eq: from } }] }, course: course })
        .project({
            'recipientObj.password': 0,
            'recipientObj.photo': 0,
            'recipientObj.email': 0,
            'recipientObj.resume': 0,
            'recipientObj.resume_status': 0,
            'recipientObj.qualification': 0,
            'recipientObj.qualification_status': 0,
            'recipientObj.rating': 0,
            'recipientObj.hashed_password': 0,
            'recipientObj.salt': 0,
            'recipientObj.updated': 0,
            'recipientObj.complied': 0,
            'recipientObj.experience': 0,
            'recipientObj.skills': 0,
            'recipientObj.company': 0,
            'recipientObj.google_user': 0,
            'recipientObj.github_user': 0,
            'recipientObj.stripe_seller': 0,
            'recipientObj.stripe_customer': 0,
            'recipientObj.shopify_seller': 0,
            'recipientObj.shopify_customer': 0,
            'recipientObj.paypal_seller': 0,
            'recipientObj.paypal_customer': 0,
            'recipientObj.active_plan': 0,
            'recipientObj.upskill': 0,
            'recipientObj.__v': 0,
            'recipientObj.created': 0,
        })
        .exec((err, conversations) => {
            if (err) {
                console.log(err);
                return res.status(400).json({
                    error: err
                })
            } else {
                return res.json(conversations)
            }
        });
};
const list_bot = async (req, res) => {
    let to = mongoose.Types.ObjectId(req.auth._id);
    Conversation.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'recipients',
                foreignField: '_id',
                as: 'recipientObj',
            },
        },
        {
            $lookup: {
                from: 'anonymous',
                localField: 'recipients',
                foreignField: '_id',
                as: 'recipientAnonymousObj',
            },
        },
    ])
        .match({ recipients: { $all: [{ $elemMatch: { $eq: to } }] } })
        .exec((err, conversations) => {
            if (err) {
                console.log(err);
                return res.status(400).json({
                    error: err
                })
            } else {
                return res.json(conversations)
            }
        });
};
/** 
 * Get messages from conversation/private (while chatting), based on Message.to & Message.from
 * $match filters to include only messages from user1 to user2 or form user2 to user1
 * */ 
const read = async (req, res) => {
    let user1 = mongoose.Types.ObjectId(req.auth._id);
    let user2 = mongoose.Types.ObjectId(req.profile._id);
    Message.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'to',
                foreignField: '_id',
                as: 'toObj',
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'from',
                foreignField: '_id',
                as: 'fromObj',
            },
        },
    ])
        .match({
            $or: [
                { $and: [{ to: user1 }, { from: user2 }] },
                { $and: [{ to: user2 }, { from: user1 }] },
            ],
        })
        .project({
            'toObj.password': 0,
            'toObj.photo': 0,
            'toObj.email': 0,
            'toObj.resume': 0,
            'toObj.resume_status': 0,
            'toObj.qualification': 0,
            'toObj.qualification_status': 0,
            'toObj.rating': 0,
            'toObj.hashed_password': 0,
            'toObj.salt': 0,
            'toObj.updated': 0,
            'toObj.complied': 0,
            'toObj.experience': 0,
            'toObj.skills': 0,
            'toObj.company': 0,
            'toObj.google_user': 0,
            'toObj.github_user': 0,
            'toObj.stripe_seller': 0,
            'toObj.stripe_customer': 0,
            'toObj.shopify_seller': 0,
            'toObj.shopify_customer': 0,
            'toObj.paypal_seller': 0,
            'toObj.paypal_customer': 0,
            'toObj.active_plan': 0,
            'toObj.upskill': 0,
            'toObj.__v': 0,
            'toObj.created': 0,
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
const readByCourse = async (req, res) => {
    let user1 = mongoose.Types.ObjectId(req.auth._id);
    let user2 = mongoose.Types.ObjectId(req.profile._id);
    let course = mongoose.Types.ObjectId(req.course._id);
    Message.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'to',
                foreignField: '_id',
                as: 'toObj',
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'from',
                foreignField: '_id',
                as: 'fromObj',
            },
        },
    ])
        .match({
            $or: [
                { $and: [{ to: user1 }, { from: user2 }] },
                { $and: [{ to: user2 }, { from: user1 }] },
            ],
            course: course
        })
        .project({
            'toObj.password': 0,
            'toObj.photo': 0,
            'toObj.email': 0,
            'toObj.resume': 0,
            'toObj.resume_status': 0,
            'toObj.qualification': 0,
            'toObj.qualification_status': 0,
            'toObj.rating': 0,
            'toObj.hashed_password': 0,
            'toObj.salt': 0,
            'toObj.updated': 0,
            'toObj.complied': 0,
            'toObj.experience': 0,
            'toObj.skills': 0,
            'toObj.company': 0,
            'toObj.google_user': 0,
            'toObj.github_user': 0,
            'toObj.stripe_seller': 0,
            'toObj.stripe_customer': 0,
            'toObj.shopify_seller': 0,
            'toObj.shopify_customer': 0,
            'toObj.paypal_seller': 0,
            'toObj.paypal_customer': 0,
            'toObj.active_plan': 0,
            'toObj.upskill': 0,
            'toObj.__v': 0,
            'toObj.created': 0,
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
const read_bot = async (req, res) => {
    let user1 = mongoose.Types.ObjectId(req.profile._id);
    let user2 = mongoose.Types.ObjectId(req.anonymous._id);
    Message.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'to',
                foreignField: '_id',
                as: 'toObj',
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'from',
                foreignField: '_id',
                as: 'fromObj',
            },
        },
        {
            $lookup: {
                from: 'anonymous',
                localField: 'to',
                foreignField: '_id',
                as: 'toAnonymousObj',
            },
        },
        {
            $lookup: {
                from: 'anonymous',
                localField: 'from',
                foreignField: '_id',
                as: 'fromAnonymousObj',
            },
        },
    ])
        .match({
            $or: [
                { $and: [{ to: user1 }, { from: user2 }] },
                { $and: [{ to: user2 }, { from: user1 }] },
            ],
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
export default {
    list, listByCourse, list_bot,
    read, readByCourse, read_bot,
    create_update, create_updateByCourse, create_update_bot
}
