
import React, { Component } from 'react'
import { Container, Header } from 'semantic-ui-react'

// import UserInfo from './UserInfo'


type Props = {};


export default class UserProfileView extends Component {

  props: Props

  render() {
    return (
      <Container text>
        <Header as="h1" textAlign="center">
          Gamer Profile
        </Header>
        {/* <UserInfo /> */}
      </Container>
    )
  }
}
