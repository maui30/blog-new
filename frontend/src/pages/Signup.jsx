import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      return setErrMsg("Please fill up all the fields");
    }

    try {
      setLoading(true);
      setErrMsg(null);
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();
      if (data.success === false) {
        return setErrMsg(data.message);
      }

      setLoading(false);
      console.log(data.message);

      if (res.ok) {
        navigate("/");
      }
    } catch (err) {
      setErrMsg(err.message);
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <h1>Signup</h1>
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username: </label>
          <input
            className="border-2"
            type="text"
            name="username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <label htmlFor="email">Email:</label>
          <input
            className="border-2"
            type="text"
            name="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />

          <label htmlFor="password">Password:</label>
          <input
            className="border-2"
            type="text"
            name="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <p>{errMsg}</p>
          <button type="submit">Submit</button>
        </form>
      </div>
    </>
  );
};

export default Signup;
