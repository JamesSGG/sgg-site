// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { graphql } from 'react-apollo'
import { getOr } from 'lodash/fp'

import type { DefaultChildProps } from 'react-apollo'

import { getCurrentUserId, getIsAuthenticated } from 'store/selectors'

// $FlowIgnore
import Q_USER from 'data/q-user.graphql'
// $FlowIgnore
import M_CREATE_FRIEND_FOR_USER from 'data/m-create-friend-for-user.graphql'

import { SECOND_IN_MS } from 'utils/date-time'

import FriendsList from './Component'

import type { Props as FriendsListProps } from './Component'


type StateProps = {
  currentUserId: ?string,
  isAuthenticated: boolean,
}

type OwnProps = {
  userQueryResult: {},
  createFriendForCurrentUser: () => *,
}

export type Props =
  & DefaultChildProps<FriendsListProps, *>
  & StateProps
  & OwnProps


const mapStateToProps = (state) => ({
  currentUserId: getCurrentUserId(state),
  isAuthenticated: getIsAuthenticated(state),
})

@connect(mapStateToProps)
@graphql(M_CREATE_FRIEND_FOR_USER, {
  name: 'createFriendForCurrentUser',
  options: ({ currentUserId }) => ({
    variables: {
      id: currentUserId,
    },
    update(store, { data }) {
      const { createFriendForUser: result } = data

      const query = Q_USER
      const variables = { id: currentUserId }

      const newData = store.readQuery({ query, variables })

      const { user = {} } = newData
      const friends = getOr([], 'friends', user)

      newData.user.friends = friends.concat([result])

      store.writeQuery({ query, variables, data: newData })
    },
  }),
})
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
    const {
      userQueryResult = {},
      createFriendForCurrentUser,
    } = this.props

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
        createFriend={createFriendForCurrentUser}
      />
    )
  }
}
