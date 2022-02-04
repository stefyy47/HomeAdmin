const { UserInputError } = require('apollo-server-koa')
const { getToken } = require('../../../middleware/auth/auth')

const familyMutationResolvers = {
  Mutation: {
    register: async (_parent, { input }, { dataSources }, _info) => {
      if (!input) throw new UserInputError('Invalid input')
      const { userName, password } = input
      const familyMemberInfo = await dataSources.familyDb.getFamilyMember(userName)
      if (familyMemberInfo != null) throw new UserInputError('Username already exists!')
      const hashedPassword = await bcrypt.hash(password, 10)
      let familyId = 0
      if (input?.familyCode) {
        familyId = (await dataSources.familyDb.getFamilyData(input?.familyCode))?.id
        if (!familyId) throw new UserInputError('Invalid family code')
      } else {
        familyId = (await dataSources.familyDb.insertFamily())?.id
      }
      const updatedInput = { ...input, familyId, password: hashedPassword }
      const { id: familyMemberId } = await dataSources.familyDb.insertFamilyMember(updatedInput)
      const token = getToken({ familyMemberId, userName, familyId })
      return token
    }
  }
}

module.exports = familyMutationResolvers
