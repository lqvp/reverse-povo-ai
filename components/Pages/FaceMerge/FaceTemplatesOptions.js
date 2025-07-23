import React from 'react'
import ImageGallery from '../../ImageGallery/ImageGallery'
import { Drawer } from '@mui/material'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'

const FaceTemplatesOptions = ({
  showTemplatesOptions,
  faceMergeTemplates,
  handleTemplateSelect,
  selectedTemplate,
  handleTemplateUpload,
  handleImageUploadClick
}) => {
  const { t } = useTranslation('common')

  return (
    <Drawer
      anchor='bottom'
      open={showTemplatesOptions}
      sx={{
        width: '100%',
        height: '100%',
        maxWidth: 480,
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px'
      }}
    >
      <div className='template-image-options-wrapper'>
        <div className='template-image-options-title'>
          {t('faceMerge.chooseATemplateOrUpload')}
        </div>
        <ImageGallery
          data={faceMergeTemplates}
          onImageSelect={handleTemplateSelect}
          selectedImage={selectedTemplate}
          showUploadImage={true}
          onImageUpload={handleTemplateUpload}
          onImageUploadClick={handleImageUploadClick}
          selectionRemove={false}
        />
      </div>
    </Drawer>
  )
}

FaceTemplatesOptions.propTypes = {
  showTemplatesOptions: PropTypes.bool.isRequired,
  faceMergeTemplates: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleTemplateSelect: PropTypes.func.isRequired,
  selectedTemplate: PropTypes.number,
  handleTemplateUpload: PropTypes.func.isRequired,
  handleImageUploadClick: PropTypes.func.isRequired
}

export default FaceTemplatesOptions
