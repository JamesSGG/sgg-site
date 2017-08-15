// @flow

import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { graphql } from 'react-apollo'
import { autobind } from 'core-decorators'
import { partial, complement, isEmpty } from 'lodash/fp'

import type { Children } from 'react'
import type { DefaultChildProps } from 'react-apollo'

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


const notEmpty = complement(isEmpty)

const { localStorage } = window

const userId = localStorage.getItem('userId')

@graphql(USER_QUERY, {
  skip: !userId,
  options: {
    variables: {
      id: userId,
    },
  },
})
@autobind
export default class PrivateRoute extends Component {

  static defaultProps: OptionalProps = {
    async: true,
  }

  props: Props

  isLoading(): boolean {
    const { async, data = {} } = this.props
    const { loading } = data

    return async && loading
  }

  isAuthenticated(): boolean {
    const { data = {} } = this.props
    const { error, user } = data

    const hasUser = notEmpty(user)
    const hasError = notEmpty(error)

    return hasUser && !hasError
  }

  renderRoute(RouteComponent: *, props: *): Children {
    const { location, ...routeProps } = props

    if (this.isAuthenticated()) {
      return (
        <RouteComponent {...routeProps} />
      )
    }

    const redirectTo = {
      pathname: '/login',
      state: { from: location },
    }

    return (
      <Redirect to={redirectTo} />
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
