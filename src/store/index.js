// @flow weak

import { compose, createStore, combineReducers, applyMiddleware } from 'redux'
import { routerReducer, routerMiddleware } from 'react-router-redux'
import { ApolloClient, createNetworkInterface } from 'react-apollo'
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws'
import createHistory from 'history/createBrowserHistory'
import { identity } from 'lodash/fp'

import type { Store } from 'redux'

import { getApiUrl, getApiWebSocketsUrl } from 'utils/api'

import appReducer, { initialState } from './modules'

const apiUrl = getApiUrl()
const apiWebSocketsUrl = getApiWebSocketsUrl()

const wsClient = new SubscriptionClient(apiWebSocketsUrl, {
  reconnect: true,
  connectionParams: {},
})

export const networkInterface = createNetworkInterface({
  uri: `${apiUrl}/graphql`,
  opts: {
    credentials: 'include',
  },
})

const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  networkInterface,
  wsClient,
)

export const apolloClient = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions,
})

export const history = createHistory()

export const createReducer = (nextAppReducer) => combineReducers({
  app: nextAppReducer,
  apollo: apolloClient.reducer(),
  routing: routerReducer,
})

export const reducer = createReducer(appReducer)

export const getStore = (state?: * = initialState): Store<*, *> => {
  const middleware = [
    apolloClient.middleware(),
    routerMiddleware(history),
  ]

  const devToolsMiddleware = (
    typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined'
    ? window.__REDUX_DEVTOOLS_EXTENSION__()
    : identity
  )

  const enhancer = compose(
    applyMiddleware(...middleware),
    devToolsMiddleware,
  )

  const store = createStore(reducer, state, enhancer)

  if (module.hot && typeof module.hot.accept === 'function') {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./modules', () => {
      // eslint-disable-next-line global-require
      const { default: nextAppReducer } = require('./modules')
      const nextReducer = createReducer(nextAppReducer)

      store.replaceReducer(nextReducer)
    })
  }

  return store
}

export default getStore()
