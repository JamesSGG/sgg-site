
import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { Grid, Item, Dropdown, Input } from 'semantic-ui-react'

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
export default class UserInfo extends Component {

  props: Props

  render() {
    const { data, loading, error } = this.props

    console.log(data) // eslint-disable-line no-console

    if (loading || error || !data) {
      return null
    }

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
                    selection
                    multiple
                    placeholder="Select a game"
                    options={gamesPlayedOptions}
                  />
                </Grid.Column>
                <Grid.Column>
                  <p>Gamer Tags</p>
                  <Input
                    icon="tags"
                    iconPosition="left"
                    action="Add tag"
                  />
                </Grid.Column>
              </Grid>
            </Item.Description>
          </Item.Content>
        </Item>
      </Item.Group>
    )
  }
}
