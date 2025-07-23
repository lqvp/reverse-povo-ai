import { useState, useEffect } from 'react'

export function useTypewriter(text, speed = 5) {
  const [displayedText, setDisplayedText] = useState('')
  const [isWritingCompleted, setIsWritingCompleted] = useState(false)

  useEffect(() => {
    if (!text || isWritingCompleted || text.length === displayedText.length) {
      return // Stop if text is empty or already completed
    }

    const interval = setInterval(() => {
      if (displayedText.length < text.length) {
        setDisplayedText((prev) => {
          const nextChar = text[prev.length]
          return nextChar ? prev + nextChar : prev // Prevent undefined values
        })
      } else {
        clearInterval(interval)
        setIsWritingCompleted(true)
      }
    }, speed)

    return () => clearInterval(interval)
  }, [text, isWritingCompleted, displayedText.length, speed])

  return { displayedText, isWritingCompleted }
}
