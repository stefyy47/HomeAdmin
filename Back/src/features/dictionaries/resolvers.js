const dictionaryResolvers = {
  Query: {
    statusList: (_parent, _arguments, { dataSources }, _info) => dataSources.dictionariesDb.getStatusList()
  }
}
module.exports = dictionaryResolvers
