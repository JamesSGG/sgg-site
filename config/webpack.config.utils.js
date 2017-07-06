
const merge = require('webpack-merge')
const { uniq } = require('lodash/fp')

module.exports = merge({
  customizeArray(a, b, key) {
    if (key === 'entry') {
      return uniq([...b, ...a])
    }

    // Fall back to default merging
    return undefined
  },
})
