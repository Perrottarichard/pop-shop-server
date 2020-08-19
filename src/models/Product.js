const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
  type: {
    type: String
  },
  brand: {
    name: String,
    countryOfOrigin: String,
    contactNumber: String,
    contactEmail: String
  },
  flavors: [String],
  colors: [String],
  sizes: [String],
  prices: [String],
  inStock: { type: Boolean, default: true },
  internationalShipping: { type: Boolean, default: true },
  isDeal: Boolean
})

module.exports = mongoose.model('Product', ProductSchema)