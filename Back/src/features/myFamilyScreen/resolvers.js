const queryResolvers = {
  Query: {
    familyMembers: async (_parent, _input, { dataSources, externalUser }, _info) =>
      dataSources.myFamily.getFamilyMembers(externalUser?.id),
    isFamilyCreator: async (_parent, _input, { dataSources, externalUser }, _info) =>
      dataSources.myFamily.isFamilyCreator(externalUser?.id)
  },
  Mutation: {
    removeMember: async (_parent, { id }, { dataSources }, _info) => dataSources.myFamily.removeMember(id)
  }
}

module.exports = queryResolvers
