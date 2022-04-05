import React, {useState} from 'react'
import {AnimatePresence, motion} from "framer-motion"
import {makeImagePath} from "../util/utils"
import styled from "styled-components"
import {Contents, ContentType, APIResult} from "../types"
import {useNavigate} from "react-router-dom"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faChevronLeft, faChevronRight} from "@fortawesome/free-solid-svg-icons"


const Slider = styled.div`
  position: relative;
  width: calc(100% - 140px);
  margin: 0 auto;
  top: -320px;
  height: 350px;
`

const SliderTitle = styled.h3`
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 15px;
`

const Row = styled(motion.div)<{ rowOffset: number }>`
  display: grid;
  gap: 8px;
  grid-template-columns:repeat(${props => props.rowOffset}, 1fr);
  width: 100%;
  position: absolute;
`

const Buttons = styled.div`
  position: absolute;
  top: 50%;
  width: calc(100vw - 20px);
  transform: translateY(-50%);
  margin-left: -70px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Button = styled(motion.span)`
  width: 70px;
  height: 70px;
  font-size: 32px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Box = styled(motion.div)<{ bg_photo: string }>`
  background-image: url(${props => props.bg_photo});
  background-position: center;
  background-size: cover;
  height: 250px;
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

const rowVariants = {
    hidden: (backward: boolean) => ({
        x: backward ? -window.innerWidth : window.innerWidth
    }),
    visible: {x: 0},
    exit: (backward: boolean) => ({
        x: !backward ? -window.innerWidth : window.innerWidth
    })
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

const offset = 5

const Carousel = ({content}: { content: APIResult }) => {
    const [tvsIndex, setTvsIndex] = useState(0)
    const [moviesIndex, setMoviesIndex] = useState(0)
    const [leaving, setLeaving] = useState(false)
    const [backward, setBackward] = useState(false)
    const navigate = useNavigate()
    const toggleLeaving = () => setLeaving(prev => !prev)
    const onBoxClick = (id: number) => navigate(`movies/${id}`)
    const increaseIndex = (event: React.MouseEvent) => {
        const {currentTarget: {id}} = event
        if (leaving) return
        setBackward(false)
        toggleLeaving()
        const totalMovies = content.results.length
        const maxIndex = Math.ceil(totalMovies / offset) - 1
        if (id === ContentType.Movies) setMoviesIndex((currentIndex: number) => currentIndex === maxIndex ? 0 : currentIndex + 1)
        if (id === ContentType.Tvs) setTvsIndex((currentIndex: number) => currentIndex === maxIndex ? 0 : currentIndex + 1)
        console.log(maxIndex)
    }
    const decreaseIndex = (event: any) => {
        const {currentTarget: {id}} = event
        if (leaving) return
        setBackward(true)
        toggleLeaving()
        const totalContents = content.results.length
        const maxIndex = Math.ceil(totalContents / offset)
        if (id === ContentType.Movies) setMoviesIndex((currentIndex: number) => currentIndex === 0 ? maxIndex : currentIndex - 1)
        if (id === ContentType.Tvs) setTvsIndex((currentIndex: number) => currentIndex === 0 ? maxIndex : currentIndex - 1)
    }

    return (
        <Slider>
            <SliderTitle>
                {content.slider_title}
            </SliderTitle>
            <Buttons>
                <Button
                    id={content.slider_title}
                    whileHover={{backgroundColor: 'rgba(255,255,255,0.3)'}}
                    whileTap={{backgroundColor: 'rgba(255,255,255,0.5)'}}
                    onClick={decreaseIndex}>
                    <FontAwesomeIcon icon={faChevronLeft}/>
                </Button>
                <Button
                    id={content.slider_title}
                    whileHover={{backgroundColor: 'rgba(255,255,255,0.3)'}}
                    whileTap={{backgroundColor: 'rgba(255,255,255,0.5)'}}
                    onClick={increaseIndex}>
                    <FontAwesomeIcon icon={faChevronRight}/>
                </Button>
            </Buttons>
            <AnimatePresence onExitComplete={toggleLeaving} initial={false}>
                <Row key={content.slider_title === ContentType.Tvs ? tvsIndex : moviesIndex}
                     variants={rowVariants} initial='hidden' animate='visible' exit='exit'
                     custom={backward}
                     transition={{type: 'linear', duration: 1}}
                     rowOffset={offset}
                >
                    {content.results.slice(0)
                        .slice((content.slider_title === ContentType.Tvs ? tvsIndex : moviesIndex) * offset, offset * ((content.slider_title === ContentType.Tvs ? tvsIndex : moviesIndex) + 1))
                        // .slice(moviesIndex * offset, (moviesIndex + 1) * offset)
                        .map((item: Contents) =>
                            <Box key={item.id} onClick={() => onBoxClick(item.id)}
                                 layoutId={item.id + ""} variants={boxVariants}
                                 initial='normal' whileHover='hover' transition={{type: 'linear'}}
                                 bg_photo={makeImagePath(item.backdrop_path, "w500")}
                            >
                                <Info variants={infoVariants}>
                                    <h4>{item.title || item.name}</h4>
                                </Info>
                            </Box>)}
                </Row>
            </AnimatePresence>
        </Slider>
    )
};

export default Carousel;
