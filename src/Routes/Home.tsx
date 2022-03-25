import React, {useState} from 'react';
import {getMovies, GetMoviesResult, getTrending, GetTrendingResult} from "../api";
import {useQuery} from "react-query";
import styled from "styled-components";
import {makeImagePath} from "../utils";
import {AnimatePresence, motion, useViewportScroll} from "framer-motion";
import {useMatch, useNavigate} from "react-router-dom";

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
`

const Title = styled.h2`
  font-size: 66px;
  margin-bottom: 20px;
`

const Overview = styled.p`
  font-size: 26px;
  width: 40%;
  text-shadow: 4px 4px 6px rgba(0, 0, 0, 0.5);
  line-height: 1.4em;
  word-break: keep-all;
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
        data: nowPlaying,
        isLoading: nowPlayingIsLoading
    } = useQuery<GetMoviesResult>(["contents", "nowPlaying"], getMovies)
    const {
        data: trending,
        isLoading: trendingIsLoading
    } = useQuery<GetTrendingResult>(["contents", "trending"], getTrending)
    const navigate = useNavigate()
    const bigMovieMatch = useMatch('/movies/:movieId')
    const {scrollY} = useViewportScroll()
    const onBoxClick = (id: number) => navigate(`movies/${id}`)
    const onOverlayClick = () => navigate('/')
    const contents = [nowPlaying, trending]
    const [rowIndex, setIndex] = useState(0)
    const [secondIndex, setSecondIndex] = useState(0)
    const [leaving, setLeaving] = useState(false)
    const increaseIndex = (event: any) => {
        if (leaving) return
        const {currentTarget} = event
        if (currentTarget.id === "현재 상영중인 영화") {
            if (leaving) return
            toggleLeaving()
            const totalMovies = nowPlaying?.results.length
            const maxIndex = Math.floor((totalMovies || 1) / offset)
            setSecondIndex((prev: number) => prev === maxIndex ? 0 : prev + 1)
        }
        if (currentTarget.id === '인기 TV 콘텐츠') {
            if (leaving) return
            toggleLeaving()
            const totalMovies = trending?.results.length
            const maxIndex = Math.floor((totalMovies || 1) / offset)
            setIndex((prev: number) => prev === maxIndex ? 0 : prev + 1)
        }
    }
    const toggleLeaving = () => setLeaving(prev => !prev)

    return <Wrapper>
        {nowPlayingIsLoading || trendingIsLoading ?
            <Loader>Loading...</Loader> : <>
                <Banner bg_photo={makeImagePath(nowPlaying?.results[0].backdrop_path || "")}>
                    <Title>{nowPlaying?.results[0].title}</Title>
                    <Overview>{nowPlaying?.results[0].overview}</Overview>
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
                {bigMovieMatch && <AnimatePresence>
                    <>
                        <motion.div
                            layoutId={bigMovieMatch.params.movieId}
                            style={{
                                position: 'absolute',
                                marginTop: 40,
                                width: '90vw',
                                maxWidth: 1200,
                                height: '90vh',
                                backgroundColor: 'green',
                                borderRadius: 10,
                                top: scrollY.get() + 50,
                                left: 0,
                                right: 0,
                                margin: '0 auto',
                                zIndex: 10,
                            }}/>
                        <Overlay onClick={onOverlayClick} animate={{opacity: 1}} exit={{opacity: 0}}/>
                    </>
                </AnimatePresence>}
            </>}
    </Wrapper>
};

export default Home;