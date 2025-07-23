import React, { createContext, useContext } from 'react'
import PropTypes from 'prop-types'
import { useState } from 'react'

const MvpAccessContext = createContext()

export const useMvpAccessContext = () => useContext(MvpAccessContext)

const defaultMvpAccessState = {
  horoscope: {
    personal: false,
    health: false,
    profession: false,
    emotions: false,
    dailyHoroscope: false,
    loveCompatibility: false,
    luckyCharm: false,
    dailyTarot: false
  }
}

export const MvpAccessContextProvider = ({ children }) => {
  const [mvpAccessState, setMvpAccessState] = useState(defaultMvpAccessState)

  return (
    <MvpAccessContext.Provider
      value={{
        mvpAccessState,
        setMvpAccessState
      }}
    >
      {children}
    </MvpAccessContext.Provider>
  )
}

MvpAccessContextProvider.propTypes = {
  children: PropTypes.node.isRequired
}
