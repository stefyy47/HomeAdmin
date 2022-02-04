const { getUserDataLoaders } = require('../features/user/dataLoaders')
const { getDictionaryLoaders } = require('../features/dictionaries/dataLoaders')
module.exports = dbInstance => ({
  ...getUserDataLoaders(dbInstance),
  ...getDictionaryLoaders(dbInstance)
})
