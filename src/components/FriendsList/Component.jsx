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

import moment from 'moment'
import { autobind } from 'core-decorators'
import { property, sortBy, isEmpty } from 'lodash/fp'

import FlipList from 'components/FlipList'

const isUserOnline = ({ lastSeenAt }) => {
  const lastSeenTimeMin = moment().subtract(30, 'seconds')
  const isOnline = moment(lastSeenAt).isSameOrAfter(lastSeenTimeMin)

  return isOnline
}


export type User = {
  id: string,
  displayName: string,
  imageUrl: string,
  lastSeenAt: string,
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
}


@autobind
export default class FriendsList extends PureComponent<Props> {
  static defaultProps = {
    loading: false,
    error: null,
  }

  props: Props

  sortUsers = sortBy([
    // Sort online users first
    (user) => (isUserOnline(user) ? 0 : 1),
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
    const { loading, error } = this.props

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
      const { id, displayName, imageUrl } = user

      const indicatorColor = isUserOnline(user) ? 'green' : 'grey'
      const userProfileUrl = `/profile/${id}`

      return (
        <List.Item key={id}>
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
        fluid
        panels={panels}
        exclusive={false}
        defaultActiveIndex={[0, 1]}
      />
    )
  }
}
