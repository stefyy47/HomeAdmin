const { head } = require('ramda')
const { SQLDataSource } = require('../../../utils/sqlDataSource')

class MyFamilyHouses extends SQLDataSource {
  async getFamilyHouses(externalId) {
    const familyId = head(await this.knex.select('FamilyId').from('FamilyMember').where('ExternalId', externalId))?.familyId
    const familyHouses = await this.knex.select('Id', 'Address', 'IsPopulated').from('House').where('FamilyId', familyId)
    return familyHouses
  }
  async removeFamilyHouse(id) {
    await this.knex('House').where('Id', id).del()
    return id
  }
  async addFamilyHouse(externalId, address) {
    const familyId = head(await this.knex.select('FamilyId').from('FamilyMember').where('ExternalId', externalId))?.familyId
    const content = {
      Address: address,
      FamilyId: familyId,
      IsPopulated: true
    }
    const output = ['Id']
    return head(await this.knex('House').returning(output).insert(content))
  }
}

module.exports = MyFamilyHouses
