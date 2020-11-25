
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Product = require('./models/Product')
const User = require('./models/User')
const Order = require('./models/Order')

const JWT_SECRET = process.env.JWT_SECRET

module.exports = {
  Query: {
    filterByFlavor: (root, args) => {
      return Product.find({ flavors: { $in: [args.flavor] } }).populate('Product')
    },
    me: async (root, args, context) => {
      const user = await User.findById(context.currentUser.id).populate({
        path: 'cart',
        populate: {
          path: 'item',
          model: 'Product'
        }
      })
      return user
    },
    getOrders: async (root, args, context) => {
      const orders = await Order.find({}).populate('user cart.item')
      let userOrders = orders.filter(o => o.user.id === context.currentUser.id)
      return userOrders
    },
    getCart: async (root, args, context) => {
      const user = await User.findById(context.currentUser.id).populate({
        path: 'cart',
        populate: {
          path: 'item',
          model: 'Product'
        }
      })
      return user.cart
    },
    allProducts: (root, args) => {
      if (!args.type) {
        return Product.find({}).populate('Brand')
      } else {
        return Product.find({ type: args.type }).populate('Brand')
      }
    }
  },
  Mutation: {
    createUser: async (root, args) => {
      const saltRounds = 10
      const passwordHash = await bcrypt.hash(args.password, saltRounds)
      const user = new User({
        firstName: args.firstName,
        lastName: args.lastName,
        email: args.email,
        passwordHash: passwordHash,
        paymentInfo: {
          firstName: args.firstName,
          lastName: args.lastName,
          shippingAddress: args.shippingAddress,
          city: args.city,
          state: args.state,
          zip: args.zip,
          country: args.country,
          creditCardNumber: args.creditCardNumber,
          creditCardExpire: args.creditCardExpire,
          creditCardCVV: args.creditCardCVV,
          creditCardType: args.creditCardType,
          creditCardNameOnCard: args.creditCardNameOnCard
        },
        favoriteFlavor: args.favoriteFlavor
      })

      return user.save()
        .catch(error => {
          throw new Error(error.message, {
            invalidArgs: args,
          })
        })
    },
    login: async (root, args) => {
      const user = await User.findOne({ email: args.email }).populate({
        path: 'cart',
        populate: {
          path: 'item',
          model: 'Product'
        }
      })
      const passwordCorrect = user === null ? false :
        await bcrypt.compare(args.password, user.passwordHash)

      if (!user || !passwordCorrect) {
        throw new Error("wrong credentials")
      }

      const userForToken = {
        email: user.email,
        id: user._id,

      }
      return {
        value: jwt.sign(userForToken, JWT_SECRET),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        favoriteFlavor: user.favoriteFlavor,
        cart: user.cart,
        paymentInfo: user.paymentInfo,
        id: user._id
      }
    },
    addCart: async (root, args, context) => {
      const user = await User.findById(context.currentUser.id)
      const cartItem = {
        item: {
          _id: args.item.id,
          type: args.item.type,
          brand: {
            name: args.item.brand.name
          },
        },
        quantity: args.quantity,
        color: args.color,
        flavor: args.flavor,
        size: args.size,
        price: args.price,
        id: args.id
      }
      const saved = user.cart.push(cartItem)
      await user.save()
    },
    removeCart: async (root, args, context) => {
      const user = await User.findById(context.currentUser.id)
      user.cart = user.cart.filter(c => c.id !== args.id)
      await user.save()
    },
    createOrder: async (root, args, context) => {
      const user = await User.findById(context.currentUser.id).populate({
        path: 'cart',
        populate: {
          path: 'item',
          model: 'Product'
        }
      })
      const userCartCopy = [...user.cart]
      const addedOrder = new Order({ cart: userCartCopy, user: user.id, totalPrice: args.totalPrice, confirmation: args.confirmation })
      await addedOrder.save()
      const paymentInfo = {
        firstName: args.firstName,
        lastName: args.lastName,
        shippingAddress: args.shippingAddress,
        city: args.city,
        state: args.state,
        zip: args.zip,
        country: args.country,
        creditCardNumber: args.creditCardNumber,
        creditCardCVV: args.creditCardCVV,
        creditCardExpire: args.creditCardExpire,
        creditCardType: 'visa',
        creditCardNameOnCard: args.creditCardNameOnCard,
      }
      user.paymentInfo = paymentInfo
      user.orders.push(addedOrder)
      user.cart = []
      await user.save()
      let convertedDate = new Date(addedOrder.date).getTime()
      return {
        id: addedOrder.id,
        confirmation: addedOrder.confirmation,
        date: convertedDate
      }
    }
  }
}
