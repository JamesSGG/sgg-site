
import { handleActions, combineActions } from 'redux-actions'

import actions from './actions'

type AppState = {
  currentUserId: ?string,
  isAuthenticated: boolean,
}

export const initialState: AppState = {
  currentUserId: null,
  isAuthenticated: false,
}

const { currentUser } = actions
const { login, logout } = currentUser

const reducerMap = {
  [combineActions(login, logout)](state, action) {
    const { userId, isAuthenticated } = action.payload

    return {
      ...state,
      currentUserId: userId,
      isAuthenticated,
    }
  },
}

export default handleActions(reducerMap, initialState)
