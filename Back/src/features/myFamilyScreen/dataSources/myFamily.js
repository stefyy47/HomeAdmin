const { head } = require('ramda')
const { SQLDataSource } = require('../../../utils/sqlDataSource')

class MyFamily extends SQLDataSource {
  async getFamilyMembers(externalId) {
    const currentUser = head(
      await this.knex.select('FamilyId').from('FamilyMember').where('ExternalId', externalId)
    )?.familyId
    const values = await this.knex.select('Id', 'FirstName', 'LastName').from('FamilyMember').where('FamilyId', currentUser)
    const dataWithName = values?.map(d => {
      return {
        ...d,
        name: `${d.lastName} ${d.firstName}`
      }
    })
    return dataWithName
  }
  async isFamilyCreator(externalId) {
    const familyCreator = head(
      await this.knex.select('IsFamilyCreator').from('FamilyMember').where('ExternalId', externalId)
    )?.isFamilyCreator
    return familyCreator
  }

  async removeMember(id) {
    await this.knex('FamilyMember').where('Id', id).del()
    return id
  }
}

module.exports = MyFamily
