// @flow

import React, { PureComponent } from 'react'
import { Segment, List, Image, Label, Button } from 'semantic-ui-react'
import { autobind } from 'core-decorators'
import { isEmpty } from 'lodash/fp'


type UserOnlineStatus = 'online' | 'offline'

export type User = {
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
  createFriend: () => *,
  setOnlineStatus: (userId: string, status: UserOnlineStatus) => *,
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

    if (!friends || isEmpty(friends)) {
      return null
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
    const { createFriend } = this.props

    const containerStyle = {
      position: 'fixed',
      bottom: 0,
      right: 20,
    }

    return (
      <div style={containerStyle}>
        <Button fluid attached="top" onClick={createFriend}>
          Add new friend
        </Button>
        <Segment attached>
          <List divided relaxed verticalAlign="middle">
            {this.renderListContent()}
          </List>
        </Segment>
      </div>
    )
  }
}
