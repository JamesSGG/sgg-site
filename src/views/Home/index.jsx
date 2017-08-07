
import React, { PureComponent } from 'react'
import { Container, Header } from 'semantic-ui-react'

export default class HomeView extends PureComponent {

  render() {
    return (
      <div>
        <Container text>
          <Header as="h1" textAlign="center">
            Home View
          </Header>
        </Container>
      </div>
    )
  }
}
