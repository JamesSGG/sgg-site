// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { graphql } from 'react-apollo'
import { property, map } from 'lodash/fp'

import type { DefaultChildProps } from 'react-apollo'

import { getCurrentUserId, getIsAuthenticated } from 'store/selectors'

// $FlowIgnore
import Q_USER from 'data/q-user.graphql'
// $FlowIgnore
import M_CREATE_FRIEND_FOR_USER from 'data/m-create-friend-for-user.graphql'
// $FlowIgnore
import M_SET_USER_ONLINE_STATUS from 'data/m-set-user-online-status.graphql'
// $FlowIgnore
import S_USER_ONLINE_STATUS_CHANGE from 'data/s-user-online-status-changed.graphql'

import { SECOND_IN_MS } from 'utils/date-time'

import FriendsList from './Component'

import type { User, Props as FriendsListProps } from './Component'

type SetUserOnlineStatusVars = {
  input: {
    userId: string,
    status: string,
  },
}

type StateProps = {
  currentUserId: ?string,
  isAuthenticated: boolean,
}

type OwnProps = {
  userQueryResult: {},
  setUserOnlineStatus: (variables: SetUserOnlineStatusVars) => *,
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
      const { friends = [] } = user

      newData.user.friends = friends.concat([result])

      store.writeQuery({ query, variables, data: newData })
    },
  }),
})
@graphql(M_SET_USER_ONLINE_STATUS, {
  name: 'setUserOnlineStatus',
})
@graphql(Q_USER, {
  skip: ({ isAuthenticated }) => !isAuthenticated,
  name: 'userQueryResult',
  options: ({ currentUserId }) => ({
    pollInterval: 20 * SECOND_IN_MS,
    variables: {
      id: currentUserId,
    },
  }),
})
export default class FriendsListWithData extends Component {

  props: Props

  _unsubscribe: () => *

  componentWillReceiveProps(nextProps: Props) {
    const { userQueryResult: nextData = {} } = nextProps
    const { userQueryResult: prevData = {} } = this.props

    const { loading, error, user: nextUser = {} } = nextData
    const { user: prevUser = {} } = prevData

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

    if (!nextData.subscribeToMore) {
      return
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

        const { user = {} } = prev
        const { friends = [], nonFriends = [] } = user

        const setNewUserStatus = (friend) => {
          if (friend.id === userId) {
            return {
              ...friend,
              onlineStatus: status,
            }
          }

          return friend
        }

        return {
          ...prev,
          user: {
            ...prev.user,
            friends: friends.map(setNewUserStatus),
            nonFriends: nonFriends.map(setNewUserStatus),
          },
        }
      },
    })

    // TODO: Update the query data when a subscription event is triggered.
  }

  render() {
    const {
      userQueryResult = {},
      setUserOnlineStatus,
      createFriendForCurrentUser,
    } = this.props

    const { loading, error, user } = userQueryResult

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
        nonFriends={user.nonFriends}
        setOnlineStatus={setOnlineStatus}
        createFriend={createFriendForCurrentUser}
      />
    )
  }
}
