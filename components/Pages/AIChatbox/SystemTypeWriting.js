import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useTypewriter } from '../../../hooks/useTypewriter'
import MarkdownPreview from '@uiw/react-markdown-preview'

const SystemTypeWriting = ({
  text,
  speed = 5,
  className = '',
  isNFSWContent = false,
  typewriting = true,
  status = 'not-delivered'
}) => {
  const enableTypewriting = typewriting && status !== 'delivered'
  let { displayedText, isWritingCompleted } = useTypewriter(text, speed)

  if (isNFSWContent || !enableTypewriting) {
    displayedText = text
  }

  useEffect(() => {
    const msgContainer = document.querySelector('.ai-chatbox-body-container')
    if (msgContainer) {
      msgContainer.scrollTo({
        top: msgContainer.scrollHeight,
        behavior: 'smooth'
      })
    }

    if (isWritingCompleted || !enableTypewriting) {
      document
        .querySelectorAll('.ai-chatbox-message.system-message a')
        .forEach((link) => {
          link.target = '_blank'
        })
    }
  }, [displayedText, isWritingCompleted, enableTypewriting])

  return (
    <span className={className}>
      <div data-color-mode='light'>
        <MarkdownPreview source={displayedText} />
      </div>
    </span>
  )
}

SystemTypeWriting.propTypes = {
  text: PropTypes.string.isRequired,
  speed: PropTypes.number,
  className: PropTypes.string,
  isNFSWContent: PropTypes.bool,
  typewriting: PropTypes.bool,
  status: PropTypes.string
}

export default SystemTypeWriting
