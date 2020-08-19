const { ApolloServer, UserInputError } = require('apollo-server')
require('dotenv').config()
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('./models/User')
const typeDefs = require('./schema')
const resolvers = require('./resolvers')

mongoose.set('useFindAndModify', false)
const MONGO_URI = process.env.MONGO_URI

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB', error.message)
  })
const PORT = process.env.PORT || 4000

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer')) {
      const decodedToken = jwt.verify(
        auth.substring(7), process.env.JWT_SECRET
      )
      const currentUser = await User.findById(decodedToken.id).populate({
        path: 'cart',
        populate: {
          path: 'item',
          model: 'Product'
        }
      })
      return { currentUser }
    }
  }
})

server.listen({ port: PORT }).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})