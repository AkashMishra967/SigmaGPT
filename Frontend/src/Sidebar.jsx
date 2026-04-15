import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext";
import {v1 as uuidv1} from "uuid";
function SideBar(){
    const {allThreads, setAllThreads, currThreadId, setCurrThreadId,setNewChat,setPrompt, setReply, setPrevChats} = useContext(MyContext);

    const getAllThreads = async () =>{

        try{
            const response = await fetch("https://sigmagpt-1-trqs.onrender.com/api/thread");
            const res = await response.json();
            const filterData = res.map(thread => ({threadId: thread. threadId, title: thread.title}));
            
            console.log(filterData);
            setAllThreads(filterData);
        }catch(err){
            console.log(err);
        }
    };
    useEffect(() =>{
        getAllThreads();
    }, [currThreadId])
    // create new chat
    const createNewChat = () =>{
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats ([]);
    }
    
const changeThread = async (newthreadId)=>{
 setCurrThreadId(newthreadId);
 try{
    const response = await fetch(`https://sigmagpt-1-trqs.onrender.com/api/thread/${newthreadId}`);
    const res = await response.json();
    console.log(res);
    setPrevChats(res);
    setNewChat(false);
    setReply(null);
 }
catch(err){
    console.log(err);
}
}
// delete the thread

const deleteThread = async (threadId) =>{
    try{
        const response = await fetch(`https://sigmagpt-1-trqs.onrender.com/api/thread/${threadId}`,{method:"Delete"});
        const res = await response.json();
        console.log(res);
        // updated threads re-render
        setAllThreads(prev =>prev.filter(thread => thread.threadId !== threadId));
        if(threadId === currThreadId){
            createNewChat();
        }
    }catch(err){
        console.log(err);
    }
}

    return(
        <section className="sidebar">
            <button onClick={createNewChat}>
                <img src="src/assets/blacklogo.png" alt="gpt logo" className="logo"></img>
                <h3>New Chat</h3>
              <span>  <i className="fa-solid fa-pen-to-square"></i></span>
            </button>
            
            <ul className="history">
                {
                  allThreads?.map((thread, idx) =>(
                    <li key={idx}
                    onClick={(e) => changeThread(thread.threadId)}
                   className={thread.threadId === currThreadId ? "heighlighted":" "}
                    >{thread.title}
                    <i className="fa-solid fa-trash"
                   onClick={(e) => {
                    e.stopPropagation();// stop event bubling
                    deleteThread(thread.threadId);
                   }
                }

                    ></i>
                    
                    </li>
                  ))
                }
                
            </ul>
            
            <div className="sign">
                
                <p><i className="fa-regular fa-circle circle"></i> Akash Mishra</p>
            </div>
        </section>
    )
}
export default SideBar;