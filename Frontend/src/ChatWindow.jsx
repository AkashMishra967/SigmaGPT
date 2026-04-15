import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import { ScaleLoader } from "react-spinners";

function ChatWindow() {
  const {
    prompt, setPrompt,
    reply, setReply,
    currThreadId,
    prevChats, setNewChat, setPrevChats,
    theme, toggleTheme,
    sidebarOpen, setSidebarOpen,
  } = useContext(MyContext);

  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const getReply = async () => {
    setLoading(true);
    setNewChat(false);
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: prompt, threadId: currThreadId }),
    };
    try {
      const response = await fetch("https://sigmagpt-1-trqs.onrender.com/api/chat", options);
      const data = await response.json();
      setReply(data.reply);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (prompt && reply) {
      setPrevChats((prevChats) => [
        ...prevChats,
        { role: "user", content: prompt },
        { role: "assistant", content: reply },
      ]);
    }
    setPrompt("");
  }, [reply]);

  const handleProfileClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="chatWindow">

      {/* ── MOBILE OVERLAY ── */}
      <div
        className={`overlay ${sidebarOpen ? "open" : ""}`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      <div className="navbar">
        {/* Left side - hamburger + title */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button className="hamburger" onClick={() => setSidebarOpen(true)}>
            <i className="fa-solid fa-bars"></i>
          </button>
          <span>
            SigmaGPT <i className="fa-solid fa-angle-down"></i>
          </span>
        </div>

        {/* Right side - theme + user */}
        <div className="navRight">
          <button className="themeToggle" onClick={toggleTheme} title="Toggle Theme">
            {theme === "dark" ? (
              <i className="fa-solid fa-sun"></i>
            ) : (
              <i className="fa-solid fa-moon"></i>
            )}
          </button>

          <div className="userIconDiv" onClick={handleProfileClick}>
            <span className="userIcon">
              <i className="fa-solid fa-user"></i>
            </span>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="dropDown">
          <div className="dropDownItem">
            <i className="fa-regular fa-star"></i>Upgrade plan
          </div>
          <div className="dropDownItem">
            <i className="fa-solid fa-gear"></i>Setting
          </div>
          <div className="dropDownItem">
            <i className="fa-solid fa-arrow-right-from-bracket"></i>Log out
          </div>
        </div>
      )}

      <Chat />
      <ScaleLoader color="#afff" loading={loading} />

      <div className="chatInput">
        <div className="inputBox">
          <input
            placeholder="Ask anything"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? getReply() : " ")}
          />
          <div id="submit" onClick={getReply}>
            <i className="fa-regular fa-paper-plane"></i>
          </div>
        </div>
        <p className="info">
          SigmaGPT can make mistake. Check important info. See Cookie Preference.
        </p>
      </div>
    </div>
  );
}

export default ChatWindow;