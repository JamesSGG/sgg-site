
import React, { PureComponent } from 'react'
import FriendsList from 'components/FriendsList'

export default class HomeView extends PureComponent {

  render() {
    return (
      <div>
        <h1>Home View</h1>
        <FriendsList />
      </div>
    )
  }
}
