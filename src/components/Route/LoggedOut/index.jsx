// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { autobind } from 'core-decorators'

import type { Children } from 'react'
import type { DefaultChildProps } from 'react-apollo'

import { getCurrentUserId, getIsAuthenticated } from 'store/selectors'

import ConditionalRoute from 'components/Route/Conditional'


type OptionalProps = {
  async: boolean,
}

type RequiredProps = {
  component: *,
}

type StateProps = {
  currentUserId: ?string,
  isAuthenticated: boolean,
}

type OwnProps =
  & OptionalProps
  & RequiredProps
  & StateProps

type Props = DefaultChildProps<OwnProps, *>;


const mapStateToProps = (state) => ({
  currentUserId: getCurrentUserId(state),
  isAuthenticated: getIsAuthenticated(state),
})

@withRouter
@connect(mapStateToProps)
@autobind
export default class LoggedOutRoute extends Component<Props> {
  static defaultProps: OptionalProps = {
    async: true,
  }

  props: Props

  render(): Children {
    const { component, isAuthenticated, ...restProps } = this.props

    return (
      <ConditionalRoute
        {...restProps}
        async={false}
        component={component}
        showRoute={!isAuthenticated}
        redirectPath="/"
      />
    )
  }
}
