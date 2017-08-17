// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { graphql } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import { autobind } from 'core-decorators'

import type { Children } from 'react'
import type { DefaultChildProps } from 'react-apollo'

import { getCurrentUserId, getIsAuthenticated } from 'store/selectors'

// $FlowIgnore
import USER_QUERY from 'data/q-user.graphql'

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
@graphql(USER_QUERY, {
  skip: ({ isAuthenticated }) => !isAuthenticated,
  options: ({ currentUserId }) => ({
    variables: {
      id: currentUserId,
    },
  }),
})
@autobind
export default class LoggedInRoute extends Component<Props> {
  static defaultProps: OptionalProps = {
    async: true,
  }

  props: Props

  isLoading(): boolean {
    const { async, data = {} } = this.props
    const { loading } = data

    return async && loading
  }

  render(): Children {
    const { component, isAuthenticated, ...restProps } = this.props
    const isLoading = this.isLoading()

    return (
      <ConditionalRoute
        {...restProps}
        component={component}
        isLoading={isLoading}
        showRoute={isAuthenticated}
        redirectPath="/login"
      />
    )
  }
}
