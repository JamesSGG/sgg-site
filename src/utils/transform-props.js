
import { mapProps } from 'recompose'

export default function transformProps(transformMap) {
  return mapProps((props) => {
    const newProps = { ...props }
    const propKeys = Object.keys(transformMap)

    for (const key of propKeys) {
      const prop = newProps[key]
      const transform = transformMap[key]

      newProps[key] = transform(prop)
    }

    return newProps
  })
}
