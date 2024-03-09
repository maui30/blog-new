import React from "react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  signInStart,
  signInSuccess,
  signInFail,
} from "../redux/users/userSlice";
import { useDispatch, useSelector } from "react-redux";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { loading, error: errMsg } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password)
      return dispatch(signInFail("All field are required"));

    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      console.log("Response status:", res.status); // Log response status

      const data = await res.json(); // Await the JSON parsing here
      //console.log("Response data:", data); // Log response data

      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
      } else {
        dispatch(signInFail(data.message)); // Handle errors from the server
      }
    } catch (err) {
      dispatch(signInFail(err.message));
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
