
import { mapProps } from 'recompose'
import {
  compose,
  has,
  map,
  filter,
  toPairs,
  fromPairs,
} from 'lodash/fp'

export default function transformProps(transformMap) {
  return mapProps((props) => {
    const applyTransform = ([key, transform]) => {
      if (has(key, props)) {
        return [key, transform(props[key])]
      }

      return false
    }

    const applyTransforms = compose(
      fromPairs,
      filter(Boolean),
      map(applyTransform),
      toPairs,
    )

    return {
      ...props,
      ...applyTransforms(transformMap),
    }
  })
}
