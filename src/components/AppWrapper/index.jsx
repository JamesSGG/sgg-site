// @flow

import React from 'react'
import { ApolloProvider } from 'react-apollo'
import { ConnectedRouter } from 'react-router-redux'

import type { Node } from 'react'

import store, { apolloClient, history } from 'store'

type Props = {
  children: Node,
}

export default function AppWrapper(props: Props): Node {
  const { children } = props

  return (
    <ApolloProvider store={store} client={apolloClient}>
      <ConnectedRouter history={history}>
        {children}
      </ConnectedRouter>
    </ApolloProvider>
  )
}
