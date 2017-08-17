// @flow

import React, { Component } from 'react'
import { withRouter, Route, Redirect } from 'react-router-dom'
import { autobind } from 'core-decorators'
import { partial } from 'lodash/fp'

import type { Children } from 'react'


type OptionalProps = {
  async: boolean,
  isLoading: boolean,
}

type RequiredProps = {
  component: *,
  showRoute: boolean,
  redirectPath: string,
}

type Props =
  & OptionalProps
  & RequiredProps;


@withRouter
@autobind
export default class ConditionalRoute extends Component<Props> {
  static defaultProps: OptionalProps = {
    async: true,
    isLoading: false,
  }

  props: Props

  isLoading(): boolean {
    const { async, isLoading } = this.props

    return async && isLoading
  }

  renderRoute(RouteComponent: *, props: *): Children {
    const { showRoute, redirectPath } = this.props
    const { location, ...routeProps } = props

    if (showRoute) {
      return (
        <RouteComponent {...routeProps} />
      )
    }

    const redirectTo = {
      pathname: redirectPath,
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
