// @flow

import React, { PureComponent } from 'react'
import { List, Image, Label } from 'semantic-ui-react'

type Props = {}

export default class FriendsList extends PureComponent {

  props: Props

  render() {
    const fakeUsers = [
      {
        name: 'Sarah Rowdy',
        online: true,
      },
      {
        name: 'Bill Paxton',
        online: true,
      },
      {
        name: 'Jill Manboe',
        online: true,
      },
      {
        name: 'Jon Hardy',
        online: true,
      },
      {
        name: 'Mark Handar',
        online: true,
      },
      {
        name: 'Paul Billon',
        online: false,
      },
      {
        name: 'Henry McLaurn',
        online: false,
      },
      {
        name: 'Bob Sagget',
        online: false,
      },
      {
        name: 'Tim Hooley',
        online: false,
      },
      {
        name: 'Sam Joeman',
        online: false,
      },
      {
        name: 'Tersea Maywether',
        online: false,
      },
      {
        name: 'Don Trump',
        online: false,
      },
      {
        name: '',
        online: false,
      },
    ]

    const listItems = fakeUsers.map((user) => (
      <List.Item>
        <Label
          empty
          circular
          horizontal
          color={user.online ? 'green' : 'grey'}
        />
        <Image avatar src="http://ravatar.photos/40/40/" />
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
