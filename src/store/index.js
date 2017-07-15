// @flow weak

import { compose, createStore, combineReducers, applyMiddleware } from 'redux'
import { routerReducer, routerMiddleware } from 'react-router-redux'
import { ApolloClient, createNetworkInterface } from 'react-apollo'
import createHistory from 'history/createBrowserHistory'
import { identity } from 'lodash/fp'

import type { Store } from 'redux'

import appReducer, { initialState } from './modules'

export const history = createHistory()

export const networkInterface = createNetworkInterface({
  uri: 'https://social-gaming-guild-api.herokuapp.com/graphql',
})

export const apolloClient = new ApolloClient({
  networkInterface,
})

export const createReducer = (nextAppReducer) => combineReducers({
  app: nextAppReducer,
  routing: routerReducer,
})

/**
 * This is an initial reducer to use when creating the initial store,
 * or when creating a store for server side rendering.
 */
export const reducer = createReducer(appReducer)

export const getStore = (state?: * = initialState): Store<*, *> => {
  const middleware = [
    apolloClient.middleware(),
    routerMiddleware(history),
  ]

  const devToolsMiddleware = (
    typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined'
    ? window.__REDUX_DEVTOOLS_EXTENSION__
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
