// @flow

import React from 'react'
import { connect } from 'react-redux'
import { withStateHandlers, withProps } from 'recompose'
import { reduxForm, formValueSelector, Field } from 'redux-form'
import { Table, Button } from 'semantic-ui-react'
import { compose } from 'lodash/fp'

import type { FormProps } from 'redux-form'

import type {
  ID,
  Game,
  GamePlatform,
  PlayedGame,
} from 'types/graphql-custom'

import { getCurrentUserId } from 'store/selectors'

import InputText from 'components/InputText'
import InputSelect from 'components/InputSelect'

import './styles.css'

type StateProps = {
  isEditing: boolean,
}

type StateHandlerProps = {
  toggleEditing: () => StateProps,
}

type OwnProps = {
  ...PlayedGame,
  currentUserId: ?ID,
  isEditable: boolean,
  isNewRecord: boolean,
  formName: string,
  allGames: Array<Game>,
  allGamePlatforms: Array<GamePlatform>,
  createRecord: (input: *) => Promise<*>,
  updateRecord: (input: *) => Promise<*>,
  deleteRecord: (input: *) => Promise<*>,
}

type Props =
  & FormProps
  & StateProps
  & StateHandlerProps
  & OwnProps

const renderActionButtons = (props: Props) => {
  const {
    isEditable,
    isEditing,
    isNewRecord,
    toggleEditing,
    createRecord,
    updateRecord,
    deleteRecord,
    reset,
  } = props

  if (!isEditable) {
    return null
  }

  const handleDelete = () => {
    const { id } = props

    return deleteRecord(id)
  }

  const handleCreate = () => {
    const { currentUserId, currentFormValues } = props
    const { gameId, platformId, gamerTag } = currentFormValues

    return createRecord({
      userId: currentUserId,
      gameId,
      platformId,
      gamerTag,
    })
  }

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

  if (isNewRecord) {
    return (
      <Table.Cell styleName="action-buttons-cell">
        <Button
          basic
          size="tiny"
          onClick={compose(handleCreate, toggleEditing)}
        >
          Create
        </Button>
      </Table.Cell>
    )
  }

  if (isEditing) {
    return (
      <Table.Cell styleName="action-buttons-cell">
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
          onClick={compose(handleUpdate, toggleEditing)}
        >
          Update
        </Button>
      </Table.Cell>
    )
  }

  return (
    <Table.Cell styleName="action-buttons-cell">
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
      <Table.Cell >
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
  const formSelector = formValueSelector(ownProps.formName)

  return {
    currentUserId: getCurrentUserId(state),
    currentFormValues: formSelector(
      state,
      'gameId',
      'platformId',
      'gamerTag',
    ),
  }
}

const enhancer = compose(
  connect(mapStateToProps),

  withProps(({ formName, gamerTag, game = {}, gamePlatform = {} }: Props) => ({
    form: formName,
    initialValues: {
      gamerTag,
      gameId: game.id,
      platformId: gamePlatform.id,
    },
  })),

  withStateHandlers(
    ({ isEditing = false, isNewRecord = false }) => ({
      isEditing: isEditing || isNewRecord,
    }),
    {
      toggleEditing: ({ isEditing }) => () => ({
        isEditing: !isEditing,
      }),
    },
  ),

  reduxForm(),
)

const PlayedGameRow = enhancer(renderRow)

export default PlayedGameRow
