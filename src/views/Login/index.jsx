
import React, { PureComponent } from 'react'
import { Container, Header, Button, Icon } from 'semantic-ui-react'

export default class LoginView extends PureComponent {

  render() {
    return (
      <Container text>
        <Header>
          Life is too short to play with idiots and assholes.
        </Header>
        <p>
          <Button color="facebook">
            <Icon name="facebook" /> Sign Up with Facebook
          </Button>
        </p>
        <p>
          <Button primary>Sign In</Button>
        </p>
      </Container>
    )
  }
}
