import React, { useEffect, useState } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import './TrendingPostsCarousel.css'
import { useLocation } from 'react-router-dom'
import { recordTrendingPostCompletionResponse } from '../../../../helpers/milestoneResponseRecorder'
import { useAppContext } from '../../../../context/AppContext'
import PropTypes from 'prop-types'

const settings = {
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  swipeToSlide: true,
  touchMove: true,
  arrows: false
}

const TrendingPostsCarousel = ({ trendingPosts }) => {
  const location = useLocation()
  const { authorizationId } = useAppContext()
  const queryParams = new URLSearchParams(location.search)
  const currentSlide = queryParams.get('currentSlide')
  const activeSlide = currentSlide
    ? trendingPosts?.length > currentSlide
      ? currentSlide
      : trendingPosts?.length - 1
    : 0
  const currentPost = trendingPosts?.length > 0 && trendingPosts[activeSlide]
  const currentPostId = currentPost && currentPost?.trending_post_id
  const [nextSlide, setNextSlide] = useState(Number(activeSlide))

  useEffect(() => {
    if (currentPostId && authorizationId) {
      recordTrendingPostCompletionResponse(authorizationId, currentPostId)
    }
  }, [authorizationId, currentPostId])

  const emptySlidesCount = Math.max(0, 1 - (trendingPosts?.length || 0))

  const handleBeforeChange = (next) => {
    setNextSlide(next)
  }

  const handleAfterChange = (currentSlide) => {
    const currentPost = trendingPosts[currentSlide]
    if (currentPost && authorizationId) {
      recordTrendingPostCompletionResponse(
        authorizationId,
        currentPost?.trending_post_id
      )
    }
  }

  const emptySlides = Array.from({ length: emptySlidesCount }).map(
    (_, index) => <div key={`empty-${index}`}></div>
  )

  return (
    <>
      {trendingPosts?.length ? (
        <Slider
          {...settings}
          initialSlide={nextSlide}
          beforeChange={handleBeforeChange}
          afterChange={handleAfterChange}
          className='tp-carousel'
        >
          {trendingPosts?.map((post) => (
            <div key={post?._id} className='tp-carousel-item'>
              <div className='tp-video-container'>
                <video
                  src={post?.video_url}
                  className='tp-carousel-video'
                  controls={false}
                  autoPlay={true}
                  muted={true}
                  playsInline={true}
                  loop={true}
                  poster='/images/trending-video-fallback.png'
                />
                <div className='tp-post-title'>{post?.title}</div>
              </div>
            </div>
          ))}
          {emptySlides}
        </Slider>
      ) : null}
    </>
  )
}

TrendingPostsCarousel.propTypes = {
  trendingPosts: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      trending_post_id: PropTypes.string,
      video_url: PropTypes.string,
      title: PropTypes.string
    })
  ).isRequired
}

export default TrendingPostsCarousel
