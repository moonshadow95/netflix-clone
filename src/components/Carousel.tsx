import React, {useState} from 'react'
import {AnimatePresence, motion} from "framer-motion"
import {makeImagePath} from "../util/utils"
import styled from "styled-components"
import {ContentType} from "../types"
import {useNavigate} from "react-router-dom"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faChevronLeft, faChevronRight} from "@fortawesome/free-solid-svg-icons"


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

const Buttons = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: -70px;
  width: 100vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Button = styled(motion.span)`
  width: 70px;
  height: 70px;
  background-color: rgba(0, 0, 0, 0.4);
  font-size: 32px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:first-child {
    margin-left: 24px;
  }

  &:last-child {
    margin-right: 24px;
  }
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

const Carousel = ({content}: { content: any }) => {
    const [rowIndex, setIndex] = useState(0)
    const [secondIndex, setSecondIndex] = useState(0)
    const [leaving, setLeaving] = useState(false)
    const navigate = useNavigate()
    const onBoxClick = (id: number) => navigate(`movies/${id}`)
    const increaseIndex = (event: any) => {
        if (leaving) return
        const {currentTarget} = event
        if (currentTarget.id === ContentType.Movies) {
            if (leaving) return
            toggleLeaving()
            const totalMovies = content?.results.length
            const maxIndex = Math.floor((totalMovies || 1) / offset)
            setSecondIndex((prev: number) => prev === maxIndex ? 0 : prev + 1)
        }
        if (currentTarget.id === ContentType.Tvs) {
            if (leaving) return
            toggleLeaving()
            const totalMovies = content?.results.length
            const maxIndex = Math.floor((totalMovies || 1) / offset)
            setIndex((prev: number) => prev === maxIndex ? 0 : prev + 1)
        }
    }
    const toggleLeaving = () => setLeaving(prev => !prev)
    return (
        <Slider>
            <SliderTitle>
                {content.slider_title}
            </SliderTitle>
            <Buttons>
                <Button
                    id={content.slider_title}
                    whileHover={{backgroundColor: 'rgba(255,255,255,0.2)'}}
                    whileTap={{backgroundColor: 'rgba(255,255,255,0.5)'}}
                    onClick={increaseIndex}><FontAwesomeIcon
                    icon={faChevronLeft}/></Button>
                <Button
                    id={content.slider_title}
                    whileHover={{backgroundColor: 'rgba(255,255,255,0.2)'}}
                    whileTap={{backgroundColor: 'rgba(255,255,255,0.5)'}}
                    onClick={increaseIndex}><FontAwesomeIcon
                    icon={faChevronRight}/></Button>
            </Buttons>
            <AnimatePresence onExitComplete={toggleLeaving} initial={false}>
                <Row key={content.slider_title === '인기 TV 콘텐츠' ? rowIndex : secondIndex}
                     variants={rowVariants} initial='hidden' animate='visible' exit='exit'
                     transition={{type: 'linear', duration: 1}}>
                    {content?.results.slice(1)
                        .slice(offset * (content.slider_title === '인기 TV 콘텐츠' ? rowIndex : secondIndex), offset * (content.slider_title === '인기 TV 콘텐츠' ? rowIndex : secondIndex) + offset)
                        .map((movie: any) =>
                            <Box key={movie.id} onClick={() => onBoxClick(movie.id)}
                                 layoutId={movie.id + ""} variants={boxVariants}
                                 initial='normal' whileHover='hover' transition={{type: 'linear'}}
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
};

export default Carousel;
