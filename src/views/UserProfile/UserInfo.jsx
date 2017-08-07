
import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { Grid, Item, Dropdown } from 'semantic-ui-react'
import { autobind } from 'core-decorators'

import type { DefaultChildProps } from 'react-apollo'

// $FlowIgnore
import Q_USER from 'data/q-user.graphql'


type Props = DefaultChildProps<*, *>;


const { localStorage } = window

const currentUserId = localStorage.getItem('userId')

@graphql(Q_USER, {
  name: 'userQueryResult',
  skip: !currentUserId,
  options: ({ userId }) => ({
    variables: {
      id: userId || currentUserId,
    },
  }),
})
@autobind
export default class UserInfo extends Component {

  props: Props

  renderGamesPlayed() {
    const { userId } = this.props

    if (userId) {
      return (
        <p>
          League of Legends
          <br />
          DotA 2
        </p>
      )
    }

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
      <Dropdown
        selection
        multiple
        placeholder="Select a game"
        options={gamesPlayedOptions}
      />
    )
  }

  renderGamerTags() {
    const { userId, user = {} } = this.props

    if (userId) {
      return (
        <p>
          XYZexampleTag
          <br />
          ABCexampleTag
        </p>
      )
    }

    const { gamerTags } = user

    return (
      <Dropdown
        selection
        multiple
        search
        allowAdditions
        placeholder="Add a gamer tag"
        options={[]}
        value={gamerTags}
      />
    )
  }

  render() {
    const { userQueryResult, loading, error } = this.props

    if (loading || error || !userQueryResult) {
      return null
    }

    const { user = {} } = userQueryResult
    const { displayName, imageUrl } = user

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
                  {this.renderGamesPlayed()}
                </Grid.Column>
                <Grid.Column>
                  <p>Gamer Tags</p>
                  {this.renderGamerTags()}
                </Grid.Column>
              </Grid>
            </Item.Description>
          </Item.Content>
        </Item>
      </Item.Group>
    )
  }
}
