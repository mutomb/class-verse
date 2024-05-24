import mongoose from 'mongoose'
const CartItemSchema = new mongoose.Schema({
  course: {type: mongoose.Schema.ObjectId, ref: 'Course'},
  quantity: Number,
  status: {type: String,
    default: 'Not processed',
    enum: ['Not processed' , 'Processing', 'Shipped', 'Delivered', 'Cancelled']}
})
const CartItem = mongoose.model('CartItem', CartItemSchema)

const OrderSchema = new mongoose.Schema({
  courses: [CartItemSchema],
  customer_name: {
    type: String,
    trim: true,
    required: 'Name is required'
  },
  customer_email: {
    type: String,
    trim: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
    required: 'Email is required'
  },
  delivery_address: {
    street: {type: String, required: 'Street is required'},
    city: {type: String, required: 'City is required'},
    state: {type: String},
    zipcode: {type: String, required: 'Zip Code is required'},
    country: {type: String, required: 'Country is required'}
  },
  payment_id: {}, /**Stripe Customer ID that's relevant to credit card detail */
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  },
  user: {type: mongoose.Schema.ObjectId, ref: 'User'}, /** sign-in user who placed the order */

})

const Order = mongoose.model('Order', OrderSchema)

export {Order, CartItem}
