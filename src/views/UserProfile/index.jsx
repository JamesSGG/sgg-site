
import React, { PureComponent } from 'react'
import { graphql } from 'react-apollo'
import { Container, Grid, Item, Header, Dropdown, Input } from 'semantic-ui-react'

import type { DefaultChildProps } from 'react-apollo'

// $FlowIgnore
import Q_USER from 'data/q-user.graphql'


type Props = DefaultChildProps<*, *>;


const { localStorage } = window

const currentUserId = localStorage.getItem('userId')

@graphql(Q_USER, {
  skip: !currentUserId,
  options: {
    variables: {
      id: currentUserId,
    },
  },
})
export default class UserProfileView extends PureComponent {

  props: Props

  render() {
    const { data } = this.props
    const { user = {} } = data
    const { displayName, imageUrl } = user

    const gamesPlayedOptions = [
      {
        text: 'Overwatch',
        value: 'overwatch',
      },
      {
        text: 'DotA 2',
        value: 'dota2',
      },
      {
        text: 'League of Legends',
        value: 'league-of-legends',
      },
      {
        text: 'Rainbow 6: Siege',
        value: 'rainbow-6-siege',
      },
    ]

    return (
      <div>
        <Container text>
          <Header as="h1" textAlign="center">
            Gamer Profile
          </Header>
          <Item.Group>
            <Item>
              <Item.Image size="tiny" src={imageUrl} />

              <Item.Content>
                <Item.Header>
                  {displayName}
                </Item.Header>
                <Item.Description>
                  <Grid columns={2}>
                    <Grid.Column>
                      <p>Games Played</p>
                      <Dropdown
                        placeholder="Select a game"
                        options={gamesPlayedOptions}
                      />
                    </Grid.Column>
                    <Grid.Column>
                      <p>Gamer Tags</p>
                      <Input
                        icon="tags"
                        iconPosition="left"
                        placeholder="Add gamer tag"
                      />
                    </Grid.Column>
                  </Grid>
                </Item.Description>
              </Item.Content>
            </Item>
          </Item.Group>
        </Container>
      </div>
    )
  }
}
