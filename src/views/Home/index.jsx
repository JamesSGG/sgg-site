
import React, { PureComponent } from 'react'
import { Container } from 'semantic-ui-react'

import FriendsList from 'components/FriendsList'

export default class HomeView extends PureComponent {

  render() {
    return (
      <div>
        <Container text>
          <h1>Home View</h1>
        </Container>
        <FriendsList />
      </div>
    )
  }
}
