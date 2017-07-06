
import React, { PureComponent } from 'react'
import { Message } from 'semantic-ui-react'

export default class LoginView extends PureComponent {

  render() {
    return (
      <Message info>
        <Message.Header>
          You must be logged in to view this page.
        </Message.Header>
        <p>
          Please log in and try again.
        </p>
      </Message>
    )
  }
}
