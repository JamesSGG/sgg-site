// @flow weak

import { createStore, combineReducers, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
import persistState from 'redux-localstorage'
import { routerReducer, routerMiddleware } from 'react-router-redux'
import { ApolloClient, createNetworkInterface } from 'react-apollo'
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws'
import createHistory from 'history/createBrowserHistory'
import { property } from 'lodash/fp'

import type { Store } from 'redux'

import { getApiUrl, getApiWebSocketsUrl } from 'utils/api'
import { getIsDev } from 'utils/env'

import appReducer, { initialState as appInitialState } from './reducers'
import type { AppState } from './reducers'

const isDev = getIsDev()
const apiUrl = getApiUrl()
const apiWebSocketsUrl = getApiWebSocketsUrl()

const wsClient = new SubscriptionClient(`${apiWebSocketsUrl}/subscriptions`, {
  reconnect: false,
  connectionParams: {},
})

export const networkInterface = createNetworkInterface({
  uri: `${apiUrl}/graphql`,
  opts: {
    mode: 'cors',
    credentials: 'include',
  },
})

if (isDev) {
  networkInterface.use([
    {
      applyMiddleware(req, next) {
        setTimeout(next, 750)
      },
    },
  ])
}

const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  networkInterface,
  wsClient,
)

export const apolloClient = new ApolloClient({
  shouldBatch: true,
  networkInterface: networkInterfaceWithSubscriptions,
  dataIdFromObject: property('id'),
})

export const history = createHistory()

export const createReducer = (nextAppReducer) => combineReducers({
  app: nextAppReducer,
  apollo: apolloClient.reducer(),
  routing: routerReducer,
})

export const reducer = createReducer(appReducer)

export const initialState = {
  app: appInitialState,
}

export const getStore = (state?: AppState = initialState): Store<*, *> => {
  const middleware = [
    apolloClient.middleware(),
    routerMiddleware(history),
  ]

  const enhancer = composeWithDevTools(
    applyMiddleware(...middleware),
    persistState('app'),
  )

  const store = createStore(reducer, state, enhancer)

  if (module.hot && typeof module.hot.accept === 'function') {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept(['./actions', './reducers', './selectors'], () => {
      // eslint-disable-next-line global-require
      const { default: nextAppReducer } = require('./reducers')
      const nextReducer = createReducer(nextAppReducer)

      store.replaceReducer(nextReducer)
    })
  }

  return store
}

export default getStore()
