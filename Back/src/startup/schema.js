const { makeExecutableSchema } = require('@graphql-tools/schema')
const merge = require('lodash.merge')

const { loadTypedefsSync } = require('@graphql-tools/load')
const { GraphQLFileLoader } = require('@graphql-tools/graphql-file-loader')
const { join } = require('path')

const userResolvers = require('../features/user/resolvers')
const myFamilyResolvers = require('../features/myFamilyScreen/resolvers')
const myFamilyHousesResolvers = require('../features/myFamilyHousesScreen/resolvers')
const dictionaryResolvers = require('../features/dictionaries/resolvers')
const familyQueryResolvers = require('../features/family/resolvers/familyQueryResolvers')
const familyMutationResolvers = require('../features/family/resolvers/familyMutationResolvers')
const taskResolvers = require('../features/task/taskResolver')

const oldTypeDefs = []
const sources = loadTypedefsSync(join(__dirname, '../**/*.graphql'), {
  loaders: [new GraphQLFileLoader()]
})

const resolvers = merge(
  userResolvers,
  myFamilyResolvers,
  myFamilyHousesResolvers,
  taskResolvers,
  dictionaryResolvers,
  familyQueryResolvers,
  familyMutationResolvers
)

const typeDefs = [...sources.map(source => source.document), ...oldTypeDefs]

module.exports = makeExecutableSchema({ typeDefs, resolvers })
module.exports.tests = { typeDefs, resolvers }
