// @flow

import React from 'react'
import { Table, Button } from 'semantic-ui-react'
import { withStateHandlers } from 'recompose'
import { complement, allPass, isArray, isEmpty } from 'lodash/fp'

import type {
  Game,
  GamePlatform,
  PlayedGame,
} from 'types/graphql-custom'

import InfoTooltip from 'components/InfoTooltip'

import GamesPlayedRow from './Row'

export type Props = {
  allGames: Array<Game>,
  allGamePlatforms: Array<GamePlatform>,
  playedGames: Array<PlayedGame>,
  isEditable: boolean,
  isShowingAddNew: boolean,
  toggleAddNew: () => void,
  createRecord: (input: *) => Promise<*>,
  updateRecord: (input: *) => Promise<*>,
  deleteRecord: (input: *) => Promise<*>,
}

export type ComponentState = {
  isShowingAddNew: boolean,
}

export const defaultState: ComponentState = {
  isShowingAddNew: false,
}

export const enhancer = withStateHandlers(defaultState, {
  toggleAddNew: (state: ComponentState) => () => ({
    isShowingAddNew: !state.isShowingAddNew,
  }),
})

export function component(props: Props) {
  const {
    allGames,
    allGamePlatforms,
    playedGames,
    isEditable,
    isShowingAddNew,
    toggleAddNew,
    createRecord,
    updateRecord,
    deleteRecord,
  } = props

  const isNonEmptyArray = allPass([
    isArray,
    complement(isEmpty),
  ])

  const sharedRowProps = {
    allGames,
    allGamePlatforms,
    isEditable,
    createRecord,
    updateRecord,
    deleteRecord,
  }

  const renderRow = (playedGame: PlayedGame) => (
    <GamesPlayedRow
      {...playedGame}
      {...sharedRowProps}
      key={playedGame.id}
      formName={playedGame.id}
    />
  )

  return (
    <div>
      <Table basic="very">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>
              Game
            </Table.HeaderCell>
            <Table.HeaderCell>
              Platform
            </Table.HeaderCell>
            <Table.HeaderCell>
              Gamer Tag
              <InfoTooltip
                wide
                content="Xbox Live gamer tag, PSN user name, Steam ID, etc."
              />
            </Table.HeaderCell>
            {isEditable && (
              <Table.HeaderCell>
                Actions
              </Table.HeaderCell>
            )}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {isNonEmptyArray(playedGames) && playedGames.map(renderRow)}
          {isShowingAddNew && (
            <GamesPlayedRow
              {...sharedRowProps}
              isNewRecord
              key="new-game-played-row"
              formName="new-game-played-form"
              handleAfterCreate={toggleAddNew}
            />
          )}
        </Table.Body>
      </Table>
      {isEditable && (
        <Button primary onClick={toggleAddNew}>
          {isShowingAddNew ? 'Cancel' : 'Add new game'}
        </Button>
      )}
    </div>
  )
}

const GamesPlayedTable = enhancer(component)

export default GamesPlayedTable
