import React from 'react';
import {getMovies} from "../api";
import {useQuery} from "react-query";

const Home = () => {
    const {data, isLoading} = useQuery(["movies", "nowPlaying"], getMovies)
    console.log(data, isLoading)
    return <div style={{backgroundColor: 'black', height: "100vh"}}>HOME</div>
};

export default Home;