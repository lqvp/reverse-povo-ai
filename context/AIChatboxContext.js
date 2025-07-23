import React, { createContext, useContext } from 'react'
import PropTypes from 'prop-types'
import { useState } from 'react'

const AIChatboxContext = createContext()

export const useAIChatboxContext = () => useContext(AIChatboxContext)

export const AIChatboxContextProvider = ({ children }) => {
  const [hideBackRedirectionBtn, setHideBackRedirectionBtn] = useState(false)
  const [searchGlobe, setSearchGlobe] = useState(false)

  return (
    <AIChatboxContext.Provider
      value={{
        hideBackRedirectionBtn,
        setHideBackRedirectionBtn,
        searchGlobe,
        setSearchGlobe
      }}
    >
      {children}
    </AIChatboxContext.Provider>
  )
}

AIChatboxContextProvider.propTypes = {
  children: PropTypes.node.isRequired
}
