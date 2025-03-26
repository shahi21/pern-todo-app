import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:5000/register", {name,email, password,});

      alert("Registration successful! You can now log in.");
      navigate("/login"); 
    } catch (error) {
      console.error("Registration error:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-5 shadow-lg">
      <h1 className="text-center mb-4 text-dark fw-bold">Todo App 📝</h1>
        <h2 className="text-center mb-4 text-primary">Register</h2>
    <form onSubmit={handleRegister}>
      <div className="mb-3">
      <input className="form-control" type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="mb-3">
      <input className="form-control" type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="mb-3">
      <input className="form-control" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <button className="btn btn-primary mt-4 w-100" type="submit">Register</button>
    </form>
    </div>
    </div>
  );
}

export default Register;
