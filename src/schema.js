const { gql } = require('apollo-server');

const typeDefs = gql`
type User {
  firstName: String!
  lastName: String!
  email: String!
  favoriteFlavor: String!
  paymentInfo: PaymentInfo
  cart: [Cart]
  id: ID!
}
input UserInput {
  firstName: String!
  lastName: String!
  email: String!
  favoriteFlavor: String!
  paymentInfo: PaymentInfoInput
  cart: [CartInput]
  id: ID!
}
type PaymentInfo {
    firstName: String
    lastName: String
    shippingAddress: String
    city: String
    state: String
    zip: String
    country: String
    creditCardNumber: String
    creditCardCVV: String
    creditCardExpire: String
    creditCardType: String
    creditCardNameOnCard: String
}
input PaymentInfoInput {
  firstName: String
  lastName: String
  shippingAddress: String!
  city: String
  state: String
  zip: String
  country: String
  creditCardNumber: String
  creditCardCVV: String
  creditCardExpire: String
  creditCardType: String
  creditCardNameOnCard: String
}

type Brand {
  name: String!
  countryOfOrigin: String
  contactNumber: String
  contactEmail: String
}
input BrandInput {
  name: String!
  countryOfOrigin: String
  contactNumber: String
  contactEmail: String
}
type Product {
 type: String
 brand: Brand
 flavors: [String]
 colors: [String]
 sizes: [String]
 prices: [String]
 inStock: Boolean
 internationalShipping: Boolean
 isDeal: Boolean
 id: ID
}
input ProductInput {
  type: String
  brand: BrandInput
  flavors: [String]
  colors: [String]
  sizes: [String]
  prices: [String]
  inStock: Boolean
  internationalShipping: Boolean
  isDeal: Boolean
  id: ID
 }
type Cart {
 item: Product
 quantity: Int
 flavor: String
 color: String
 size: String
 price: Float
 id: ID
}
input CartInput {
  item: ProductInput
  quantity: Int
  flavor: String
  color: String
  size: String
  price: Float
  id: ID
 }
type Order {
  cart: [Cart]
  totalPrice: Float
  user: User
  confirmation: String
  date: String
  id: ID
}

type Token {
  value: String!
  firstName: String
  lastName: String
  email: String
  favoriteFlavor: String
  paymentInfo: PaymentInfo
  cart: [Cart]
  id: ID
}

type Query {
me: User
allProducts: [Product!]
filterByFlavor(flavor: String!): [Product!]!
getCart: [Cart]
getOrders: [Order]
}

type Mutation {
  createUser(
    firstName: String!
    lastName: String!
    email: String!
    password: String!
    favoriteFlavor: String!
  ): User

  login(
    email: String!
    password: String!
  ): Token

  addCart(
    item: ProductInput
    quantity: Int!
    flavor: String
    color: String
    size: String!
    price: Float!
  ): Cart

  removeCart(
    id: ID!
  ): Cart

  createOrder(
    firstName: String
    lastName: String
    shippingAddress: String
    city: String
    state: String
    zip: String
    country: String
    creditCardNumber: String
    creditCardCVV: String
    creditCardExpire: String
    creditCardNameOnCard: String
    totalPrice: Float
    confirmation: String
  ): Order
}
`
module.exports = typeDefs