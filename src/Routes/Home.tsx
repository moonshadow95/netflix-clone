import React, {useState} from 'react';
import {getMovies, GetMoviesResult, getTrending, GetTrendingResult} from "../api";
import {useQuery} from "react-query";
import styled from "styled-components";
import {makeImagePath} from "../utils";
import {AnimatePresence, motion} from "framer-motion";

const Wrapper = styled.div`
  background-color: #000;

`

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Banner = styled.div<{ bg_photo: string }>`
  width: 100%;
  height: 64vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 70px;
  background-image: linear-gradient(rgba(0, 0, 0, 0) 70%, rgba(0, 0, 0, 1)), url(${props => props.bg_photo});
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
  top: -130px;
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
  border-radius: 4px
`

const rowVariants = {
    hidden: {
        x: window.innerWidth
    },
    visible: {x: 0},
    exit: {x: -window.innerWidth}
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
    const contents = [nowPlaying, trending]
    const [rowIndex, setIndex] = useState(0)
    const [leaving, setLeaving] = useState(false)
    const increaseIndex = (event: any) => {
        if (leaving) return
        const {currentTarget} = event
        if (currentTarget.id === "현재 상영중인 영화") {
            return
        }
        if (currentTarget.id === '지금 뜨는 콘텐츠') {

            if (leaving) return
            toggleLeaving()
            const totalMovies = nowPlaying?.results.length || trending?.results.length
            const maxIndex = Math.floor((totalMovies || 1) / offset)
            setIndex((prev: number) => prev === maxIndex ? 0 : prev + 1)

            console.log(rowIndex)
        }
    }
    console.log(nowPlaying)
    console.log(trending)
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
                                <Row key={content.slider_title === '지금 뜨는 콘텐츠' ? rowIndex : null}
                                     variants={rowVariants} initial='hidden' animate='visible' exit='exit'
                                     transition={{type: 'linear', duration: 1}}>
                                    {content?.results.slice(1).slice(offset * rowIndex, offset * rowIndex + offset).map((movie: any) =>
                                        <Box key={movie.id}
                                             bg_photo={makeImagePath(movie.backdrop_path, "w500")}
                                        />)}
                                </Row>
                            </AnimatePresence>
                        </Slider>
                    )
                }
            </>}
    </Wrapper>
};

export default Home;