
import React, { PureComponent } from 'react'
import { Container, Header } from 'semantic-ui-react'

import UserInfo from './UserInfo'


type Props = {
  match: *,
};


export default class UserProfileView extends PureComponent<Props> {
  props: Props

  render() {
    const { match } = this.props
    const { params } = match

    return (
      <Container>
        <Header as="h1" textAlign="center">
          Gamer Profile
        </Header>
        <UserInfo userId={params.userId} />
      </Container>
    )
  }
}
