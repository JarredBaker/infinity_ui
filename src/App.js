import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";

import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { NavigationBar } from "./components/NavigationBar";

import Sidebar from "./components/Sidebar";
import Login from "./components/Login/Login";
import { Home } from "./Home";
import About from "./About";
import NoMatch from "./NoMatch";

function App() {
  const [token, setToken] = useState();

  if (!token) {
    return <Login setToken={setToken} />;
  }

  return (
    <React.Fragment>
      <Router>
        <NavigationBar />
        <Sidebar />
        <Routes>
          <Route exact path="/" element={<Home token={token} />} />
          <Route path="/about" element={<About token={token} />} />
          <Route path="*" element={<NoMatch token={token} />} />
        </Routes>
      </Router>
    </React.Fragment>
  );
}

export default App;
