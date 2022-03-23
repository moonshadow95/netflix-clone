import React from 'react';
import {getMovies, GetMoviesResult} from "../api";
import {useQuery} from "react-query";
import styled from "styled-components";
import {makeImagePath} from "../utils";

const Wrapper = styled.div`
  background-color: #000;

`

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Banner = styled.div<{ bgPhoto: string }>`
  width: 100%;
  height: 64vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0) 70%, rgba(0, 0, 0, 1)), url(${props => props.bgPhoto});
  background-size: cover;
  background-repeat: no-repeat;
`

const Title = styled.h2`
  font-size: 66px;
`

const Overview = styled.p`
`

const Home = () => {
    const {data, isLoading} = useQuery<GetMoviesResult>(["movies", "nowPlaying"], getMovies)
    return <Wrapper>
        {isLoading ?
            <Loader>Loading...</Loader> : <>
                <Banner bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}>
                    <Title>{data?.results[0].title}</Title>
                    <Overview>{data?.results[0].overview}</Overview>
                </Banner>
            </>}
    </Wrapper>
};

export default Home;