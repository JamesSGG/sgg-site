// @flow

import React from 'react'
import { ApolloProvider } from 'react-apollo'
import { ConnectedRouter } from 'react-router-redux'

import type { Children } from 'react'
import type { Store } from 'redux'

import { apolloClient, history } from 'store'

type Props = {
  store: Store<*, *>,
  children: Children,
}

export default function AppWrapper(props: Props): Children {
  const { store, children } = props

  return (
    <ApolloProvider store={store} client={apolloClient}>
      <ConnectedRouter history={history}>
        {children}
      </ConnectedRouter>
    </ApolloProvider>
  )
}
