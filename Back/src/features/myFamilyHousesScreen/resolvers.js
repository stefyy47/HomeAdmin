const queryResolversHouse = {
  Query: {
    familyHouses: async (_parent, _input, { dataSources, externalUser }, _info) =>
      dataSources.myFamilyHouses.getFamilyHouses(externalUser?.id)
  },
  Mutation: {
    removeFamilyHouse: async (_parent, { id }, { dataSources }, _info) => dataSources.myFamilyHouses.removeFamilyHouse(id),
    addFamilyHouse: async (_parent, { address }, { dataSources, externalUser }, _info) =>
      dataSources.myFamilyHouses.addFamilyHouse(externalUser?.id, address)
  }
}

module.exports = queryResolversHouse
