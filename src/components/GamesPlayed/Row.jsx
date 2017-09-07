// @flow

import React from 'react'
import { withStateHandlers, withProps } from 'recompose'
import { reduxForm, Field } from 'redux-form'
import { Table, Button } from 'semantic-ui-react'
import { compose, identity } from 'lodash/fp'

import type { FormProps } from 'redux-form'

import InputText from 'components/InputText'
import InputSelect from 'components/InputSelect'

type StateProps = {
  isEditing: boolean,
}

type StateHandlerProps = {
  toggleEditing: () => StateProps,
}

type OwnProps = {
  id: string,
  gameTitle: ?string,
  gamePlatform: ?string,
  gamerTag: ?string,
  isEditable: boolean,
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

  const maybeReset = isEditing ? reset : identity
  const handleEditClick = compose(maybeReset, toggleEditing)
  const handleDelete = () => deleteRecord(props.id)
  const handleUpdate = () => {
    const { id, userId, gameTitle, gamePlatform, gamerTag } = props

    return updateRecord({ id, userId, gameTitle, gamePlatform, gamerTag })
  }

  return (
    <Table.Cell>
      <Button
        basic
        size="tiny"
        onClick={handleEditClick}
      >
        {isEditing ? 'Cancel' : 'Edit'}
      </Button>
      {isEditing && (
        <Button
          basic
          size="tiny"
          onClick={handleUpdate}
        >
          Update
        </Button>
      )}
      {!isEditing && (
        <Button
          basic
          size="tiny"
          onClick={handleDelete}
        >
          Delete
        </Button>
      )}
    </Table.Cell>
  )
}

const renderRowIfEditing = (props: Props) => {
  const { id } = props

  const formatPlatform = (value) => {
    if (value === 'pc') {
      return 'PC'
    }

    if (value === 'xbox') {
      return 'Xbox'
    }

    if (value === 'playstation') {
      return 'PlayStation'
    }

    return value
  }

  const games = [
    'Overwatch',
    'DotA 2',
    'League of Legends',
    'Rainbow 6: Siege',
  ]

  const platforms = [
    'PC',
    'Xbox',
    'PlayStation',
  ]

  const gameOptions = games.map((item) => ({
    text: item,
    value: item,
  }))

  const platformOptions = platforms.map((item) => ({
    text: formatPlatform(item),
    value: item,
  }))

  return (
    <Table.Row key={id}>
      <Table.Cell>
        <Field
          name="gameTitle"
          component={InputSelect}
          options={gameOptions}
        />
      </Table.Cell>
      <Table.Cell>
        <Field
          name="gamePlatform"
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
    gameTitle,
    gamePlatform,
    gamerTag,
  } = props

  return (
    <Table.Row key={id}>
      <Table.Cell>
        {gameTitle}
      </Table.Cell>
      <Table.Cell>
        {gamePlatform}
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

const enhancer = compose(
  withProps((props: Props) => ({
    form: props.gameTitle,
    initialValues: props,
  })),
  withStateHandlers(defaultState, {
    toggleEditing: ({ isEditing }) => () => ({
      isEditing: !isEditing,
    }),
  }),
  reduxForm(),
)

const GamePlayedRow = enhancer(renderRow)

export default GamePlayedRow
