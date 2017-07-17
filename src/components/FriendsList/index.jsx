// @flow

import React, { PureComponent } from 'react'
import { graphql } from 'react-apollo'
import { List, Image, Label } from 'semantic-ui-react'
import { kebabCase } from 'lodash/fp'

import userOnlineStatusChanged from 'data/subscriptions/user-online-status.graphql'

type Props = {}

export default class FriendsList extends PureComponent {

  props: Props

  render() {
    const fakeUsers = [
      {
        id: 1,
        name: 'Sarah Rowdy',
        online: true,
      },
      {
        id: 2,
        name: 'Bill Paxton',
        online: true,
      },
      {
        id: 3,
        name: 'Jill Manboe',
        online: true,
      },
      {
        id: 4,
        name: 'Jon Hardy',
        online: true,
      },
      {
        id: 5,
        name: 'Mark Handar',
        online: true,
      },
      {
        id: 6,
        name: 'Paul Billon',
        online: false,
      },
      {
        id: 7,
        name: 'Henry McLaurn',
        online: false,
      },
      {
        id: 8,
        name: 'Bob Sagget',
        online: false,
      },
      {
        id: 9,
        name: 'Tim Hooley',
        online: false,
      },
      {
        id: 10,
        name: 'Sam Joeman',
        online: false,
      },
      {
        id: 11,
        name: 'Tersea Maywether',
        online: false,
      },
      {
        id: 12,
        name: 'Don Trump',
        online: false,
      },
      {
        id: 13,
        name: 'Hillary Clinton',
        online: false,
      },
    ]

    const listItems = fakeUsers.map((user) => (
      <List.Item key={user.id}>
        <Label
          empty
          circular
          horizontal
          color={user.online ? 'green' : 'grey'}
        />
        <Image
          avatar
          src={`https://api.adorable.io/avatars/40/${kebabCase(user.name)}@adorable.png`}
        />
        <List.Content>{user.name}</List.Content>
      </List.Item>
    ))

    const containerStyle = {
      position: 'fixed',
      bottom: 0,
      right: 0,
    }

    return (
      <div style={containerStyle}>
        <List divided relaxed verticalAlign="middle">
          {listItems}
        </List>
      </div>
    )
  }
}
