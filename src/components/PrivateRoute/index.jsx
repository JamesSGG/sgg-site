// @flow

import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { graphql } from 'react-apollo'
import { autobind } from 'core-decorators'
import { partial, isEmpty } from 'lodash/fp'

import type { Children } from 'react'
import type { DefaultChildProps } from 'react-apollo'

import { cookies } from 'store'

// import currentUserQuery from 'data/q-current-user.graphql'

// $FlowIgnore
import USER_QUERY from 'data/q-user.graphql'


type OptionalProps = {
  async: boolean,
}

type RequiredProps = {
  component: *,
}

type OwnProps = OptionalProps & RequiredProps

type Props = DefaultChildProps<OwnProps, *>;


const userId = cookies.get('userId')

@graphql(USER_QUERY, {
  skip: !userId,
  variables: {
    id: userId,
  },
})
@autobind
export default class PrivateRoute extends Component {

  static defaultProps: OptionalProps = {
    async: true,
  }

  props: Props

  isLoading(): boolean {
    const { async, data: { loading } } = this.props

    return async && loading
  }

  isAuthenticated(): boolean {
    const { data: { error, currentUser } } = this.props

    const hasUser = !isEmpty(currentUser)
    const hasError = !isEmpty(error)

    return hasUser && !hasError
  }

  renderRoute(RouteComponent: *, props: *): Children {
    const { location, ...routeProps } = props

    if (this.isAuthenticated()) {
      return (
        <RouteComponent {...routeProps} />
      )
    }

    return (
      <Redirect
        to={{
          pathname: '/login',
          state: { from: location },
        }}
      />
    )
  }

  render(): Children {
    const { component, ...restProps } = this.props
    const renderRoute = partial(this.renderRoute, [component])

    if (this.isLoading()) {
      return null
    }

    return (
      <Route
        {...restProps}
        render={renderRoute}
      />
    )
  }
}
