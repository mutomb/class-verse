import {Order, CartItem} from '../models'
import errorHandler from '../helpers/dbErrorHandler'

const create = async (req, res) => {
  try {
    req.body.order.user = req.profile
    const order = new Order(req.body.order)
    let result = await order.save()
    res.status(200).json(result)
  } catch (err){
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)? errorHandler.getErrorMessage(err): err
    })
  }
}

const update = async (req, res) => {
  try {
    let order = await Order.update({'courses._id':req.body.cartItemId}, {'$set': {
        'courses.$.status': req.body.status
    }})
      res.json(order)
  } catch (err){
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)? errorHandler.getErrorMessage(err): err
    })
  }
}

const getStatusValues = (req, res) => {
  res.json(CartItem.schema.path('status').enumValues)
}

const orderByID = async (req, res, next, id) => {
  try {
    let order = await Order.findById(id).populate('courses.course', 'title price currency').exec()
    if (!order)
      return res.status('400').json({
        error: "Order not found"
      })
    req.order = order
    next()
  } catch (err){
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)? errorHandler.getErrorMessage(err): err
    })
  }
}

const listByUser = async (req, res) => {
  try{
    let orders = await Order.find({ "user": req.profile._id })
        .sort('-created')
        .exec()
    res.json(orders)
  } catch (err){
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)? errorHandler.getErrorMessage(err): err
    })
  }
}

const listBySpecialist = async (req, res) => {
  try {
    let orders = await Order.find({"courses.course.specialist": req.profile._id})
      .populate({path: 'courses.course', select: '_id title price currency specialist'})
      .sort('-created')
      .exec()
    res.json(orders)
  } catch (err){
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)? errorHandler.getErrorMessage(err): err
    })
  }
}

const read = (req, res) => {
  let order = req.order
  if(order){
    return res.json(order)
  }
  return res.status(400).json({
    error: 'Could not Read Order'
  })
}

export default {
  create,
  update,
  getStatusValues,
  orderByID,
  listByUser,
  listBySpecialist,
  read
}
