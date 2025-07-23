import React from 'react'
import PropTypes from 'prop-types'
import AIChatbox from '../../AIChatbox'

const AIAssistant = ({
  setRedirectLoading = () => {},
  isSublayout = false
}) => {
  return (
    <AIChatbox
      isSublayout={isSublayout}
      setRedirectLoading={setRedirectLoading}
    />
  )
}

AIAssistant.propTypes = {
  setRedirectLoading: PropTypes.func,
  isSublayout: PropTypes.bool
}

export default AIAssistant
