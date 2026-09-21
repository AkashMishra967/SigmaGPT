import {useState} from "react";
import { useNavigate, Link } from "react-router-dom";
import { BASE_URL } from "./config.js";
import "./signup.css";

function Signup()  {
     const navigate = useNavigate();
    const [username,setusername] = useState("");
    const [email,setemail] = useState("");
    const [password,setpassword] = useState("");
    const [errorMsg,setErrorMsg] = useState();
    const [loading, setLoading] = useState(false);

const handleSignup = async() =>{
    setLoading(true);
    try {
        const response = await fetch(`${BASE_URL}/api/auth/signup`,{
            method :"POST",
            headers: {"Content-Type":"application/json"},
            body:JSON.stringify({username,email,password})
        });
        const data = await response.json();
        if(response.ok){
            navigate("/login");
        }else{
            setErrorMsg(data.message);
        }
    } catch (err) {
        setErrorMsg("Something went wrong. Try again.");
    } finally {
        setLoading(false);
    }
}

    return(
        <div className="parent">
            <div className="authCard">
                <div className="logoCircle">S</div>
                <h1 className="head1">Create your account</h1>
                <p className="subText">Sign up to get started with SigmaGPT</p>

                <input className="inp1" type="text" placeholder="Username" value={username}
                    onChange={(e) =>setusername(e.target.value)}/>

                <input className="inp1" type="email" placeholder="Email address" value={email}
                    onChange={(e) =>setemail(e.target.value)} />

                <input className="inp1" type="password" placeholder="Password" value={password}
                    onChange={(e) =>setpassword(e.target.value)} />

                {errorMsg && <p className="errorMsg">{errorMsg}</p>}

                <button className="btn1" onClick={handleSignup} disabled={loading}>
                    {loading ? "Creating account..." : "Sign Up"}
                </button>

                <p className="switchText">
                    Already have an account? <Link to="/login" className="switchLink">Log in</Link>
                </p>
            </div>
        </div>
    )
}

export default Signup;