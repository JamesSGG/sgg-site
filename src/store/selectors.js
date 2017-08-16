
import { compose, property } from 'lodash/fp'

const getAppSlice = property('app')

export const getCurrentUserId = compose(
  property('currentUserId'),
  getAppSlice,
)

export const getIsAuthenticated = compose(
  property('isAuthenticated'),
  getAppSlice,
)
