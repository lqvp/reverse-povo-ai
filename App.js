import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from 'react-router-dom'
import HomePage from './components/Pages/HomePage'
import {
  getPhotoAnimatorPath,
  getHomePagePath,
  getPhotoAvatarPath,
  getMemeGeneratorPath,
  getStickerPickerPath,
  getGlowMeUpPath,
  getFaceMergePath,
  getSmartwatchesPath,
  getQuickNewsAppPath,
  getHoroscopeAppPath,
  getHoroscopeCompatibilityAppPath,
  getTarotDetailsPath,
  getTrendingPostsPath,
  getAIStoreAppsPath,
  getAIStoreAppsChatBotPath,
  getAIStoreSearchBannerChatBotPath,
  getTriviaDetailsPath,
  getTriviaPath,
  getFunGamesListPath,
  getTenSecondsClickPath,
  getFoodScannerPath,
  getPuzzlesPath,
  getCountToTenPath,
  getReactionTimePath,
  getTypingTestPath,
  getMoreFunAppsCardPath,
  getRiddleAndPollGamePath,
  getWellnessTrackerPath,
  getMilestoneQuestPath,
  getAIStylistPath,
  getMoviesEventsPath,
  getAIChatboxPath,
  getByuVideoPath,
  getByuAllVideoPath,
  getByuVideoStreamPath,
  getAIChatboxFeaturesListPath,
  getMiniGamesPath,
  getAllMiniGamesPath,
  getByuPodcastPath,
  getByuMixtapesPath,
  getNavigationFeaturePath,
  getDataMarketplacePath,
  getFDTMemeArcadePath
} from './common/paths'
import './App.css'
import PhotoAvatar from './components/Pages/PhotoAvatar'
import { getConfigForHostname } from './helpers/tenantHelper'
import clevertap from 'clevertap-web-sdk'
import { clevertapConfig } from './common/constants'
import MemeGenerator from './components/Pages/MemeGenerator'
import { ErrorBoundary } from 'react-error-boundary'
import ErrorFallbackPage from './components/ErrorBoundary/ErrorFallbackPage'
import StickerPicker from './components/Pages/StickerPicker'
import FaceMerge from './components/Pages/FaceMerge'
import Smartwatches from './components/Pages/FDTSmartwatches'
import TiktokForNews from './components/Pages/TiktokForNews'
import Horoscope from './components/Pages/Horoscope'
import HoroscopeCompatibilityPage from './components/Pages/Horoscope/HoroscopeCompatibilityPage'
import TarotDetailsPage from './components/Pages/Horoscope/TarotDetailsPage'
import TrendingPosts from './components/Pages/TrendingPosts'
import AIStoreApps from './components/Pages/AIStoreApps'
import AIStoreAppsChatBot from './components/Pages/AIStoreApps/AIStoreAppsChatBot'
import AIStoreSearchBannerChatBot from './components/Pages/AIStoreApps/AIStoreSearchBannerChatBot'
import Trivia from './components/Pages/Trivia'
import QuizWrapper from './components/Pages/Trivia/TriviaQuestion/QuizWrapper'
import TenSecondsClick from './components/Pages/FunGames/TenSecondsClick/TenSecondsClick'
import FoodScanner from './components/Pages/FoodScanner'
import Puzzles from './components/Pages/Puzzles'
import CountToTen from './components/Pages/FunGames/CountToTen/CountToTen'
import ReactionTime from './components/Pages/FunGames/ReactionTime/ReactionTime'
import TypingTest from './components/Pages/FunGames/TypingTest/TypingTest'
import MoreFunAppsCard from './components/Pages/FunGames/MoreFunAppsCard/MoreFunAppsCard'
import FunGamesList from './components/Pages/FunGames'
import RiddlePollingSection from './components/Pages/RiddlePollingSection'
import { I18nextProvider } from 'react-i18next'
import i18next from './i18nextConfig'
import WellnessTracker from './components/Pages/WellnessTracker'
import MilestoneQuest from './components/Pages/MilestoneQuest'
import AIStylist from './components/Pages/AIStylist'
import FDTMoviesEvents from './components/Pages/FDTMoviesEvents'
import { useTenantConfig } from './useTenantConfig'
import TokenisationModal from './components/TokenisationModal/TokenisationModal'
import AIChatBox from './components/Pages/AIChatbox'
import ByuVideos from './components/Pages/ByuVideos'
import ByuAllVideo from './components/Pages/ByuVideos/ByuAllVideo/ByuAllVideo'
import ByuVideoStream from './components/Pages/ByuVideos/ByuVideoStream/ByuVideoStream'
import usePerformanceMetrics from './hooks/usePerformanceMetrics'
import MiniGames from './components/Pages/MiniGames'
import AllMiniGames from './components/Pages/MiniGames/AllMiniGames/AllMiniGames'
import AIAppsFeatureList from './components/Pages/AIChatbox/AIAppsFeatureList'
import ByuPodcast from './components/Pages/ByuPodcast'
import ByuMixtapes from './components/Pages/ByuMixtapes'
import FeatureNavigationHero from './components/Pages/FeatureNavigationHero'
import DataMarketplace from './components/Pages/DataMarketplace'
import FDTMmeMeArcade from './components/Pages/FDTMemeArcade'

const { clevertapFlag, tenant } = getConfigForHostname() // Set the locale and clevertap flag based upon config
if (clevertapFlag) {
  clevertap.privacy.push({ optOut: false }) // Set the flag to true, if the user of the device opts out of sharing their data
  clevertap.privacy.push({ useIP: false }) // Set the flag to true, if the user agrees to share their IP data
  clevertap.init(clevertapConfig.key, clevertapConfig.region) // Replace with values applicable to you. Refer below
  clevertap.spa = true
}

const WithOuterElements = (WrappedComponent) => {
  const tenantLayout = useTenantConfig(tenant)

  return (
    <>
      <div
        className='main-body-wrapper'
        style={{
          padding: tenantLayout?.funWithSelfies?.bodyPadding,
          color: tenantLayout?.funWithSelfies?.fontColor,
          fontFamily: tenantLayout?.funWithSelfies?.fontFamily
        }}
      >
        <div
          className={`background-image-wrapper ${tenant}`}
          style={
            tenantLayout?.funWithSelfies?.mainPageBackground
              ? {
                  background: tenantLayout.funWithSelfies.mainPageBackground,
                  minHeight: tenantLayout.funWithSelfies.bgMinHeight
                }
              : {}
          }
        ></div>
        <WrappedComponent />
      </div>
    </>
  )
}

function App() {
  usePerformanceMetrics()
  return (
    <I18nextProvider i18n={i18next}>
      <Router>
        <ErrorBoundary fallbackRender={ErrorFallbackPage}>
          <Routes>
            <Route
              path={getHomePagePath()}
              element={WithOuterElements(HomePage)}
            />
            <Route
              path={getHomePagePath()}
              element={WithOuterElements(HomePage)}
            />
            <Route
              path={getPhotoAvatarPath()}
              element={WithOuterElements(PhotoAvatar)}
            />
            <Route
              path={getPhotoAnimatorPath()}
              element={WithOuterElements(PhotoAvatar)}
            />
            <Route
              path={getMemeGeneratorPath()}
              element={WithOuterElements(MemeGenerator)}
            />
            <Route
              path={getStickerPickerPath()}
              element={WithOuterElements(StickerPicker)}
            />
            <Route
              path={getGlowMeUpPath()}
              element={WithOuterElements(StickerPicker)}
            />
            <Route
              path={getFaceMergePath()}
              element={WithOuterElements(FaceMerge)}
            />
            <Route path={getSmartwatchesPath()} element={<Smartwatches />} />
            <Route path={getMoviesEventsPath()} element={<FDTMoviesEvents />} />
            <Route path={getFDTMemeArcadePath()} element={<FDTMmeMeArcade />} />
            <Route path={getQuickNewsAppPath()} element={<TiktokForNews />} />
            <Route path={getHoroscopeAppPath()} element={<Horoscope />} />
            <Route
              path={getHoroscopeCompatibilityAppPath()}
              element={<HoroscopeCompatibilityPage />}
            />
            <Route
              path={getTarotDetailsPath()}
              element={<TarotDetailsPage />}
            />
            <Route path={getTrendingPostsPath()} element={<TrendingPosts />} />
            <Route path={getAIStoreAppsPath()} element={<AIStoreApps />} />
            <Route
              path={getAIChatboxFeaturesListPath()}
              element={<AIAppsFeatureList />}
            />
            <Route
              path={getAIStoreAppsChatBotPath()}
              element={<AIStoreAppsChatBot />}
            />
            <Route
              path={getAIStoreSearchBannerChatBotPath()}
              element={<AIStoreSearchBannerChatBot />}
            />
            <Route path={getTriviaPath()} element={<Trivia />} />
            <Route path={getTriviaDetailsPath()} element={<QuizWrapper />} />
            <Route path={getFunGamesListPath()} element={<FunGamesList />} />
            <Route
              path={getTenSecondsClickPath()}
              element={<TenSecondsClick />}
            />
            <Route path={getFoodScannerPath()} element={<FoodScanner />} />
            <Route path={getPuzzlesPath()} element={<Puzzles />} />
            <Route path={getCountToTenPath()} element={<CountToTen />} />
            <Route path={getReactionTimePath()} element={<ReactionTime />} />
            <Route path={getTypingTestPath()} element={<TypingTest />} />
            <Route
              path={getMoreFunAppsCardPath()}
              element={<MoreFunAppsCard />}
            />
            <Route
              path={getRiddleAndPollGamePath()}
              element={<RiddlePollingSection />}
            />
            <Route
              path={getWellnessTrackerPath()}
              element={<WellnessTracker />}
            />
            <Route
              path={getMilestoneQuestPath()}
              element={<MilestoneQuest />}
            />
            <Route path={getAIStylistPath()} element={<AIStylist />} />
            <Route path={getAIChatboxPath()} element={<AIChatBox />} />
            <Route path={getByuVideoPath()} element={<ByuVideos />} />
            <Route path={getByuAllVideoPath()} element={<ByuAllVideo />} />
            <Route
              path={getByuVideoStreamPath()}
              element={<ByuVideoStream />}
            />
            <Route path={getMiniGamesPath()} element={<MiniGames />} />
            <Route path={getAllMiniGamesPath()} element={<AllMiniGames />} />
            <Route path={getByuPodcastPath()} element={<ByuPodcast />} />
            <Route path={getByuMixtapesPath()} element={<ByuMixtapes />} />
            <Route
              path={getNavigationFeaturePath()}
              element={<FeatureNavigationHero />}
            />
            <Route
              path={getDataMarketplacePath()}
              element={<DataMarketplace />}
            />
            <Route path='*' element={<Navigate to='/' />} />
          </Routes>
          <TokenisationModal />
        </ErrorBoundary>
      </Router>
    </I18nextProvider>
  )
}

export default App
