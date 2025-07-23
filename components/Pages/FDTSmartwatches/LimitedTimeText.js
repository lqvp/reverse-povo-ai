import React, { useState, useEffect } from 'react'

const LimitedTimeText = () => {
  const calculateTimeLeft = (endTime) => {
    const now = new Date().getTime()
    const timeLeft = endTime - now

    if (timeLeft <= 0) {
      return {
        total: 0,
        hours: '00',
        minutes: '00',
        seconds: '00'
      }
    }

    const hours = Math.floor(timeLeft / (1000 * 60 * 60))
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)

    return {
      total: timeLeft,
      hours: String(hours).padStart(2, '0'),
      minutes: String(minutes).padStart(2, '0'),
      seconds: String(seconds).padStart(2, '0')
    }
  }

  const getNextResetTime = () => {
    const now = new Date()
    const may31End = new Date('2024-05-31T16:00:00Z') //This is equivalent to June 1st, 2024, 12:00 AM SGT
    let offerEndTime = may31End.getTime()
    if (now.getTime() > offerEndTime) {
      // Calculate the difference in milliseconds
      const differenceInMilliseconds = now - may31End

      // Convert milliseconds to days
      const millisecondsPerDay = 1000 * 60 * 60 * 24
      const differenceInDays = differenceInMilliseconds / millisecondsPerDay
      const ThreeDaysIntervalCount = Math.ceil(differenceInDays / 3)
      const SeventyTwoHoursDuration = 72 * 60 * 60 * 1000 // 72 hours in milliseconds
      offerEndTime =
        offerEndTime + ThreeDaysIntervalCount * SeventyTwoHoursDuration
    }
    return offerEndTime
  }

  const [endTime, setEndTime] = useState(getNextResetTime())
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(endTime))

  useEffect(() => {
    const timer = setInterval(() => {
      const time = calculateTimeLeft(endTime)
      setTimeLeft(time)

      if (time.total <= 0) {
        setEndTime(getNextResetTime())
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [endTime])

  return (
    <div className='sw-limited-time-wrapper'>
      <div className='sw-limited-time-text'>
        Hurry &apos; grab the limited time offer. It&apos;s time to upgrade your
        wrist game and ditch your telco bill
      </div>
      <div className='sw-limited-time-timer'>
        <div className='sw-limited-time-box'>{timeLeft.hours}</div>
        <div className='sw-limited-time-box'>H</div>
        <div className='sw-limited-time-break'>:</div>
        <div className='sw-limited-time-box'>{timeLeft.minutes}</div>
        <div className='sw-limited-time-box'>M</div>
        <div className='sw-limited-time-break'>:</div>
        <div className='sw-limited-time-box'>{timeLeft.seconds}</div>
        <div className='sw-limited-time-box'>S</div>
      </div>
    </div>
  )
}

export default LimitedTimeText
