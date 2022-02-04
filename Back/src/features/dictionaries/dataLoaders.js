const DataLoader = require('dataloader')

const getDictionaryLoaders = dbInstance => {
  return {
    taskStatusById: new DataLoader(ids =>
      dbInstance
        .select('Id', 'Name')
        .from('Status')
        .whereIn('Id', ids)
        .then(rows => ids.map(id => rows.find(x => x.id === id)))
    ),
    familyMemberById: new DataLoader(ids =>
      dbInstance
        .select('Id', 'FirstName', 'LastName', 'PhoneNumber')
        .from('FamilyMember')
        .whereIn('Id', ids)
        .then(rows => ids.map(id => rows.find(x => x.id === id)))
    )
  }
}

module.exports = { getDictionaryLoaders }
