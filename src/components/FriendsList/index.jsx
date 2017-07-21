// @flow

import React, { PureComponent } from 'react'
import { graphql } from 'react-apollo'

import type { DefaultChildProps } from 'react-apollo'

// $FlowIgnore
import CURRENT_USER_QUERY from 'data/q-current-user.graphql'

// $FlowIgnore
import SET_USER_ONLINE_STATUS from 'data/m-set-user-online-status.graphql'

// import friendsOfCurrentUserQuery from 'data/q-friends-of-current-user.graphql'
// import userOnlineStatusChanged from 'data/s-user-online-status.graphql'

import FriendsList from './Component'

import type { Props as FriendsListProps } from './Component'

export type Props = DefaultChildProps<FriendsListProps, *>;


@graphql(SET_USER_ONLINE_STATUS)
@graphql(CURRENT_USER_QUERY, {
  options: {
    pollInterval: 2500,
  },
})
export default class FriendsListWithData extends PureComponent {

  props: Props

  render() {
    const {
      mutate,
      data: {
        loading,
        error,
        currentUser,
      },
    } = this.props

    if (!currentUser) {
      return null
    }

    const setOnlineStatus = (userId, status) => mutate({
      variables: {
        input: {
          userId,
          status,
        },
      },
    })

    return (
      <FriendsList
        loading={loading}
        error={error}
        friends={currentUser.friends}
        setOnlineStatus={setOnlineStatus}
      />
    )
  }
}
