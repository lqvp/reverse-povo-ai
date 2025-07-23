import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import common from '@kelchy/common'
import { getBaseUrl } from './converter'
import { getConfigForHostname } from '../helpers/tenantHelper'

const { tenant } = getConfigForHostname()

const baseURL = `${getBaseUrl()}/v1/${tenant}/aistore`

const axiosInstance = axios.create({
  baseURL,
  timeout: 120000,
  withCredentials: true,
  headers: { 'X-Request-Id': uuidv4() }
})

const axiosGet = async (url, { params = {}, headers = {} }) => {
  const { data: response, error } = await common.awaitWrap(
    axiosInstance.get(url, { params, headers })
  )
  if (error) {
    console.error('Error in GET request:', error)
    throw error
  }
  return response.data
}

const axiosPost = async (url, body = {}, headers = {}) => {
  const { data: response, error } = await common.awaitWrap(
    axiosInstance.post(url, body, { headers })
  )
  if (error) {
    console.error('Error in POST request:', error)
    throw error
  }
  return response.data
}

const axiosPatch = async (url, body = {}, headers = {}) => {
  const { data: response, error } = await common.awaitWrap(
    axiosInstance.patch(url, body, { headers })
  )
  if (error) {
    console.error('Error in PATCH request:', error)
    throw error
  }
  return response.data
}

const getImageBlob = async (url) => {
  const { data: response, error: requestError } = await common.awaitWrap(
    axios.get(url, { responseType: 'blob' })
  )
  if (requestError) {
    console.error('Error getting image blob:', requestError)
    throw requestError
  }
  return response.data
}

const fetchPostMethod = async (
  url,
  payload = {},
  headers = {},
  formData = false
) => {
  const { data: response, error } = await common.awaitWrap(
    fetch(`${baseURL}${url}`, {
      method: 'POST',
      headers: { ...headers, 'X-Request-Id': uuidv4() },
      body: formData ? payload : JSON.stringify(payload),
      credentials: 'include'
    })
  )
  if (error) {
    console.error('Error in POST request:', error)
    throw error
  }
  return response
}

export { axiosGet, axiosPost, axiosPatch, getImageBlob, fetchPostMethod }
