import { useEffect, useState } from 'react'

const usePageVisibility = () => {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const focused = () => {
      if (!visible) {
        setVisible(true)
      }
    }

    const unfocused = () => {
      if (visible) {
        setVisible(false)
      }
    }

    // Standards
    if ('hidden' in document) {
      setVisible(!document.hidden)
      document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
          unfocused()
        } else {
          focused()
        }
      })
    }
    if ('mozHidden' in document) {
      setVisible(!document['mozHidden'])
      document.addEventListener('mozvisibilitychange', function () {
        if (document['mozHidden']) {
          unfocused()
        } else {
          focused()
        }
      })
    }
    if ('webkitHidden' in document) {
      setVisible(!document['webkitHidden'])
      document.addEventListener('webkitvisibilitychange', function () {
        if (document['webkitHidden']) {
          unfocused()
        } else {
          focused()
        }
      })
    }
    if ('msHidden' in document) {
      setVisible(!document['msHidden'])
      document.addEventListener('msvisibilitychange', function () {
        if (document['msHidden']) {
          unfocused()
        } else {
          focused()
        }
      })
    }
    // IE 9 and lower:
    if ('onfocusin' in document) {
      document.onfocusin = focused
      document.onfocusout = unfocused
    }
    // All others:
    window.onpageshow = window.onfocus = focused
    window.onpagehide = window.onblur = unfocused
  }, [visible])

  return visible
}

export default usePageVisibility
