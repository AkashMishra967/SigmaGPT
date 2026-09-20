import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext";
import {v1 as uuidv1} from "uuid";
import logo from "./assets/blacklogo.png";
import { BASE_URL } from "./config.js";


function SideBar(){
    const {
        allThreads, setAllThreads,
        currThreadId, setCurrThreadId,
        setNewChat, setPrompt, setReply, setPrevChats,
        sidebarOpen, setSidebarOpen, 
        user,setuser,
    } = useContext(MyContext);

    const getAllThreads = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/thread`, {
                credentials: "include"
            });
            const res = await response.json();
            const filterData = res.map(thread => ({ threadId: thread.threadId, title: thread.title }));
            console.log(filterData);
            setAllThreads(filterData);
        } catch(err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getAllThreads();
    }, [currThreadId]);

    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
        setSidebarOpen(false);
    }

    const changeThread = async (newthreadId) => {
        setCurrThreadId(newthreadId);
        try {
            const response = await fetch(`${BASE_URL}/api/thread/${newthreadId}`, {
                credentials: "include"
            });
            const res = await response.json();
            console.log(res);
            setPrevChats(res);
            setNewChat(false);
            setReply(null);
            setSidebarOpen(false);
        } catch(err) {
            console.log(err);
        }
    }

    const deleteThread = async (threadId) => {
        try {
            const response = await fetch(`${BASE_URL}/api/thread/${threadId}`, {
                method: "DELETE",
                credentials: "include"
            });
            const res = await response.json();
            console.log(res);
            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));
            if(threadId === currThreadId){
                createNewChat();
            }
        } catch(err) {
            console.log(err);
        }
    }

    return(
        <section className={`sidebar ${sidebarOpen ? "open" : ""}`}>
            <button onClick={createNewChat}>
                <img src={logo} alt="gpt logo" className="logo" />
                <h3>New Chat</h3>
                <span><i className="fa-solid fa-pen-to-square"></i></span>
            </button>

            <ul className="history">
                {
                    allThreads?.map((thread, idx) => (
                        <li
                            key={idx}
                            onClick={() => changeThread(thread.threadId)}
                            className={thread.threadId === currThreadId ? "heighlighted" : " "}
                        >
                            {thread.title}
                            <i
                                className="fa-solid fa-trash"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteThread(thread.threadId);
                                }}
                            ></i>
                        </li>
                    ))
                }
            </ul>

           <div className="sign">
    <p>
        <span className="avatar">
            {user?.username?.split(" ")[0]?.[0]?.toUpperCase()}
            {user?.username?.split(" ")?.slice(-1)[0]?.[0]?.toUpperCase()}
        </span>
        {user?.username}
    </p>
</div>
        </section>
    )
}

export default SideBar;