import React from 'react';
import {useSearchParams} from "react-router-dom";
import {useQuery} from "react-query";
import {Contents, searchMovieByKeyword} from "../api";

const Search = () => {
    const [searchParams] = useSearchParams()
    const keyword = searchParams.get('keyword')
    const {data, isLoading} = useQuery<Contents[]>('searched', () => searchMovieByKeyword(keyword || ''))
    console.log(data)
    return (
        <>
            {isLoading ? <h1>Loading...</h1> :
                <h1>Search</h1>
            }
        </>)
};

export default Search;