// @flow

import React, { PureComponent } from 'react'
import { graphql } from 'react-apollo'

import type { DefaultChildProps } from 'react-apollo'

import { cookies } from 'store'

// $FlowIgnore
import USER_QUERY from 'data/q-user.graphql'

// $FlowIgnore
import CREATE_FRIEND_FOR_USER_MUTATION from 'data/m-create-friend-for-user.graphql'

// $FlowIgnore
import SET_USER_ONLINE_STATUS_MUTATION from 'data/m-set-user-online-status.graphql'

import FriendsList from './Component'

import type { Props as FriendsListProps } from './Component'

export type Props = DefaultChildProps<FriendsListProps, *>;


const userId = cookies.get('userId')

@graphql(CREATE_FRIEND_FOR_USER_MUTATION, {
  name: 'createFriendForCurrentUser',
  options: {
    variables: {
      id: userId,
    },
  },
})
@graphql(SET_USER_ONLINE_STATUS_MUTATION, {
  name: 'setUserOnlineStatus',
})
@graphql(USER_QUERY, {
  skip: !userId,
  options: {
    pollInterval: 2500,
    variables: {
      id: userId,
    },
  },
})
export default class FriendsListWithData extends PureComponent {

  props: Props

  render() {
    const {
      data = {},
      setUserOnlineStatus,
      createFriendForCurrentUser,
    } = this.props

    const { loading, error, user } = data

    if (!user) {
      return null
    }

    const setOnlineStatus = (_userId, status) => setUserOnlineStatus({
      variables: {
        input: {
          userId: _userId,
          status,
        },
      },
    })

    return (
      <FriendsList
        loading={loading}
        error={error}
        friends={user.friends}
        setOnlineStatus={setOnlineStatus}
        createFriend={createFriendForCurrentUser}
      />
    )
  }
}
