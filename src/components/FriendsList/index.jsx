// @flow

import React, { PureComponent } from 'react'
import { graphql } from 'react-apollo'

import type { DefaultChildProps } from 'react-apollo'

import { cookies } from 'store'

// $FlowIgnore
import USER_QUERY from 'data/q-user.graphql'

// $FlowIgnore
import SET_USER_ONLINE_STATUS from 'data/m-set-user-online-status.graphql'

// import friendsOfCurrentUserQuery from 'data/q-friends-of-current-user.graphql'
// import userOnlineStatusChanged from 'data/s-user-online-status.graphql'

import FriendsList from './Component'

import type { Props as FriendsListProps } from './Component'

export type Props = DefaultChildProps<FriendsListProps, *>;


const userId = cookies.get('userId')

@graphql(SET_USER_ONLINE_STATUS)
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
    const { mutate, data = {} } = this.props
    const { loading, error, user } = data

    if (!user) {
      return null
    }

    const setOnlineStatus = (_userId, status) => mutate({
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
      />
    )
  }
}
