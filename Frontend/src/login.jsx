import { useState } from "react";
import { BASE_URL } from "./config.js";
import { useNavigate, Link } from "react-router-dom";
import { useContext } from "react";
import { MyContext } from "./MyContext.jsx";
import "./login.css";

function Login(){

     const navigate = useNavigate();
    const [email,setemail] = useState("");
    const [password,setpassword] = useState("");
    const [errorMsg,seterrorMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const { setIsLoggedIn, setuser } = useContext(MyContext);

    const handleLogin = async()=>{
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/api/auth/login`,{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                credentials: "include",
                body:JSON.stringify({email,password})
            });

            const data = await response.json();
            if(response.ok){
                setIsLoggedIn(true);
                setuser(data.user);
                navigate("/");
            }else{
                seterrorMsg(data.message);
            }
        } catch (err) {
            seterrorMsg("Something went wrong. Try again.");
        } finally {
            setLoading(false);
        }
    }

    return(
        <div className="parent">
            <div className="authCard">
                <div className="logoCircle">S</div>
                <h1 className="head1">Welcome back</h1>
                <p className="subText">Log in to continue to SigmaGPT</p>

                <input className="inp1" type="email" placeholder="Email address" value={email}
                    onChange={(e) =>setemail(e.target.value)} />

                <input className="inp1" type="password" placeholder="Password" value={password}
                    onChange={(e) =>setpassword(e.target.value)} />

                {errorMsg && <p className="errorMsg">{errorMsg}</p>}

                <button className="btn1" onClick={handleLogin} disabled={loading}>
                    {loading ? "Logging in..." : "Log In"}
                </button>

                <p className="switchText">
                    Don't have an account? <Link to="/signup" className="switchLink">Sign up</Link>
                </p>
            </div>
        </div>
    )
}

export default Login;