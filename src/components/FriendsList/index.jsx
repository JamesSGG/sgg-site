// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { graphql } from 'react-apollo'

import type { DefaultChildProps } from 'react-apollo'

import { getCurrentUserId, getIsAuthenticated } from 'store/selectors'

// $FlowIgnore
import Q_USER from 'data/q-user.graphql'

import { SECOND_IN_MS } from 'utils/date-time'

import FriendsList from './Component'


type StateProps = {
  currentUserId: ?string,
  isAuthenticated: boolean,
}

type OwnProps = {
  userQueryResult: {},
}

export type Props =
  & DefaultChildProps<OwnProps, *>
  & StateProps
  & OwnProps


const mapStateToProps = (state) => ({
  currentUserId: getCurrentUserId(state),
  isAuthenticated: getIsAuthenticated(state),
})

@connect(mapStateToProps)
@graphql(Q_USER, {
  name: 'userQueryResult',
  skip: ({ isAuthenticated }) => !isAuthenticated,
  options: ({ currentUserId }) => ({
    pollInterval: 5 * SECOND_IN_MS,
    variables: {
      id: currentUserId,
    },
  }),
})
export default class FriendsListWithData extends Component<Props> {
  props: Props

  render() {
    const { userQueryResult = {} } = this.props
    const { loading, error, user } = userQueryResult

    if (!user) {
      return null
    }

    return (
      <FriendsList
        loading={loading}
        error={error}
        friends={user.friends}
        nonFriends={user.nonFriends}
      />
    )
  }
}
