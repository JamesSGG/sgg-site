
import React, { PureComponent } from 'react'
import { Message } from 'semantic-ui-react'

export default class NotFoundView extends PureComponent {

  render() {
    return (
      <Message warning>
        <Message.Header>
          Page Not Found
        </Message.Header>
        <p>
          The page you requested could not be found.
        </p>
      </Message>
    )
  }
}
