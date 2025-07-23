import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import common from '@kelchy/common'
import { getPollingGameBaseUrl } from './converter'
import { getConfigForHostname } from '../helpers/tenantHelper'

const { tenant } = getConfigForHostname()

const axiosInstance = axios.create({
  baseURL: `${getPollingGameBaseUrl()}/v1/api/${tenant}/`,
  timeout: 120000,
  withCredentials: true,
  headers: { 'X-Request-Id': uuidv4() },
})

const axiosGetPoll = async (url, { params = {}, headers = {} }) => {
  const { data: response, error } = await common.awaitWrap(
    axiosInstance.get(url, { params, headers })
  )
  if (error) {
    console.error('Error in GET request:', error)
    throw error
  }
  return response.data
}

const axiosPostPoll = async (url, body = {}, headers = {}) => {
  const { data: response, error } = await common.awaitWrap(
    axiosInstance.post(url, body, { headers })
  )
  if (error) {
    console.error('Error in POST request:', error)
    throw error
  }
  return response.data
}

const axiosPatchPoll = async (url, body = {}, headers = {}) => {
  const { data: response, error } = await common.awaitWrap(
    axiosInstance.patch(url, body, { headers })
  )
  if (error) {
    console.error('Error in PATCH request:', error)
    throw error
  }
  return response.data
}

export { axiosGetPoll, axiosPostPoll, axiosPatchPoll }
