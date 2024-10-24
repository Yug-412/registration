import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const navigate = useNavigate(); // Import useNavigate
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const OTP = Math.floor(Math.random() * 9000 + 1000);

  const handleSubmit = (e) => {
    e.preventDefault();

    // const crole = role.toLowerCase();

    axios.get(`http://localhost:8000/user?email=${email}&role=${role}`)
      .then((res) => {
        const resp = res.data;
        if (resp.length === 0) {
          toast.error("Email or role not found");
        } else {
          const user = resp[0];
          const userId = user.id;
          const userEmail = user.email;
          const userRole = user.role; // Assuming 'role' is a field in the user object
          const userPassword = user.password;
          
          if (userEmail === email && userRole === role) {
            // Match found, proceed
            sessionStorage.setItem("id", userId);
            sessionStorage.setItem("email", userEmail);
            sessionStorage.setItem("password", userPassword);
            sessionStorage.setItem("otp", OTP);

            axios.post("http://localhost:5000/send_recovery_email", {
              OTP: OTP,
              recipient_email: userEmail,
            });

            toast.success("OTP Sent!");
            navigate("/otpinputs");
          } else {
            // Email and role do not match
            toast.error("Email or role do not match");
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
};

  return (
    <div style={{ display: "flex", marginTop: "90px", justifyContent: "center", alignItems: "center" }}>
      <div style={{ width: "500px", backgroundColor: "#a7daef", borderRadius: "5px", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}>
        <h2 style={{ textAlign: "center", color: "white", backgroundColor: "#141452", padding: "10px", borderRadius: "5px" }}>Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginLeft: "10px", marginRight: "10px" }} className="form-group">
            <label style={{ marginLeft: "5px" }}><b>Email<span className="errmsg">*</span></b></label>
            <input
              type="text"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div style={{ marginLeft: "10px", marginRight: "10px" }} className="form-group">
            <label style={{ marginLeft: "5px" }}><b>Role<span className="errmsg">*</span></b></label>
            <select
              className="form-control"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="">Select role</option>
              <option value="Admin">Admin</option>
              <option value="Agent">Agent</option>
            </select>
          </div>
          <div className="form-group text-center">
            <button type="submit" style={{ marginTop: "10px", backgroundColor: '#141452' }} className="btn btn-primary btn-block">Send OTP</button>
          </div>
          <div style={{ marginTop: "5px", marginBottom: "10px", textAlign: "center" }}>
            <h6 style={{ textSizeAdjust: "unset" }}><b>Remembered your password?</b> <Link style={{ color: "blue" }} to="/login"><b>Login</b></Link></h6>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
