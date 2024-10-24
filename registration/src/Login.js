import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to track password visibility
  const [redirected, setRedirected] = useState(false); // State to track redirection
  const navigate = useNavigate();

  useEffect(() => {
    sessionStorage.clear();
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const proceedLogin = (e) => {
    e.preventDefault();

    if (validate()) {
      fetch(`http://localhost:8000/user?email=${email}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch user");
          }
          return res.json();
        })
        .then((users) => {
          if (users.length === 0) {
            toast.error("Invalid email");
          } else {
            const user = users[0];
            if (user.password === password) {
              if (user.role === role) {
                sessionStorage.setItem("id", user.id);
                sessionStorage.setItem("role", role);
                sessionStorage.setItem("email", email); // Set email in session storage
                navigate(user.role === "Admin" ? "/home" : "/agentdash");
                toast.success("Login successful");
              } else {
                toast.error("Invalid role for this login");
              }
            } else {
              toast.error("Invalid password");
            }
          }
        })
        .catch((err) => {
          toast.error("Login failed: " + err.message);
        });
    }
  };

  const validate = () => {
    if (!email || !password || !role) {
      toast.warning("Please fill in all fields");
      return false;
    }
    return true;
  };

  // Check if redirection has occurred before rendering
  if (redirected) {
    return null; // Don't render anything if redirection has occurred
  }

  return (
    <div style={{ display: "flex",marginTop:"90px", justifyContent: "center", alignItems: "center" }}>
      <div style={{ width: "500px", backgroundColor: "#a7daef", borderRadius: "5px", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}>
        <h2 style={{ textAlign: "center", color: "white", backgroundColor: "#141452", padding: "10px", borderRadius: "5px" }}>User Login</h2>
        <form onSubmit={proceedLogin}>
          <div style={{marginLeft:"10px",marginRight:"10px"}} className="form">
            <label style={{marginLeft:"5px"}}><b>Email<span className="errmsg">*</span></b></label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div style={{marginLeft:"10px",marginRight:"10px"}}className="form">
            <label style={{marginLeft:"5px"}}><b>Password<span className="errmsg">*</span></b></label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className="btn btn-outline-secondary" type="button" onClick={togglePasswordVisibility}>
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </div>
          <div style={{ marginLeft:"14px", marginTop:"0px", marginBottom:"2px", textAlign: "left" }}>
         <Link style={{color:"#00255a"}} to="/forgotpass">Forgot password?</Link>
       </div>
          <div style={{marginLeft:"5px",marginRight:"10px"}}className="form-group">
            <label  style={{marginLeft:"10px"}}><b>Role<span className="errmsg">*</span></b></label>
            <select
              className="form-control"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value=""><b>Select role</b></option>
              <option value="Admin"><b>Admin</b></option>
              <option value="Agent"><b>Agent</b></option>
            </select>
          </div>
          <div className="form-group text-center">
            <button type="submit" style={{  marginTop:"10px",backgroundColor: '#141452' }} className="btn btn-primary btn-block">Login</button>
          </div>
          <div style={{ marginTop:"5px", marginBottom:"10px", textAlign: "center" }}>
          <h6 style={{textSizeAdjust:"unset"}}><b>Don't Have An Account? </b>
            <Link style={{color:"blue"}} to="/"><b>Registration</b></Link></h6>
          </div>
        
        </form>
      </div>
    </div>
  );
};

export default Login;
