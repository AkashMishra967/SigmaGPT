import {useState} from "react";

function Signup()  {
    const [username,setusername] = useState("");
    const [email,setemail] = useState("");
    const [password,setpassword] = useState("");



const handleSignup = async() =>{
    const response = await fetch("http://localhost:5000/api/auth/signup",{
        method :"POST",
        headers: {"Content-Type":"application/json"},
        body:JSON.stringify({username,email,password})
    });
    const data = await response.json();
    console.log(data);
}





    return(
        <>
        <div>
<input type="text" placeholder="Enter the username" value={username} 
onChange={(e) =>setusername(e.target.value)}/>

<input type="email" placeholder="Enter the email" value={email}
onChange={(e) =>setemail(e.target.value)} />

<input type="password" placeholder="enter the password" value={password}
onChange={(e) =>setpassword(e.target.value)} />

<button 
onClick={handleSignup}
>Signup</button>
        </div>
        </>

    )
}



export default Signup;