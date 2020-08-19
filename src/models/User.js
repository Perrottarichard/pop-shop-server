const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 3,
  },
  lastName: {
    type: String,
    required: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5
  },
  paymentInfo: {
    firstName: String,
    lastName: String,
    shippingAddress: String,
    city: String,
    state: String,
    zip: String,
    country: String,
    creditCardNumber: String,
    creditCardExpire: String,
    creditCardType: String,
    creditCardNameOnCard: String,
    creditCardCVV: String
  },
  passwordHash: String,
  favoriteFlavor: String,
  cart: [
    {
      item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      quantity: Number,
      color: String,
      flavor: String,
      size: String,
      price: Number
    }
  ],
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId, ref: 'Order'
    }
  ]
})
UserSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject.passwordHash
  }
})
UserSchema.plugin(uniqueValidator)
module.exports = mongoose.model('User', UserSchema)