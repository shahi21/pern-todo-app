import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
    const navigate=useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


useEffect(()=>{
  if (localStorage.getItem("token")){
    navigate("/todos");
  }
},[navigate])

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:5000/login", { email, password }, 
        { headers: { "Content-Type": "application/json" } } 
      );
  
      localStorage.setItem("token", data.token);
      navigate("/todos");
    } catch (error) {
       // Display an alert if login fails
    if (error.response && error.response.data.msg) {
      alert(error.response.data.msg);
    } else {
      alert("Login failed. Please try again.");
    }
    }
  };

  return (
   
<div className="container d-flex justify-content-center align-items-center vh-100">
  
<div className="card p-4 shadow-lg w-50">
<h1 className="text-center mb-4 text-dark fw-bold">Todo App 📝</h1>
<h2 className="text-center mb-4 text-primary ">Login</h2>
<form onSubmit={handleLogin}>
  <div className="mb-3">
  <input type="email" className="form-control" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
  </div>
  <div className="mb-3">
  <input type="password" className="form-control" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
  </div>
  <button type="submit" className="btn btn-primary w-100">Login</button>
</form>
<p className="text-center mt-3 text-decoration-underline">Don't have an account? Click on Register</p>
<button className="btn btn-secondary w-100" onClick={() => navigate("/register")}>Register</button>
</div>
</div>

);
}

export default Login;