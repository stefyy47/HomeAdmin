const familyQueryResolvers = {
  Query: {
    familyData: async (_parent, { familyCode }, { dataSources }, _info) => dataSources.familyDb.getFamilyData(familyCode),
    familyMember: async (_parent, { userName }, { dataSources }, _info) => dataSources.familyDb.getFamilyMember(userName)
  }
}
module.exports = familyQueryResolvers
