import React, {useState} from 'react'
import {getMovies, getTvs, getVideo} from "../util/api"
import {useQuery} from "react-query"
import styled from "styled-components"
import {makeImagePath} from "../util/utils"
import {AnimatePresence, motion, useViewportScroll} from "framer-motion"
import {useMatch, useNavigate} from "react-router-dom"
import {Contents, ContentType, GetMoviesResult, GetTvsResult} from "../types"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faVolumeXmark, faVolumeUp} from "@fortawesome/free-solid-svg-icons"


const Wrapper = styled.div`

`

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Banner = styled.div<{ bg_photo: string }>`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 70px;
  background-image: linear-gradient(rgba(0, 0, 0, 0) 80%, rgba(20, 20, 20, 0.8), rgb(20, 20, 20, 1)), url(${props => props.bg_photo});
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;
`

const Trailer = styled.iframe`
  position: absolute;
  top: -32px;
  left: 0;
  right: 0;
  margin: auto;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  pointer-events: none;
`

const Mute = styled(motion.div)`
  width: 68px;
  height: 68px;
  border: 4px solid ${props => props.theme.white.lighter};
  border-radius: 50%;
  position: absolute;
  bottom: 35%;
  right: 8%;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
`

const Gradient = styled.div`
  position: fixed;
  bottom: 0;
  z-index: 1;
  width: 100vw;
  height: 100vh;
  background-image: linear-gradient(rgba(0, 0, 0, 0) 90%, rgba(20, 20, 20, 0.8), rgb(20, 20, 20, 1));
  pointer-events: none;
`

const Title = styled.h2`
  font-size: 66px;
  margin-bottom: 20px;
  z-index: 1;
`

const Overview = styled.p`
  font-size: 26px;
  width: 40%;
  text-shadow: 4px 4px 6px rgba(0, 0, 0, 0.5);
  line-height: 1.4em;
  word-break: keep-all;
  z-index: 1;
`

const Slider = styled.div`
  position: relative;
  width: calc(100% - 140px);
  margin: 0 auto;
  top: -310px;
  height: 320px;

`

const SliderTitle = styled.h3`
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 15px;
`

const Row = styled(motion.div)`
  display: grid;
  gap: 8px;
  grid-template-columns: repeat(6, 1fr);
  width: 100%;
  margin-bottom: 80px;
  position: absolute;
`

const Box = styled(motion.div)<{ bg_photo: string }>`
  background-image: url(${props => props.bg_photo});
  background-position: center;
  background-size: cover;
  height: 200px;
  color: #000;
  font-size: 24px;
  border-radius: 4px;
  cursor: pointer;

  &:first-child {
    transform-origin: left;
  }

  &:last-child {
    transform-origin: right;
  }
`

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${props => props.theme.black.lighter};
  color: ${props => props.theme.white.lighter};
  opacity: 0;
  position: absolute;
  bottom: 0;
  width: 100%;
  font-size: 1rem;
`

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  background-color: rgba(0, 0, 0, 0.7);
  width: 100%;
  height: 100%;
  opacity: 0;
`

const Popup = styled(motion.div)`
  position: absolute;
  margin-top: 40px;
  width: 95vw;
  max-width: 1200px;
  height: 90vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  z-index: 10;
`

const PopupTitle = styled.h3`
  color: ${props => props.theme.white.lighter};
  position: absolute;
  top: 50%;
  left: 50px;
  font-size: 36px;
`

const PopupOverview = styled.p`
  color: ${props => props.theme.white.lighter};
  padding: 20px 50px;
  position: absolute;
  top: 60%;

`

const PopupCover = styled.div`
  height: 60vh;
  border-radius: 10px;
`

const rowVariants = {
    hidden: {
        x: window.innerWidth
    },
    visible: {x: 0},
    exit: {x: -window.innerWidth}
}

const boxVariants = {
    normal: {scale: 1},
    hover: {
        scale: 1.3,
        y: -50,
        transition: {delay: 0.5, type: 'tween'},
    }
}

const infoVariants = {
    hover: {
        opacity: 1,
        transition: {delay: 0.5, type: 'tween'},
    },
}

const offset = 6

const Home = () => {
    const {
        data: movies,
        isLoading: moviesIsLoading
    } = useQuery<GetMoviesResult>(["contents", "movies"], getMovies)
    const {
        data: tvs,
        isLoading: tvsIsLoading
    } = useQuery<GetTvsResult>(["contents", "tvs"], getTvs)
    const {data: videoId, isLoading: videoIdIsLoading} = useQuery(["video"], getVideo)
    const contents = [movies, tvs]
    const navigate = useNavigate()
    const clickedContentMatch = useMatch('/movies/:movieId')
    const {scrollY} = useViewportScroll()
    const onBoxClick = (id: number) => navigate(`movies/${id}`)
    const onOverlayClick = () => navigate('/')
    const clickedContent = clickedContentMatch?.params.movieId && (contents.map(
        content => content?.results.find(
            (content: Contents) => {
                if (clickedContentMatch.params.movieId) {
                    return content.id === +clickedContentMatch.params.movieId
                }
            })
    ))
    const onMuteClick = () => {
        setMute(prev => !prev)
    }
    const [rowIndex, setIndex] = useState(0)
    const [secondIndex, setSecondIndex] = useState(0)
    const [leaving, setLeaving] = useState(false)
    const [mute, setMute] = useState(true)
    const increaseIndex = (event: any) => {
        if (leaving) return
        const {currentTarget} = event
        if (currentTarget.id === ContentType.Movies) {
            if (leaving) return
            toggleLeaving()
            const totalMovies = movies?.results.length
            const maxIndex = Math.floor((totalMovies || 1) / offset)
            setSecondIndex((prev: number) => prev === maxIndex ? 0 : prev + 1)
        }
        if (currentTarget.id === ContentType.Tvs) {
            if (leaving) return
            toggleLeaving()
            const totalMovies = tvs?.results.length
            const maxIndex = Math.floor((totalMovies || 1) / offset)
            setIndex((prev: number) => prev === maxIndex ? 0 : prev + 1)
        }
    }
    const toggleLeaving = () => setLeaving(prev => !prev)
    return <Wrapper><Gradient/>
        {moviesIsLoading || tvsIsLoading ?
            <Loader>Loading...</Loader> : <>
                <Banner bg_photo={makeImagePath(movies?.results[0].backdrop_path || "")}>
                    <Title>{movies?.results[0].title}</Title>
                    <Overview>{movies?.results[0].overview}</Overview>
                    {!videoIdIsLoading && videoId &&
                    <>
                        <Trailer
                            title="youtube video player"
                            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&controls=0`}
                            frameBorder="0"
                            allowFullScreen
                        />
                        <Mute onClick={onMuteClick}
                              whileHover={{backgroundColor: 'rgba(255,255,255,0.2)'}}
                              whileTap={{backgroundColor: 'rgba(255,255,255,0.5)'}}>
                            <FontAwesomeIcon
                                icon={mute ? faVolumeXmark : faVolumeUp}
                            />
                        </Mute>
                    </>
                    }
                </Banner>
                {
                    contents.map((content: any, index: number) =>
                        <Slider key={index}>
                            <SliderTitle>
                                {content.slider_title}
                                <button id={content.slider_title} onClick={increaseIndex}>next</button>
                            </SliderTitle>
                            <AnimatePresence onExitComplete={toggleLeaving} initial={false}>
                                <Row key={content.slider_title === '인기 TV 콘텐츠' ? rowIndex : secondIndex}
                                     variants={rowVariants} initial='hidden' animate='visible' exit='exit'
                                     transition={{type: 'linear', duration: 1}}>
                                    {content?.results.slice(1).slice(offset * (content.slider_title === '인기 TV 콘텐츠' ? rowIndex : secondIndex), offset * (content.slider_title === '인기 TV 콘텐츠' ? rowIndex : secondIndex) + offset).map((movie: any) =>
                                        <Box key={movie.id} onClick={() => onBoxClick(movie.id)}
                                             layoutId={movie.id + ""} variants={boxVariants}
                                             initial='normal' whileHover='hover' transition={{type: 'tween'}}
                                             bg_photo={makeImagePath(movie.backdrop_path, "w500")}
                                        >
                                            <Info variants={infoVariants}>
                                                <h4>{movie.title || movie.name}</h4>
                                            </Info>
                                        </Box>)}
                                </Row>
                            </AnimatePresence>
                        </Slider>
                    )
                }
                {clickedContentMatch && <AnimatePresence>
                    <>
                        <Popup
                            layoutId={clickedContentMatch.params.movieId}
                            style={{
                                top: scrollY.get() + 50
                            }}
                        >{clickedContent && <>
                            <PopupTitle>{clickedContent[0]?.title || clickedContent[1]?.title}</PopupTitle>
                            <PopupOverview>{clickedContent[0]?.overview || clickedContent[1]?.overview}</PopupOverview>
                            <PopupCover
                                style={{
                                    backgroundImage: `linear-gradient(transparent
                                    60%, rgb(20, 20, 20, 1)),url(${makeImagePath(clickedContent[0]?.backdrop_path || clickedContent[1]?.backdrop_path || "", "")}`,
                                    backgroundSize: 'cover'
                                }}
                            />
                        </>}</Popup>
                        <Overlay onClick={onOverlayClick} animate={{opacity: 1}} exit={{opacity: 0}}/>
                    </>
                </AnimatePresence>}
            </>}
    </Wrapper>
};


export default Home;