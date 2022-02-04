const { postProcessDbResponse } = require('../utils/functions')

const generateKnexConfig = ({ server, instanceName, port, userId, password, database, trustServerCertificate }) => ({
  client: 'mssql',
  connection: {
    server,
    port: parseInt(port) || null,
    user: userId,
    password,
    database,
    options: {
      // enableArithAbort: true,
      // trustServerCertificate: JSON.parse(trustServerCertificate),
      // encrypt: true,
      instanceName: instanceName || undefined
    }
  },
  pool: {
    min: 5,
    max: 25,
    acquireTimeoutMillis: 30000,
    createTimeoutMillis: 30000,
    destroyTimeoutMillis: 5000,
    createRetryIntervalMillis: 200,
    idleTimeoutMillis: 5000
  },
  useNullAsDefault: true,
  postProcessResponse: postProcessDbResponse
})

const getDbConfig = () => {
  const {
    DB_HOST: server,
    DB_PORT: port,
    DB_USER: userId,
    DB_PASSWORD: password,
    DB_DATABASE: database,
    DB_INSTANCE_NAME: instanceName,
    DB_TRUST_SERVER_CERTIFICATE: trustServerCertificate
  } = process.env

  const dbConfig = generateKnexConfig({ server, port, userId, password, database, instanceName, trustServerCertificate })
  return [dbConfig, true]
}

module.exports = { getDbConfig, generateKnexConfig }
