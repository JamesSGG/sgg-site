/* eslint-disable import/prefer-default-export */

const { SGG_API_APP_NAME = 'social-gaming-guild-api' } = process.env

export function getApiUrl() {
  return `https://${SGG_API_APP_NAME}.herokuapp.com`
}
