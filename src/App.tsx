import React from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./Routes/Home";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Home/>}/>
                <Route path='/search' element={null}/>
                <Route path='/tv' element={null}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App;
