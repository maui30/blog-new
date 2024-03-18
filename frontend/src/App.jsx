import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Header from "./components/Header";
import About from "./pages/About";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/About" element={<About />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/SignUp" element={<Signup />} />
        <Route path="/SignIn" element={<Signin />} />

        <Route element={<PrivateRoute />}>
          <Route path="/Dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
