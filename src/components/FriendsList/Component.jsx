// @flow

import React, { PureComponent } from 'react'
import { List, Image, Label } from 'semantic-ui-react'
import { autobind } from 'core-decorators'


type UserOnlineStatus = 'online' | 'offline'

type User = {
  id: string,
  displayName: string,
  imageUrl: string,
  onlineStatus: UserOnlineStatus,
}

type Error = {
  message: string,
}

export type Props = {
  loading?: boolean,
  error?: ?Error,
  friends: Array<User>,
  setOnlineStatus: (userId: string, status: 'online' | 'offline') => *,
};


@autobind
export default class FriendsList extends PureComponent {

  static defaultProps = {
    loading: false,
    error: null,
  }

  props: Props

  renderListContent() {
    const { loading, error, friends } = this.props

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

    return friends.map((user) => {
      const { setOnlineStatus } = this.props
      const { id, displayName, imageUrl, onlineStatus } = user
      const isOnline = onlineStatus === 'online'
      const indicatorColor = isOnline ? 'green' : 'grey'
      const handleClick = () => {
        const newStatus = isOnline ? 'offline' : 'online'

        setOnlineStatus(id, newStatus)
      }

      return (
        <List.Item key={id} onClick={handleClick} style={{ cursor: 'pointer' }}>
          <Label
            empty
            circular
            horizontal
            color={indicatorColor}
          />
          <Image
            avatar
            src={imageUrl}
          />
          <List.Content>
            {displayName}
          </List.Content>
        </List.Item>
      )
    })
  }

  render() {
    const containerStyle = {
      position: 'fixed',
      bottom: 0,
      right: 0,
    }

    return (
      <div style={containerStyle}>
        <List divided relaxed verticalAlign="middle">
          {this.renderListContent()}
        </List>
      </div>
    )
  }
}
