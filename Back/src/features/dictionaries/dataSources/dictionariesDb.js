const { SQLDataSource } = require('../../../utils/sqlDataSource')

class DictionariesDb extends SQLDataSource {
  async getStatusList() {
    const data = await this.knex.select('Id', 'Name').from('Status')
    return data
  }
}

module.exports = DictionariesDb
