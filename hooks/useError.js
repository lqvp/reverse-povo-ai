import { useCallback, useEffect, useState } from 'react'

const useError = (alert) => {
  const [errorMessage, setErrorMessage] = useState()

  const displayError = useCallback((message) => {
    setErrorMessage(message)
  }, [])

  useEffect(() => {
    if (alert?.code === -1) {
      setErrorMessage('')
      return
    }

    if (alert?.code) {
      displayError(`Error: ${alert.code}`)
    }
  }, [alert, displayError])

  return errorMessage
}
export default useError
