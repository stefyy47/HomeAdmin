const { head } = require('ramda')
const { SQLDataSource } = require('../../utils/sqlDataSource')

class TaskDb extends SQLDataSource {
  async getTaskList(externalId) {
    const assignerId = head(await this.knex.select('Id').from('FamilyMember').where('ExternalId', externalId))?.id
    const data = await this.knex
      .select('Id', 'Title', 'Description', 'CreatedAt', 'Deadline', 'StatusId', 'FamilyMemberId')
      .from('Task')
      .where('FamilyMemberId', assignerId)
    return data
  }
  async createTask(externalId, { asigneeId, taskName, taskDescription, statusId, isKidFriendly, isElderFriendly }) {
    const assignerId = head(await this.knex.select('Id').from('FamilyMember').where('ExternalId', externalId))?.id
    const content = {
      AssignedToId: parseInt(asigneeId),
      StatusId: statusId,
      Title: taskName,
      Description: taskDescription,
      CreatedAt: new Date(),
      DeadLine: new Date(),
      FamilyMemberId: assignerId
    }
    const output = ['Id']
    return head(await this.knex('Task').returning(output).insert(content))
  }
}

module.exports = TaskDb
