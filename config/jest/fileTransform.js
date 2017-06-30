/**
 * This is a custom Jest transformer turning file imports into filenames.
 * @see http://facebook.github.io/jest/docs/tutorial-webpack.html
 */

const path = require('path')

module.exports = {
  process(src, filePath) {
    const fileName = path.basename(filePath)

    return `module.exports = ${JSON.stringify(fileName)};`
  },
}
