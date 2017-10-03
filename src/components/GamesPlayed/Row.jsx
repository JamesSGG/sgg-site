// @flow

import React from 'react'
import { connect } from 'react-redux'
import { withStateHandlers, withProps } from 'recompose'
import { reduxForm, formValueSelector, Field } from 'redux-form'
import { Table, Button } from 'semantic-ui-react'
import { compose } from 'lodash/fp'

import type { FormProps } from 'redux-form'

import type { Game, GamePlatform, GamePlayed } from 'types/graphql-custom'

import InputText from 'components/InputText'
import InputSelect from 'components/InputSelect'

type StateProps = {
  isEditing: boolean,
}

type StateHandlerProps = {
  toggleEditing: () => StateProps,
}

type OwnProps = {
  ...GamePlayed,
  isEditable: boolean,
  allGames: Array<Game>,
  allGamePlatforms: Array<GamePlatform>,
  updateRecord: (input: *) => Promise<*>,
  deleteRecord: (input: *) => Promise<*>,
}

type Props =
  & FormProps
  & StateProps
  & StateHandlerProps
  & OwnProps

const defaultState = {
  isEditing: false,
}

const renderActionButtons = (props: Props) => {
  const {
    isEditable,
    isEditing,
    toggleEditing,
    updateRecord,
    deleteRecord,
    reset,
  } = props

  if (!isEditable) {
    return null
  }

  const handleDelete = () => deleteRecord(props.id)
  const handleUpdate = () => {
    const { id, userId, currentFormValues } = props
    const { gameId, platformId, gamerTag } = currentFormValues

    return updateRecord({
      id,
      userId,
      gameId,
      platformId,
      gamerTag,
    })
  }

  if (isEditing) {
    return (
      <Table.Cell>
        <Button
          basic
          size="tiny"
          onClick={compose(reset, toggleEditing)}
        >
          Cancel
        </Button>
        <Button
          basic
          size="tiny"
          onClick={compose(toggleEditing, handleUpdate)}
        >
          Update
        </Button>
      </Table.Cell>
    )
  }

  return (
    <Table.Cell>
      <Button
        basic
        size="tiny"
        onClick={toggleEditing}
      >
        Edit
      </Button>
      <Button
        basic
        size="tiny"
        onClick={handleDelete}
      >
        Delete
      </Button>
    </Table.Cell>
  )
}

const renderRowIfEditing = (props: Props) => {
  const {
    id,
    allGames,
    allGamePlatforms,
  } = props

  const gameOptions = allGames.map((item) => ({
    text: item.gameTitle,
    value: item.id,
  }))

  const platformOptions = allGamePlatforms.map((item) => ({
    text: item.platformName,
    value: item.id,
  }))

  return (
    <Table.Row key={id}>
      <Table.Cell>
        <Field
          name="gameId"
          component={InputSelect}
          options={gameOptions}
        />
      </Table.Cell>
      <Table.Cell>
        <Field
          name="platformId"
          component={InputSelect}
          options={platformOptions}
        />
      </Table.Cell>
      <Table.Cell>
        <Field
          name="gamerTag"
          component={InputText}
        />
      </Table.Cell>
      {renderActionButtons(props)}
    </Table.Row>
  )
}

const renderRowIfViewing = (props: Props) => {
  const {
    id,
    game = {},
    gamePlatform = {},
    gamerTag,
  } = props

  return (
    <Table.Row key={id}>
      <Table.Cell>
        {game.gameTitle}
      </Table.Cell>
      <Table.Cell>
        {gamePlatform.platformName}
      </Table.Cell>
      <Table.Cell>
        {gamerTag}
      </Table.Cell>
      {renderActionButtons(props)}
    </Table.Row>
  )
}

const renderRow = (props: Props) => (
  props.isEditing
    ? renderRowIfEditing(props)
    : renderRowIfViewing(props)
)

const mapStateToProps = (state: *, ownProps: Props) => {
  const formSelector = formValueSelector(ownProps.id)

  return {
    currentFormValues: formSelector(
      state,
      'gameId',
      'platformId',
      'gamerTag',
    ),
  }
}

const enhancer = compose(
  withProps(({ id, gamerTag, game = {}, gamePlatform = {} }: Props) => ({
    form: id,
    initialValues: {
      gamerTag,
      gameId: game.id,
      platformId: gamePlatform.id,
    },
  })),
  withStateHandlers(defaultState, {
    toggleEditing: ({ isEditing }) => () => ({
      isEditing: !isEditing,
    }),
  }),
  connect(mapStateToProps),
  reduxForm(),
)

const GamePlayedRow = enhancer(renderRow)

export default GamePlayedRow
