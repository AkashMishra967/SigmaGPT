import {useState} from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "./config.js";
import "./signup.css";

function Signup()  {
     const navigate = useNavigate();
    const [username,setusername] = useState("");
    const [email,setemail] = useState("");
    const [password,setpassword] = useState("");
    const [errorMsg,setErrorMsg] = useState();



const handleSignup = async() =>{
    const response = await fetch(`${BASE_URL}/api/auth/signup`,{
        method :"POST",
        headers: {"Content-Type":"application/json"},
        body:JSON.stringify({username,email,password})
    });
    const data = await response.json();
    console.log(data);
    if(response.ok){
        navigate("/login");
    }else{
        setErrorMsg(data.message);
    }
}


    return(
        <>
        <div className="parent">
            <h1 className="head1">Signup</h1>
<input  className ="inp1" type="text" placeholder="Enter the username" value={username} 
onChange={(e) =>setusername(e.target.value)}/>

<input  className ="inp1" type="email" placeholder="Enter the email" value={email}
onChange={(e) =>setemail(e.target.value)} />

<input  className ="inp1" type="password" placeholder="enter the password" value={password}
onChange={(e) =>setpassword(e.target.value)} />

{errorMsg && <p style={{color: "red",textAlign:"center"}}>{errorMsg}</p>}

<button  className ="btn1" onClick={handleSignup}>Signup</button></div>
        </>

    )
}



export default Signup;