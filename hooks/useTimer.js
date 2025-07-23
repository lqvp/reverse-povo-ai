import { useEffect, useState } from 'react'

const useTimer = (started, durationSeconds) => {
  const [seconds, setSeconds] = useState(1)

  useEffect(() => {
    let intervalId

    if (started) {
      setSeconds(1)
      intervalId = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds >= durationSeconds) {
            clearInterval(intervalId)
            return prevSeconds
          }
          return prevSeconds + 1
        })
      }, 1000)
    }

    return () => {
      clearInterval(intervalId)
    }
  }, [started, durationSeconds])

  return seconds
}

export default useTimer
