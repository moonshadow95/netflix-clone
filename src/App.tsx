import React from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./routes/Home";
import Series from "./routes/Series";
import Search from "./routes/Search";
import Header from "./components/Header";
import MyList from "./routes/MyList";
import Latest from "./routes/Latest";
import Movies from "./routes/Movies";

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