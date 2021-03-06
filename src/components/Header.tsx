import React, {useEffect, useState} from 'react'
import styled from "styled-components"
import {motion, useAnimation, useViewportScroll} from "framer-motion"
import {Link, useMatch, useNavigate} from "react-router-dom"
import {useForm} from "react-hook-form"

const Nav = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
  font-size: 17px;
  color: white;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 999;
`

const Col = styled.div`
  display: flex;
  align-items: center;
`

const Logo = styled(motion.svg)`
  margin: 0 60px;

  path {
    stroke: white;
    stroke-width: 3;
  }
`

const Items = styled.ul`
  display: flex;
  align-items: center;
`

const Item = styled.li`
  position: relative;
  margin-right: 34px;

`

const Circle = styled(motion.span)`
  position: absolute;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: ${props => props.theme.red};
  bottom: -8px;
  left: 0;
  right: 0;
  margin: 0 auto
`

const Search = styled.form`
  color: white;
  display: flex;
  align-items: center;
  position: relative;
  margin-right: 40px;

  svg {
    height: 25px;
  }
`

const Input = styled(motion.input)`
  transform-origin: right center;
  width: 200px;
  position: absolute;
  right: 0px;
  padding: 10px;
  padding-left: 40px;
  color: white;
  font-size: 18px;
  background-color: rgb(30, 30, 30);
  border: 1px solid ${(props) => props.theme.white.lighter};;
`

const logoVariants = {
    start: {pathLength: 0},
    end: {
        fill: ["rgba(216, 31, 38,0)", "rgba(216, 31, 38, 1)", "rgba(216, 31, 38, 0)"],
        pathLength: 1,
    },
}
const navVariants = {
    top: {
        backgroundColor: 'rgba(0,0,0,0)'
    },
    scroll: {
        backgroundColor: 'rgba(0,0,0,1)'
    }
}

interface Form {
    keyword: string
}

const Header = () => {
    const homeMatch = useMatch('/')
    const seriesMatch = useMatch('/series')
    const moviesMatch = useMatch('/movies')
    const latestMatch = useMatch('/latest')
    const myMatch = useMatch('/my-list')
    const [searchOpen, setSearchOpen] = useState(false)
    const inputAnimation = useAnimation()
    const navAnimation = useAnimation()
    const {scrollY} = useViewportScroll()
    const toggleSearch = () => {
        if (searchOpen) {
            inputAnimation.start({
                scaleX: 0
            })
        } else {
            inputAnimation.start({
                scaleX: 1
            })
        }
        setSearchOpen(prev => !prev)
    }
    useEffect(() => {
        scrollY.onChange(() => {
            if (scrollY.get() > 80) {
                navAnimation.start("scroll")
            } else {
                navAnimation.start("top")
            }
        })
    }, [scrollY])
    const {register, handleSubmit} = useForm<Form>();
    const onValid = (data: Form) => {
        navigate(`/search?keyword=${data.keyword}`)
    }
    const navigate = useNavigate()
    return (
        <Nav
            initial="top"
            variants={navVariants}
            animate={navAnimation}
        >
            <Col>
                <Logo
                    xmlns="http://www.w3.org/2000/svg" width="120" height="auto" viewBox="0 0 1024 276.742">
                    <motion.path
                        variants={logoVariants}
                        initial="start"
                        animate="end"
                        transition={{
                            default: {duration: 4, repeat: Infinity},
                            fill: {duration: 4, delay: 1, repeat: Infinity},
                        }}
                        d="M140.803 258.904c-15.404 2.705-31.079 3.516-47.294 5.676l-49.458-144.856v151.073c-15.404 1.621-29.457 3.783-44.051 5.945v-276.742h41.08l56.212 157.021v-157.021h43.511v258.904zm85.131-157.558c16.757 0 42.431-.811 57.835-.811v43.24c-19.189 0-41.619 0-57.835.811v64.322c25.405-1.621 50.809-3.785 76.482-4.596v41.617l-119.724 9.461v-255.39h119.724v43.241h-76.482v58.105zm237.284-58.104h-44.862v198.908c-14.594 0-29.188 0-43.239.539v-199.447h-44.862v-43.242h132.965l-.002 43.242zm70.266 55.132h59.187v43.24h-59.187v98.104h-42.433v-239.718h120.808v43.241h-78.375v55.133zm148.641 103.507c24.594.539 49.456 2.434 73.51 3.783v42.701c-38.646-2.434-77.293-4.863-116.75-5.676v-242.689h43.24v201.881zm109.994 49.457c13.783.812 28.377 1.623 42.43 3.242v-254.58h-42.43v251.338zm231.881-251.338l-54.863 131.615 54.863 145.127c-16.217-2.162-32.432-5.135-48.648-7.838l-31.078-79.994-31.617 73.51c-15.678-2.705-30.812-3.516-46.484-5.678l55.672-126.75-50.269-129.992h46.482l28.377 72.699 30.27-72.699h47.295z"
                        // fill="#d81f26"
                    />
                </Logo>
                <Items>
                    <Link to='/'>
                        <Item>Home
                            {homeMatch ? <Circle layoutId="circle"/> : null}
                        </Item>
                    </Link>
                    <Link to='/series'>
                        <Item>TV Shows
                            {seriesMatch ? <Circle layoutId="circle"/> : null}
                        </Item>
                    </Link>
                    <Link to='/movies'>
                        <Item>Movies
                            {moviesMatch ? <Circle layoutId="circle"/> : null}
                        </Item>
                    </Link>
                    <Link to='/latest'>
                        <Item>Recently Added
                            {latestMatch ? <Circle layoutId="circle"/> : null}
                        </Item>
                    </Link>
                    <Link to='/my-list'>
                        <Item>My List
                            {myMatch ? <Circle layoutId="circle"/> : null}
                        </Item>
                    </Link>
                </Items>
            </Col>
            <Col>
                <Search onSubmit={handleSubmit(onValid)}>
                    <motion.svg
                        onClick={toggleSearch}
                        animate={{x: searchOpen ? -164 : 0}}
                        transition={{type: "linear"}}
                        style={{zIndex: 1}}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                            clipRule="evenodd"
                        />
                    </motion.svg>
                    {/*TODO - error message*/}
                    <Input
                        {...register('keyword', {required: true, minLength: 2})}
                        initial={{scaleX: 0}}
                        animate={inputAnimation}
                        transition={{type: "linear"}}
                        placeholder=" title, genres"/>
                </Search>
            </Col>
        </Nav>
    )
};

export default Header;