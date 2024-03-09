import React from "react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) return setErrMsg("All field are required");

    try {
      setLoading(true);
      setErrMsg(null);
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = res.json();
      if (data.success === false) return setErrMsg(data.message);

      setLoading(false);
      console.log(data.message);

      if (res.ok) navigate("/");
    } catch (err) {
      setErrMsg(err.message);
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email: </label>
        <input
          className="border-2"
          type="text"
          name="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <label htmlFor="password">Password: </label>
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
        <button type="submit">Login</button>
      </form>
    </>
  );
};

export default Signin;
