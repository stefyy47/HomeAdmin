//env
const dotenv = require('dotenv')
const result = dotenv.config()
if (result.error) {
  const path = `.env`
  dotenv.config({ path })
}
const { graphqlUploadKoa } = require('graphql-upload')
require('console-stamp')(global.console, {
  format: ':date(yyyy/mm/dd HH:MM:ss.l)'
})
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0
const { ApolloServer, ForbiddenError } = require('apollo-server-koa')
const Koa = require('koa')

// Auth
// eslint-disable-next-line node/no-extraneous-require
// const cors = require('@koa/cors')
const bodyParser = require('koa-bodyparser')

// Logging
const { initializeDbLogging } = require('./plugins/logging/loggingUtils')
const loggingPlugin = require('./plugins/logging/loggingPlugin')
const { v4 } = require('uuid')

const jsonwebtoken = require('jsonwebtoken')

// const { execute, subscribe } = require('graphql')
// const { SubscriptionServer } = require('subscriptions-transport-ws')

const { createServer } = require('http')

const { dbInstanceFactory } = require('./db')
const {
  contextDbInstance,
  // jwtTokenValidation,
  jwtTokenUserIdentification,
  // correlationMiddleware,
  errorHandlingMiddleware
} = require('./middleware')
const { schema, initializedDataSources, getDataSources, getDataLoaders } = require('./startup/index')

async function startServer(httpServer) {
  const app = new Koa()

  app.use(errorHandlingMiddleware())
  app.use(bodyParser())
  app.use(graphqlUploadKoa({ maxFieldSize: 10000000, maxFiles: 2 }))
  // app.use(correlationMiddleware())
  // app.use(cors())
  // app.use(jwtTokenValidation)
  app.use(jwtTokenUserIdentification)
  app.use(contextDbInstance())

  const plugins = [
    {
      async serverWillStart() {
        return {
          async drainServer() {}
        }
      }
    },
    loggingPlugin
  ]

  console.info('Creating Subscription Server...')
  // const subscriptionServer = SubscriptionServer.create(
  //   {
  //     schema,
  //     execute,
  //     subscribe,
  //     async onConnect(connectionParams, _webSocket, context) {
  //       const token = connectionParams.authorization.replace('Bearer ', '')

  //       // if (!token) {
  //       //   throw new ForbiddenError('401 Unauthorized')
  //       // }

  //       // await validateToken(token)

  //       const decoded = jsonwebtoken.decode(token)

  //       const dbInstance = await dbInstanceFactory()

  //       if (!dbInstance) {
  //         throw new TypeError('Could not create dbInstance. Check the database configuration info and restart the server.')
  //       }
  //       const dataSources = getDataSources()
  //       return {
  //         token,
  //         dbInstance,
  //         dataSources: initializedDataSources(context, dbInstance, dataSources),
  //         dataLoaders: getDataLoaders(dbInstance),
  //         externalUser: {
  //           id: decoded.sub,
  //           role: decoded.role
  //         }
  //       }
  //     }
  //   },
  //   {
  //     server: httpServer,
  //     path: '/graphql'
  //   }
  // )

  console.info('Creating Apollo Server...')
  const server = new ApolloServer({
    schema,
    uploads: false,
    plugins,
    dataSources: getDataSources,
    context: async context => {
      const { ctx, connection } = context

      if (connection) {
        const { logInfo, logDebug, logError } = initializeDbLogging(
          { ...connection.context, requestId: v4() },
          connection.operationName
        )
        return {
          ...connection.context,
          logger: { logInfo, logDebug, logError }
        }
      } else {
        const { token, dbInstance, externalUser, correlationId, request, requestSpan } = ctx
        const { logInfo, logDebug, logError } = initializeDbLogging({ ...ctx, requestId: v4() }, request.operationName)
        return {
          token,
          dbInstance,
          dbInstanceFactory,
          dataLoaders: getDataLoaders(dbInstance),
          externalUser,
          correlationId,
          request,
          requestSpan,
          logger: { logInfo, logDebug, logError }
        }
      }
    }
  })

  await server.start()
  server.getMiddleware({ cors: {} })
  server.applyMiddleware({ app })
  httpServer.on('request', app.callback())

  process.on('uncaughtException', function (error) {
    throw new Error(`Error occurred while processing the request: ${error.stack}`)
  })
}

const httpServer = createServer()
startServer(httpServer)
const port = process.env.PORT || 4000
// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
httpServer.listen(port, () => {
  console.log(`🚀 Server ready at http://localhost:${port}/graphql`)
  console.log(`🚀 Subscriptions ready at ws://localhost:${port}/graphql`)
})

process.on('uncaughtException', function (error) {
  throw new Error(`Error occurred while processing the request: ${error.stack}`)
})
