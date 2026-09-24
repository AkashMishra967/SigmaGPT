import './App.css';
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import Login from "./login.jsx";
import Signup from "./signup.jsx";
import { MyContext } from "./MyContext.jsx";
import { useState, useEffect } from 'react';
import { v1 as uuidv1 } from "uuid";
import { BASE_URL } from "./config.js";
import ForgotPassword from "./ForgotPassword.jsx";
import ResetPassword from "./ResetPassword.jsx";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function Dashboard() {
    return (
        <>
            <Sidebar />
            <ChatWindow />
        </>
    );
}

function App() {
    const [prompt, setPrompt] = useState("");
    const [reply, setReply] = useState(null);
    const [currThreadId, setCurrThreadId] = useState(uuidv1());
    const [prevChats, setPrevChats] = useState([]);
    const [newChat, setNewChat] = useState(true);
    const [allThreads, setAllThreads] = useState([]);
    const [theme, setTheme] = useState("dark");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user,setuser] = useState("");
    const [authChecked, setAuthChecked] = useState(false);

    const toggleTheme = () => {
        setTheme(prev => prev === "dark" ? "light" : "dark");
    }
useEffect(() => {
    const checkAuth = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/auth/me`, {
                method: "GET",
                credentials: "include"
            });
            if (response.ok) {
                const data = await response.json();
                setIsLoggedIn(true);
                setuser(data.user);
            } else {
                setIsLoggedIn(false);
            }
        } catch (err) {
            setIsLoggedIn(false);
        } finally {
            setAuthChecked(true);
        }
    };
    checkAuth();
}, []);

    const providerValues = {
        prompt, setPrompt,
        reply, setReply,
        currThreadId, setCurrThreadId,
        newChat, setNewChat,
        prevChats, setPrevChats,
        allThreads, setAllThreads,
        theme, toggleTheme,
        user,setuser,
        sidebarOpen, setSidebarOpen,
        isLoggedIn, setIsLoggedIn,
    };

   
    if (!authChecked) {
        return <div>Loading...</div>;
    }

    return (
        <div className='app' data-theme={theme}>
            <MyContext.Provider value={providerValues}>
                <BrowserRouter>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                        <Route
                            path="/"
                            element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
                        />
                    </Routes>
                </BrowserRouter>
            </MyContext.Provider>
        </div>
    )
}

export default App;