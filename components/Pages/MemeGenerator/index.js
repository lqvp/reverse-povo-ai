import React, { useState } from 'react'
import BackButton from '../../../static/BackButton'
import MemeSearch from './MemeSearch'
import './index.css'
import MemeResults from './MemeResults'
import MemeEdit from './MemeEdit/MemeEdit'
import { axiosPost } from '../../../utils/axios'
import { useAppContext } from '../../../context/AppContext'
import Loader from '../../Loader/Loader'
import common from '@kelchy/common'
import GeneratedMeme from './GeneratedMeme'
import ErrorModal from '../../Modal/ErrorModal/ErrorModal'
import { trackEvent } from '../../../helpers/analyticsHelper'

const MemeGenerator = () => {
  const { authorizationId } = useAppContext()
  const [page, setPage] = useState('search')
  const [searchText, setSearchText] = useState('')
  const [memeSearchResult, setMemeSearchResult] = useState([])
  const [displayMeme, setDisplayMeme] = useState(null)
  const [selectedMeme, setSelectedMeme] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [generatedMemeData, setGeneratedMemeData] = useState(null)
  const [errorModalData, setErrorModalData] = useState({ openModal: false })

  const handleSeachTextChange = (text) => {
    setSearchText(text)
  }

  const onSeachButtonClick = async () => {
    setIsLoading(true)
    const body = {
      meme_prompt: searchText
    }
    const headers = {
      Authorization: authorizationId
    }
    const { data: memeTemplatesRes, error: memeTemplatesError } =
      await common.awaitWrap(axiosPost(`/meme/search_memes`, body, headers))

    if (memeTemplatesError) {
      console.error('Error in seaching meme:', memeTemplatesError)
      setErrorModalData({ openModal: true })
    }
    setMemeSearchResult(memeTemplatesRes?.data?.searched_memes)
    if (memeTemplatesRes?.data?.auto_meme?.image_url) {
      setSelectedMeme(null)
      setDisplayMeme(memeTemplatesRes.data.auto_meme)
    } else {
      setDisplayMeme(null)
      setSelectedMeme(memeTemplatesRes?.data?.searched_memes[0])
    }
    setPage('searchResult')
    setIsLoading(false)
  }

  const onMemeSelected = (id) => {
    const properties = {
      app_name: 'meme_generator',
      external_id: authorizationId,
      meme_name: id
    }
    trackEvent('meme_results_click', properties)

    const selectedMeme = memeSearchResult.find((meme) => meme.id === id)
    setSelectedMeme(selectedMeme)
  }

  const handleErrorModalClose = () => {
    setErrorModalData({ openModal: false })
  }

  const renderPage = () => {
    switch (page) {
      case 'search':
        return (
          <MemeSearch
            searchText={searchText}
            onInputChange={handleSeachTextChange}
            onSeachButtonClick={onSeachButtonClick}
          />
        )
      case 'searchResult':
        return (
          <MemeResults
            searchText={searchText}
            onSearchTextChange={handleSeachTextChange}
            onRefreshButtonClick={onSeachButtonClick}
            memeList={memeSearchResult}
            displayMeme={displayMeme}
            selectedMeme={selectedMeme}
            onMemeSelected={onMemeSelected}
            onPageChange={setPage}
          />
        )
      case 'edit':
        return (
          <MemeEdit
            selectedMeme={selectedMeme}
            setPage={setPage}
            setGeneratedMemeData={setGeneratedMemeData}
          />
        )
      case 'generatedMeme':
        return (
          <GeneratedMeme
            selectedMeme={selectedMeme}
            generatedMemeData={generatedMemeData}
          />
        )
      default:
        return null
    }
  }

  return (
    <>
      <div className='meme-background-image-wrapper'></div>
      {isLoading ? <Loader /> : null}
      <BackButton />
      {renderPage()}
      {errorModalData?.openModal && (
        <ErrorModal
          errorModalData={errorModalData}
          handleModalClose={handleErrorModalClose}
        />
      )}
    </>
  )
}
export default MemeGenerator
