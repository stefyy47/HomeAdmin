const MyFamilyHouses = require('../features/myFamilyHousesScreen/dataSources/myFamilyHouses')
const MyFamily = require('../features/myFamilyScreen/dataSources/myFamily')
const UserApi = require('../features/user/dataSources/userApi')
const UserDb = require('../features/user/dataSources/userDb')
const DictionariesDb = require('../features/dictionaries/dataSources/dictionariesDb')
const FamilyDb = require('../features/family/dataSources/familyDb')
const TaskDb = require('../features/task/taskDb')

module.exports.getDataSources = () => ({
  // Instantiate your data sources here. e.g.: userApi: new UserApi()
  userApi: new UserApi(),
  userDb: new UserDb(),
  myFamily: new MyFamily(),
  myFamilyHouses: new MyFamilyHouses(),
  dictionariesDb: new DictionariesDb(),
  familyDb: new FamilyDb(),
  taskDb: new TaskDb()
})

// This is a temporary fix to pass dataSources to ws requests. This will be fixed in Apollo server v3.0
module.exports.initializedDataSources = (context, dbInstance, dataSources) => {
  // You need to initialize you datasources here e.g.: dataSources.userApi.initialize({ context })
  dataSources.userApi.initialize({ context })
  dataSources.userDb.initialize({ context: { dbInstance } })
  return dataSources
}
