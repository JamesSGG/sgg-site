
import { getIsDev } from './env'

const { SGG_API_URL } = process.env

const isDev = getIsDev()

export function getApiUrl() {
  if (SGG_API_URL) {
    return SGG_API_URL
  }

  if (isDev) {
    return 'http://localhost:8880'
  }

  return 'https://social-gaming-guild-api.herokuapp.com'
}

export function getApiWebSocketsUrl() {
  const apiUrl = getApiUrl()

  return apiUrl.replace(/^http/, 'ws')
}
