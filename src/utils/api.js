/* eslint-disable import/prefer-default-export */

const { SGG_API_APP_NAME } = process.env

export function getApiUrl() {
  return `https://${SGG_API_APP_NAME}.herokuapp.com`
}
