const { isNil, isEmpty } = require('ramda')
const { topics, redisPubSub } = require('../../pubSub')

const userResolvers = {
  Query: {
    userData: async (_, { id, externalId }, { dataLoaders }, _info) => {
      if (externalId) {
        return await dataLoaders.userByExternalId.load(externalId)
      } else return await dataLoaders.userById.load(id)
    },
    userList: async (_parent, { pager, filters }, { dataSources }) => {
      const { pageSize } = pager
      const data = await dataSources.userDb.getUserList(pager, filters)
      const { values, sortByValue } = data
      return pageSize
        ? { values: values.slice(0, pageSize), nextAfterId: values[pageSize], sortByValue }
        : { values, sortByValue }
    }
  },
  User: {
    rights: async (_parent, _params, _ctx, _info) => {
      // to avoid n+1 problem, use dataLoader whenever you can
      return ['tenant_admin', 'tenant_user']
    }
  },
  UserList: {
    pagination: async ({ nextAfterId, sortByValue }, { pager, filters }, { dataSources }, _info) => {
      const { totalCount } = await dataSources.userDb.getUserListTotalCount(filters)
      const prevPageId = await dataSources.userDb.getUserListPreviousPageAfterId(pager, filters, sortByValue)
      const prevPage = { ...pager, afterId: prevPageId && prevPageId.id }
      const nextPage = { ...pager, afterId: nextAfterId ? nextAfterId.id : null }
      return { totalCount, prevPage, nextPage }
    }
  },
  Mutation: {
    createUser: async (_, { input }, { dataSources, externalUser }, _info) => {
      const identityId = await dataSources.userApi.createUser(input)
      if (isNil(externalUser) || isEmpty(externalUser)) {
        const abc = await dataSources.userDb.createFamily(
          input?.firstName,
          input?.lastName,
          input?.email,
          input?.age,
          identityId
        )
        return abc
      } else {
        const abc = await dataSources.userDb.addMemberInFamily(
          identityId,
          externalUser?.id,
          input?.firstName,
          input?.lastName,
          input?.email,
          input?.age
        )
      }
    }
  },
  Subscription: {
    userChanged: {
      resolve: async (msg, _variables, _context, _info) => {
        return msg.payload
      },
      subscribe: (_parent, _args, _context) => redisPubSub.asyncIterator(topics.USER_CHANGED)
    }
  }
}

module.exports = userResolvers
