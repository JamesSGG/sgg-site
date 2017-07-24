// @flow

import React, { PureComponent } from 'react'
import { graphql } from 'react-apollo'
import { property, map } from 'lodash/fp'

import type { DefaultChildProps } from 'react-apollo'

import { cookies } from 'store'

import { SECOND_IN_MS } from 'utils/date-time'

// $FlowIgnore
import Q_USER from 'data/q-user.graphql'
// $FlowIgnore
import M_CREATE_FRIEND_FOR_USER from 'data/m-create-friend-for-user.graphql'
// $FlowIgnore
import M_SET_USER_ONLINE_STATUS from 'data/m-set-user-online-status.graphql'
// $FlowIgnore
import S_USER_ONLINE_STATUS_CHANGE from 'data/s-user-online-status-changed.graphql'

import FriendsList from './Component'

import type { User, Props as FriendsListProps } from './Component'

type SetUserOnlineStatusVars = {
  input: {
    userId: string,
    status: string,
  },
}

type OwnProps = {
  userQueryResult: {},
  setUserOnlineStatus: (variables: SetUserOnlineStatusVars) => *,
  createFriendForCurrentUser: () => *,
}

export type Props =
  & DefaultChildProps<FriendsListProps, *>
  & OwnProps;


const currentUserId = cookies.get('userId')


@graphql(M_CREATE_FRIEND_FOR_USER, {
  name: 'createFriendForCurrentUser',
  options: {
    variables: {
      id: currentUserId,
    },
  },
})
@graphql(M_SET_USER_ONLINE_STATUS, {
  name: 'setUserOnlineStatus',
})
@graphql(Q_USER, {
  skip: !currentUserId,
  options: {
    pollInterval: 20 * SECOND_IN_MS,
    variables: {
      id: currentUserId,
    },
  },
})
export default class FriendsListWithData extends PureComponent {

  props: Props

  _unsubscribe: () => *

  componentWillReceiveProps(nextProps: Props) {
    const { data: nextData = {} } = nextProps
    const { data: prevData = {} } = this.props

    const { loading, error, user: nextUser } = nextData
    const { user: prevUser } = prevData

    // Bail if the query is still loading or failed.
    if (loading || error) {
      return
    }

    // We already have an active subscription...
    if (this._unsubscribe) {
      // Bail if the data hasn't changed.
      if (nextUser === prevUser) {
        return
      }

      // The data has changed so we need to un-subscribe before re-subscribing.
      this._unsubscribe()
    }

    this._unsubscribe = nextData.subscribeToMore({
      document: S_USER_ONLINE_STATUS_CHANGE,
      variables: {
        userIds: map(property('id'), nextUser.friends),
      },
      onError: console.error, // eslint-disable-line no-console
      updateQuery(prev: { user: User }, result: *) {
        const { subscriptionData = {} } = result
        const { data = {} } = subscriptionData
        const { userOnlineStatusChanged = {} } = data
        const { userId, status } = userOnlineStatusChanged

        if (!userId || !status) {
          return prev
        }

        const { user } = prev
        const { friends } = user

        if (!friends) {
          return prev
        }

        const newFriends = friends.map((friend) => {
          if (friend.id === userId) {
            return {
              ...friend,
              onlineStatus: status,
            }
          }

          return friend
        })

        return {
          ...prev,
          user: {
            ...prev.user,
            friends: newFriends,
          },
        }
      },
    })

    // TODO: Update the query data when a subscription event is triggered.
  }

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

    const setOnlineStatus = (userId, status) => setUserOnlineStatus({
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
        friends={user.friends}
        setOnlineStatus={setOnlineStatus}
        createFriend={createFriendForCurrentUser}
      />
    )
  }
}
