// @flow

import React from 'react'
import { ApolloProvider } from 'react-apollo'
import { ConnectedRouter } from 'react-router-redux'

import type { Children } from 'react'

import store, { apolloClient, history } from 'store'

type Props = {
  children: Children,
}

export default function AppWrapper(props: Props): Children {
  const { children } = props

  return (
    <ApolloProvider store={store} client={apolloClient}>
      <ConnectedRouter history={history}>
        {children}
      </ConnectedRouter>
    </ApolloProvider>
  )
}
