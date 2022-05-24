import React, {useState} from 'react'
import {getMovies, getTvs, getVideo} from "../util/api"
import {useQuery} from "react-query"
import styled from "styled-components"
import {makeImagePath} from "../util/utils"
import {AnimatePresence, motion, useViewportScroll} from "framer-motion"
import {useMatch, useNavigate} from "react-router-dom"
import {Contents, APIResult} from "../types"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faVolumeXmark, faVolumeUp} from "@fortawesome/free-solid-svg-icons"
import Carousel from "../components/Carousel"

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
  top: -100px;
  left: 0;
  right: 0;
  margin: auto;
  width: 100vw;
  height: 109vh;
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

const Home = () => {
    const {
        data: movies,
        isLoading: moviesIsLoading
    } = useQuery<APIResult>(["contents", "movies"], getMovies)
    const {
        data: tvs,
        isLoading: tvsIsLoading
    } = useQuery<APIResult>(["contents", "tvs"], getTvs)
    const {data: videoId, isLoading: videoIdIsLoading} = useQuery(["video"], () => getVideo(movies?.results[0].title))
    let contents = []
    if (tvs && movies) {
        contents.push(movies, tvs)
    }
    const navigate = useNavigate()
    const clickedContentMatch = useMatch('/movies/:movieId')
    const {scrollY} = useViewportScroll()
    const onOverlayClick = () => navigate('/')
    const clickedContent = clickedContentMatch?.params.movieId && (contents.map(
        content => content?.results.find(
            (content: Contents) => {
                if (clickedContentMatch.params.movieId) {
                    return content.id === +clickedContentMatch.params.movieId
                }
            })
    ))
    const trailer: any = document.querySelector('#trailer')
    const onMuteClick = () => {
        if (mute) {
            trailer?.contentWindow.postMessage('{"event":"command","func":"unMute","args":""}', '*')
        }
        if (!mute) {
            trailer?.contentWindow.postMessage('{"event":"command","func":"mute","args":""}', '*')
        }
        setMute(prev => !prev)
    }
    const [mute, setMute] = useState(true)
    console.log(clickedContent)
    return <Wrapper><Gradient/>
        {moviesIsLoading || tvsIsLoading ?
            <Loader>Loading...</Loader> : <>
                <Banner bg_photo={makeImagePath(movies?.results[0].backdrop_path || "")}>
                    <Title>{movies?.results[0].title}</Title>
                    <Overview>{movies?.results[0].overview}</Overview>ㅋㅋ
                    {!videoIdIsLoading && videoId &&
                    <>
                        <Trailer
                            id='trailer'
                            title="youtube video player"
                            src={`https://www.youtube.com/embed/${videoId}?&mute=1&autoplay=1&enablejsapi=1&version=3&playerapiid=ytplayer&controls=0`}
                            frameBorder="0"
                            allow='autoplay'
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
                {contents[0] &&
                contents.map((content: APIResult, index: number) =>
                    <Carousel key={index} content={content}/>
                )}
                {clickedContentMatch &&
                <AnimatePresence>
                    <>
                        <Popup
                            layoutId={clickedContentMatch.params.movieId}
                            style={{
                                top: scrollY.get() + 100
                            }}
                            transition={{type: 'linear'}}
                        >{clickedContent && <>
                            <PopupTitle>{clickedContent[0]?.title || clickedContent[1]?.title || clickedContent[0]?.name || clickedContent[1]?.name}</PopupTitle>
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
