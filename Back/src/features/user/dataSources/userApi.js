const { head } = require('ramda')
const { NoCacheRESTDataSource } = require('../../../utils/noCacheRESTDataSource')

class UserApi extends NoCacheRESTDataSource {
  constructor() {
    super()
    this.baseURL = `${process.env.IDENTITY_API_URL}`
  }

  willSendRequest(request) {
    request.headers.set('Authorization', this.context.token)
  }

  async getRights() {
    const data = await this.get(`rights`)
    return data
  }

  async getUserData() {
    const data = await this.get(`userData`)
    return data
  }
  async createUser({ userName, password, email, firstName, lastName, age }) {
    const identityUserId = await this.post(`Account/Register`, { userName, password, email })
    return identityUserId
  }
}

module.exports = UserApi
