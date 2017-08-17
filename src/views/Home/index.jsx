// @flow

import React, { PureComponent } from 'react'
import { Container, Header } from 'semantic-ui-react'

type Props = {}

export default class HomeView extends PureComponent<Props> {
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
