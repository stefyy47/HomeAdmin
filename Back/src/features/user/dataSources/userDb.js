const { head } = require('ramda')
const { SQLDataSource } = require('../../../utils/sqlDataSource')
const {
  generateTopClause,
  getSortByValue,
  generateSortByPkClause,
  generatePrevPageWhereClause,
  generateOrderByClause
} = require('../../common/dbGenerators')

function generateFamilyCode() {
  var result = ''
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  var charactersLength = characters.length
  for (var i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

class UserDb extends SQLDataSource {
  generateFromAndWhereClause(queryBuilder, { afterId, filters = {}, direction = 0, sortBy = 'FirstName', sortByValue }) {
    const { firstName, lastName } = filters

    queryBuilder.from('User')

    if (firstName) {
      queryBuilder.whereRaw('UPPER(FirstName) LIKE ?', `%${firstName.toUpperCase()}%`)
    }
    if (lastName) {
      queryBuilder.whereRaw('UPPER(LastName) LIKE ?', `%${lastName.toUpperCase()}%`)
    }

    if (afterId) {
      queryBuilder.modify(generateSortByPkClause, { sortBy, pk: 'Id', direction, afterId, sortByValue })
    }
  }

  async getUserListTotalCount(filters = {}) {
    return await this.knex.count('Id', { as: 'TotalCount' }).modify(this.generateFromAndWhereClause, { filters }).first()
  }

  async getUserListPreviousPageAfterId(pager, filters, sortByValue) {
    const { pageSize, afterId, sortBy = 'FirstName', direction = 0 } = pager
    const prevPage = await this.knex
      .select('Id')
      .modify(this.generateFromAndWhereClause, { filters })
      .modify(generateOrderByClause, { sortBy, direction: !direction, pk: 'Id' })
      .modify(generatePrevPageWhereClause, { afterId, direction, sortBy, sortByValue, pk: 'Id' })
      .modify(generateTopClause, pageSize)
    return prevPage[pageSize - 1]
  }

  async getUserList(pager, filters) {
    const { pageSize, sortBy = 'FirstName', direction = 0, afterId } = pager
    const sortByValue = await getSortByValue(this.knex, afterId, sortBy, 'User', 'Id')
    const values = await this.knex
      .select('Id', 'FirstName', 'LastName')
      .from('Person')
      .modify(this.generateFromAndWhereClause, { filters, afterId, direction, sortBy, sortByValue })
      .modify(generateOrderByClause, { sortBy, direction, pk: 'Id' })
      .modify(generateTopClause, pageSize ? pageSize + 1 : null)
    return { values, sortByValue }
  }

  async createFamily(firstName, lastName, email, age, identityUserId) {
    const familyId = head(
      await this.knex('Family').returning(['Id', 'FamilyCode', 'FamilyIncome']).insert({
        FamilyCode: generateFamilyCode(),
        FamilyIncome: 0.0
      })
    )
    const content = {
      FirstName: firstName,
      LastName: lastName,
      EmailAddress: email,
      FamilyId: familyId?.id,
      IsFamilyCreator: true,
      Age: age,
      ExternalId: identityUserId
    }
    const output = ['Id']
    return head(await this.knex('FamilyMember').returning(output).insert(content))
  }

  async addMemberInFamily(identityUserId, externalId, firstName, lastName, email, age) {
    const familyId = head(await this.knex.select('FamilyId').from('FamilyMember').where('ExternalId', externalId))?.familyId
    const content = {
      FirstName: firstName,
      LastName: lastName,
      EmailAddress: email,
      FamilyId: familyId,
      IsFamilyCreator: false,
      Age: age,
      ExternalId: identityUserId
    }
    const output = ['Id']
    return head(await this.knex('FamilyMember').returning(output).insert(content))
  }
}

module.exports = UserDb
