const taskResolver = {
  Query: {
    taskList: async (_parent, _arguments, { dataSources, externalUser }, _info) =>
      dataSources.taskDb.getTaskList(externalUser?.id)
  },
  Task: {
    status: async ({ statusId }, _params, { dataLoaders }, _info) => statusId && dataLoaders.taskStatusById.load(statusId),
    familyMember: ({ familyMemberId }, _params, { dataLoaders }, _info) => dataLoaders.familyMemberById.load(familyMemberId)
  },
  Mutation: {
    addTask: async (_parent, input, { dataSources, externalUser }, _info) =>
      dataSources.taskDb.createTask(externalUser?.id, input?.input)
  }
}

module.exports = taskResolver
