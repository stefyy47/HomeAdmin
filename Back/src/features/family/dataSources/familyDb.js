const { head } = require('ramda')
const { SQLDataSource } = require('../../../utils/sqlDataSource')

function generateFamilyCode() {
  var result = ''
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  var charactersLength = characters.length
  for (var i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

class FamilyDb extends SQLDataSource {
  async getFamilyData(familyCode) {
    const data = await this.knex.select('Id', 'FamilyCode', 'FamilyIncome').from('Family').where('FamilyCode', familyCode)
    return head(data)
  }
  async getFamilyMember(userName) {
    const data = await this.knex
      .select('Id', 'FamilyId', 'HouseId', 'FirstName', 'LastName', 'Age', 'PhoneNumber', 'EmailAddress', 'UserName')
      .from('FamilyMember')
      .where('UserName', userName)
    return head(data)
  }

  async insertFamily() {
    const content = {
      FamilyCode: generateFamilyCode(),
      FamilyIncome: 0.0
    }
    const output = ['Id', 'FamilyCode', 'FamilyIncome']

    return head(await this.knex('Family').returning(output).insert(content))
  }

  async insertFamilyMember({ houseId, familyId, firstName, lastName, age, phoneNumber, emailAddress, userName, password }) {
    const content = {
      FamilyId: familyId,
      HouseId: houseId,
      FirstName: firstName,
      LastName: lastName,
      Age: age,
      PhoneNumber: phoneNumber,
      EmailAddress: emailAddress,
      UserName: userName,
      Password: password
    }
    const output = ['Id', 'UserName']

    return head(await this.knex('FamilyMember').returning(output).insert(content))
  }
}

module.exports = FamilyDb
