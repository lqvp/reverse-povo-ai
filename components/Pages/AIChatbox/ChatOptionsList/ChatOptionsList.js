import React from 'react'
import {
  Box,
  Typography,
  IconButton,
  SwipeableDrawer,
  MenuItem
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import './ChatOptionsList.css'
import AIChatboxIcon from '../../../../static/AIChatboxIcon'
import PropTypes from 'prop-types'

function ChatOptionsList({ drawerOpen, setDrawerOpen, setCurrentChatOption }) {
  const toggleDrawer = (open) => () => {
    setDrawerOpen(open)
  }

  const handleOptionClick = (option) => {
    setCurrentChatOption(option)
    setDrawerOpen(false)
  }

  return (
    <SwipeableDrawer
      anchor='bottom'
      open={drawerOpen}
      onClose={toggleDrawer(false)}
      PaperProps={{ className: 'chat-options-tools-drawer-paper' }}
    >
      <Box className='chat-options-tools-sheet'>
        <Box className='chat-options-tools-header'>
          <Typography variant='h6' className='chat-options-tools-header-text'>
            Tools
          </Typography>
          <IconButton size='small' onClick={toggleDrawer(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        <MenuItem
          className='chat-options-tool-option'
          onClick={() => handleOptionClick('deep-research')}
        >
          <AIChatboxIcon
            kind='chat-options-image-icon'
            width={24}
            height={24}
            color='#808080'
          />
          <span className='chat-options-tool-label'>Run deep research</span>
        </MenuItem>

        <MenuItem
          className='chat-options-tool-option'
          onClick={() => handleOptionClick('image')}
        >
          <AIChatboxIcon
            kind='chat-options-create-image-icon'
            width={24}
            height={24}
            color='none'
          />
          <span className='chat-options-tool-label'>Create an image</span>
          <span className='chat-options-tool-counter'>5 left</span>
        </MenuItem>
      </Box>
    </SwipeableDrawer>
  )
}

ChatOptionsList.propTypes = {
  drawerOpen: PropTypes.bool.isRequired,
  setDrawerOpen: PropTypes.func.isRequired,
  setCurrentChatOption: PropTypes.func.isRequired
}

export default ChatOptionsList
