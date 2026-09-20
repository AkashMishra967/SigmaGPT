import { useState } from "react";
import { BASE_URL } from "./config.js";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { MyContext } from "./MyContext.jsx";


function Login(){

     const navigate = useNavigate();
const [email,setemail] = useState("");
const [password,setpassword] = useState("");
const [errorMsg,seterrorMsg] = useState("");
const { setIsLoggedIn, setuser } = useContext(MyContext);

const handleLogin = async()=>{
    const response = await fetch(`${BASE_URL}/api/auth/login`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        credentials: "include",
        body:JSON.stringify({email,password})
    })

    const data = await response.json();
    console.log(data);
    if(response.ok){
        setIsLoggedIn(true);
        setuser(data.user);
        navigate("/");
    }else{
seterrorMsg(data.message);
    }
}



return(
    <>
<div>
    <input type="email" placeholder="enter you email" value={email}
    onChange={(e) =>setemail(e.target.value)} />

<input type="password" placeholder="enter the password" value={password}
onChange={(e) =>setpassword(e.target.value)} />

{errorMsg && <p style={{color:"red"}}>{errorMsg}</p>}

<button onClick={handleLogin}>Login</button>


</div>
    </>
)
}

export default Login;