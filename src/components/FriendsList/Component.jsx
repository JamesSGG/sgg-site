// @flow

import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import FlipMove from 'react-flip-move'
import {
  List,
  Image,
  Label,
  Accordion,
} from 'semantic-ui-react'

import { autobind } from 'core-decorators'
import { property, matchesProperty, sortBy, isEmpty } from 'lodash/fp'

import FlipList from 'components/FlipList'


type UserOnlineStatus = 'online' | 'offline'

export type User = {
  id: string,
  displayName: string,
  imageUrl: string,
  onlineStatus: UserOnlineStatus,
  friends?: Array<User>,
  nonFriends?: Array<User>,
}

type Error = {
  message: string,
}

export type Props = {
  loading?: boolean,
  error?: ?Error,
  friends: Array<User>,
  nonFriends: Array<User>,
  setOnlineStatus: (userId: string, status: UserOnlineStatus) => *,
};


@autobind
export default class FriendsList extends PureComponent {

  static defaultProps = {
    loading: false,
    error: null,
  }

  props: Props

  sortUsers = sortBy([
    // Put offline users at the bottom (true > false when sorting)
    matchesProperty('onlineStatus', 'offline'),
    property('displayName'),
  ])

  renderList(users: Array<User>) {
    const flipMoveProps = {
      typeName: FlipList,
      staggerDurationBy: 50,
    }

    const listProps = {
      divided: true,
      relaxed: true,
      selection: true,
      verticalAlign: 'middle',
      style: {
        overflow: 'auto',
      },
    }

    return (
      <FlipMove {...flipMoveProps} {...listProps}>
        {this.renderListContent(users)}
      </FlipMove>
    )
  }

  renderListContent(users: Array<User>) {
    const { loading, error, setOnlineStatus } = this.props

    if (loading) {
      return (
        <List.Item key="loading">
          <List.Content>
            Loading...
          </List.Content>
        </List.Item>
      )
    }

    if (error) {
      return (
        <List.Item key="error">
          <List.Content>
            {error.message}
          </List.Content>
        </List.Item>
      )
    }

    if (!users || isEmpty(users)) {
      return null
    }

    return this.sortUsers(users).map((user) => {
      const { id, displayName, imageUrl, onlineStatus } = user
      const isOnline = onlineStatus === 'online'
      const indicatorColor = isOnline ? 'green' : 'grey'
      const userProfileUrl = `/profile/${id}`

      const handleIconClick = () => {
        const newStatus = isOnline ? 'offline' : 'online'

        setOnlineStatus(id, newStatus)
      }

      return (
        <List.Item key={id}>
          <Label
            empty
            circular
            horizontal
            color={indicatorColor}
            onClick={handleIconClick}
          />
          <Image
            avatar
            src={imageUrl}
          />
          <List.Content>
            <List.Description as={Link} to={userProfileUrl}>
              {displayName}
            </List.Description>
          </List.Content>
        </List.Item>
      )
    })
  }

  render() {
    const { friends, nonFriends } = this.props

    const panels = [
      {
        key: 'friends-list',
        title: 'Friends',
        content: this.renderList(friends),
      },
      {
        key: 'non-friends-list',
        title: 'All SGG Members',
        content: this.renderList(nonFriends),
      },
    ]

    return (
      <Accordion
        styled
        fluid
        panels={panels}
      />
    )
  }
}
