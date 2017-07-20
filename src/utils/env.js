// @flow

import { complement } from 'lodash/fp'
import { branch, renderNothing } from 'recompose'


export const getIsProd = () => process.env.NODE_ENV === 'production'
export const getIsDev = complement(getIsProd)

export const devOnlyComponent = branch(
  getIsProd,
  renderNothing,
)
