import React, { useEffect, useState } from 'react'

const Greeting = () => {
  const [greeting, setGreeting] = useState('')

  const updateGreeting = () => {
    const now = new Date()

    // Convert to JST (UTC+9)
    const jstOffset = 9 * 60 // in minutes
    const utc = now.getTime() + now.getTimezoneOffset() * 60000
    const jstDate = new Date(utc + jstOffset * 60000)

    const hours = jstDate.getHours()
    const minutes = jstDate.getMinutes()

    const currentTime = hours * 60 + minutes // total minutes since midnight

    const morningStart = 5 * 60
    const morningEnd = 10 * 60 + 30

    const afternoonStart = 10 * 60 + 31
    const afternoonEnd = 16 * 60 + 59

    if (currentTime >= morningStart && currentTime <= morningEnd) {
      setGreeting('おはようございます') // Good morning
    } else if (currentTime >= afternoonStart && currentTime <= afternoonEnd) {
      setGreeting('こんにちは') // Good afternoon
    } else {
      setGreeting('こんばんは') // Good evening
    }
  }

  useEffect(() => {
    updateGreeting()

    // Optional: update greeting every minute
    const interval = setInterval(updateGreeting, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div>
      {greeting}
      <br /> 何かお困りのことはありませんか？
    </div>
  )
}

export default Greeting
