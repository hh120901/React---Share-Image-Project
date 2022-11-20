import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Home from "./container/Home";
import { fetchUser } from "./utils/fetchUser";

const App = () => {
    const navigate = useNavigate();
    useEffect(()=>{
        const user = JSON.parse(fetchUser());
        if(!user) {
            navigate('/login');
        }
    },[])
    return (
        <Routes>
            <Route path="login" element={<Login />}></Route>
            <Route path="/*" element={<Home />}></Route>
        </Routes>
    )
}

export default App