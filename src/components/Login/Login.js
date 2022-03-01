import React, { useState } from "react";
import "./Login.css";
import "bootstrap/dist/css/bootstrap.min.css";
import PropTypes from "prop-types";

export default function Login({ setToken }) {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [passwordError, setpasswordError] = useState("");
  const [error, setError] = useState("");

  async function loginUser(credentials) {
    return fetch("http://localhost:8080/users/authenticate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        
      },
      body: JSON.stringify(credentials),
    }).then((data) => data.json());
  }

  const handleValidation = (event) => {
    let formIsValid = true;

    if (!password.match(/^[a-zA-Z]{8,22}$/)) {
      formIsValid = false;
      setpasswordError(
        "Only Letters and length must best min 8 Chracters and Max 22 Chracters"
      );
      return false;
    } else {
      setpasswordError("");
      formIsValid = true;
    }

    return formIsValid;
  };

  const loginSubmit = async (e) => {
    e.preventDefault();
    let valid = handleValidation();

    if (valid) {
      const token = await loginUser({
        username,
        password,
      });
      console.log("THE USERS TOKEN: " + JSON.stringify(token));
      if (token.status === 401 || token.error === "Unauthorized") {
        setError("Incorrect login details");
      } else {
        setToken(token);
      }
    }
  };

  return (
    <div className="MainContainer">
      <div className="container">
        <h1 className="title">Infinity</h1>
        <div className="row d-flex justify-content-center">
          <div className="col-md-4">
            <form
              className=" justify-content-center"
              id="loginform"
              onSubmit={loginSubmit}
            >
              <small id="passworderror" className="text-danger form-text">
                {error}
              </small>
              <div className="form-group">
                <label className="title">Username:</label>
                <input
                  type="text"
                  className="form-control"
                  id="text"
                  name="text"
                  aria-describedby="emailHelp"
                  placeholder="Enter username"
                  onChange={(event) => setUsername(event.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="title">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="exampleInputPassword1"
                  placeholder="Password"
                  onChange={(event) => setPassword(event.target.value)}
                />
                <small id="passworderror" className="text-danger form-text">
                  {passwordError}
                </small>
              </div>
              <button type="submit" className="btn btn-primary btnSub">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired,
};
