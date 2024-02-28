import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e) => {
  
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/v1/users/register', { // Updated URL
        username,
        fullname,
        email,
        password
      });
      console.log("Registration successful:", response.data);
      setSuccess(true);
      setError(null);
    } catch (error) {
      console.error("Registration failed:", error);
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="mt-4">
      <h1 className="text-center text-4xl uppercase font-bold mb-4">Register</h1>
      <form onSubmit={handleRegister} className="flex flex-col max-w-md mx-auto">
        <input
          className="border border-solid"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="text"
          placeholder="Full Name"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
        />
        <input
          type="text"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <div className="text-red-500">{error}</div>}
        {success && (
          <div className="text-green-500">Registration successful. Please <Link to="/login">login</Link>.</div>
        )}
        <button className="primary">Register</button>
        <div className="mt-2 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-800 underline">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
