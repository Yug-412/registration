import axios from "axios";
import React from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

function Resetpassword() {
  const { id } = useParams();
  const [password, setPassword] = useState("");
  const [newError, setNewError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [conPassword, setConPassword] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [showConPassword, setShowConPassword] = useState(false);

  const navigate = useNavigate();
  const submitHandler = async (e) => {
    e.preventDefault();
    
    // Retrieve user ID from session storage
    const userId = sessionStorage.getItem("id");

    // Check if user ID exists
    if (!userId) {
        console.error("User ID not found in session storage");
        return;
    }

    if (newError || confirmError) {
        toast.error("Please resolve any errors before submitting.");
    } else {
        try {
            const res = await axios.patch(`http://localhost:8000/user/${userId}`, {
                password: password,
                confirmpassword: conPassword,
            });

            if (res.status === 200) {
                // Password updated successfully
                navigate("/login");
                toast.success("Password Updated!");
            } else {
                throw new Error("Failed to update password");
            }
        } catch (error) {
            console.error("Error updating password:", error);
            toast.error("Failed to update password. Please try again.");
        }
    }
};


  const handleNewPassword = (e) => {
    const oldPassword = sessionStorage.getItem("password");
    const newPassword = e.target.value;
    if (newPassword.length < 8) {
      setNewError("Password must contain at least 8 characters");
    } else if (!/[@$#&*%]/.test(newPassword)) {
      setNewError("Password must contain at least one Special Character");
    } else if (!/[A-Z]/.test(newPassword)) {
      setNewError("Password must contain at least one capital letter");
    } else if (newPassword === oldPassword) {
      setNewError("New Password should not be same as Old one!");
    } else {
      setNewError("");
      console.log(newPassword);
    }
    setPassword(newPassword);
  };

  const handleConPassword = (e) => {
    const pass = e.target.value;
    setConPassword(pass);
    if (password !== pass) {
      setConfirmError("Password doesn't match.");
    } else {
      setConfirmError("");
    }
  };

  return (
    <>
      <div
        className="container-fluid card bg-light py-3"
        style={{ width: "400px", marginTop: "70px" }}
      >
        <header className="text-center">
          <h1>Reset Password</h1>
        </header>

        <section className="container d-flex justify-content-center">
          <form className="row g-3 p-2" onSubmit={submitHandler}>
            <div className="col">
              <div className="mb-3 mt-2">
                <div className="mb-3">
                  <label htmlFor="inputEmail4" className="form-label">
                    New Password <span style={{ color: "red" }}>*</span>
                  </label>
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      id="inputPassword4"
                      value={password}
                      onChange={handleNewPassword}
                      required
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </button>
                  </div>
                  <div className="text-danger">{newError}</div>
                </div>
                <div>
                  <label htmlFor="inputEmail5" className="form-label">
                    Confirm Password <span style={{ color: "red" }}>*</span>
                  </label>
                  <div className="input-group">
                    <input
                      type={showConPassword ? "text" : "password"}
                      className="form-control"
                      id="inputPassword5"
                      value={conPassword}
                      onChange={handleConPassword}
                      required
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => setShowConPassword(!showConPassword)}
                    >
                      <FontAwesomeIcon icon={showConPassword ? faEyeSlash : faEye} />
                    </button>
                  </div>
                  <div className="text-danger">{confirmError}</div>
                </div>
              </div>
            </div>
            <div className="col-12 text-center">
              <button type="submit" className="btn btn-warning btn-lg ms-2">
                Submit
              </button>
            </div>
          </form>
        </section>
      </div>
    </>
  );
}

export default Resetpassword;
