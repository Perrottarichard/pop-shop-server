const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema({
  cart:
    [
      {
        item: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product'
        },
        quantity: Number,
        flavor: String,
        color: String,
        size: String,
        price: String
      }
    ],
  totalPrice: Number,
  confirmation: String,
  date: { type: Date, default: Date.now },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

module.exports = mongoose.model('Order', OrderSchema)