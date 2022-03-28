import React from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./Routes/Home";
import Series from "./Routes/Series";
import Search from "./Routes/Search";
import Header from "./Components/Header";
import MyList from "./Routes/MyList";
import Latest from "./Routes/Latest";
import Movies from "./Routes/Movies";

function App() {
    return (
        <BrowserRouter>
            <Header/>
            <Routes>
                <Route path='/*' element={<Home/>}>
                    <Route path='movies/:movieId'/>
                </Route>
                <Route path='/series' element={<Series/>}/>
                <Route path='/movies' element={<Movies/>}/>
                <Route path='/latest' element={<Latest/>}/>
                <Route path='/my-list' element={<MyList/>}/>
                <Route path='/search' element={<Search/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App;