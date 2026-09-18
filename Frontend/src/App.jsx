import './App.css';
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import Login from "./login.jsx";
import Signup from "./signup.jsx";
import { MyContext } from "./MyContext.jsx";
import { useState } from 'react';
import { v1 as uuidv1 } from "uuid";
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

    const toggleTheme = () => {
        setTheme(prev => prev === "dark" ? "light" : "dark");
    }

    const providerValues = {
        prompt, setPrompt,
        reply, setReply,
        currThreadId, setCurrThreadId,
        newChat, setNewChat,
        prevChats, setPrevChats,
        allThreads, setAllThreads,
        theme, toggleTheme,
        sidebarOpen, setSidebarOpen,
        isLoggedIn, setIsLoggedIn, 
    };

    return (
        <div className='app' data-theme={theme}>
            <MyContext.Provider value={providerValues}>
                <BrowserRouter>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
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