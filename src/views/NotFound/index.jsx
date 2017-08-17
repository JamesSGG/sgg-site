// @flow

import React, { PureComponent } from 'react'
import { Container, Message } from 'semantic-ui-react'

type Props = {}

export default class NotFoundView extends PureComponent<Props> {
  render() {
    return (
      <Container text>
        <Message warning>
          <Message.Header>
            Page Not Found
          </Message.Header>
          <p>
            The page you requested could not be found.
          </p>
        </Message>
      </Container>
    )
  }
}
