import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Visibility, VisibilityOff } from "@mui/icons-material";
const Register = () => {
  const [id, setId] = useState(null);
  const [setCountries, setSelectedCountries] = useState("");
  const [selectedState, setSelectedStates] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const [password, passwordchange] = useState("");
  const [confirmpassword, confirmpasswordchange] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // const[status]=useState("Register")
  const status = "Register";
  const [username, usernamechange] = useState("");
  const [name, namechange] = useState("");

  const [email, emailchange] = useState("");
  const [phone, phonechange] = useState("");
  const [address, addresschange] = useState("");
  const [role, rolechange] = useState("");
  const [gender, genderchange] = useState("male");
  const [country, setCountry] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLastid();
    fetchCountries();
  }, []);

  const fetchLastid = () => {
    fetch("http://localhost:8000/user")
      .then((response) => response.json())
      .then((data) => {
        const lastid = data.length > 0 ? parseInt(data[data.length - 1].id) : 0;
        setId(lastid + 1); // Increment last ID by 1
      })
      .catch((error) => console.error("Error fetching last ID:", error));
  };
  const IsValidate = () => {
    let isproceed = true;
    let errormessage = "plese value";

    if (username === null || username === "") {
      isproceed = false;
      errormessage += " Username";
    }
    if (name === null || name === "") {
      isproceed = false;
      errormessage += " Fullname";
    }
    if (!/[a-zA-Z]/.test(name)) {
      isproceed = false;
      errormessage += " (fullname must alphabetic letter), ";
    }

    if (password === null || password === "") {
      isproceed = false;
      errormessage += " Password";
    }
    if (!/(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password)) {
      isproceed = false;
      errormessage +=
        " ( password must be one capital letter,one numeric and one symbol)";
    }
    if (password.length < 8) {
      isproceed = false;
      errormessage += " (password must be at least 8 characters long), ";
    }
    if (password !== confirmpassword) {
      errormessage += "Passwords do not match";
    }
    if (email === null || email === "") {
      isproceed = false;
      errormessage += " Email";
    }
    if (phone === null || phone === "") {
      isproceed = false;
      errormessage += " Phone";
    }
    if (!/^[0-9]*$/.test(phone)) {
      isproceed = false;
      errormessage += " (contact numeric value)";
    }
    if (role === null || role === "") {
      isproceed = false;
      errormessage += " select role";
    }

    if (!isproceed) {
      toast.warning(errormessage);
    } else {
      if (/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]+$/.test(email)) {
      } else {
        isproceed = false;
        toast.warning("enter the valid email");
      }
    }

    return isproceed;
  };

  const handlePasswordChange = (e) => {
    passwordchange(e.target.value);
  };
  const handleConfirmPasswordChange = (e) => {
    confirmpasswordchange(e.target.value);
  };
  const handlesubmit = (e) => {
    e.preventDefault();
    if (password !== confirmpassword) {
      toast.warning("Passwords do not match");
      return;
    }
    const regObj = {
      id: id.toString(),
      role,
      status,
      username,
      name,
      password,
      confirmpassword,
      email,
      phone,
      address,
      gender,
      country,
      states,
      cities,
    };

    // Check if email already exists in the database
    fetch(`http://localhost:8000/user/?email=${email}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Network response was not ok.");
        }
      })
      .then((data) => {
        if (data.length > 0) {
          toast.error("Email already taken. Please use a different email.");
        } else {
          if (IsValidate()) {
            fetch("http://localhost:8000/user", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify(regObj),
            })
              .then((res) => {
                toast.success("Registration successful.");
                navigate("/login");
              })
              .catch((err) => {
                toast.error("Failed: " + err.message);
              });
          }
        }
      })
      .catch((error) => {
        toast.error("Error checking email availability: " + error.message);
      });
  };
  const fetchCountries = () => {
    fetch("http://localhost:8002/country")
      .then((response) => response.json())
      .then((data) => {
        setCountry(data);
      })
      .catch((error) => console.error("Error fetching countries:", error));
  };

  // Fetch states when selected country changes
  useEffect(() => {
    if (setCountries) {
      fetchStates(setCountries);
    }
  }, [setCountries]);

  const fetchStates = (countryId) => {
    // Change parameter name to countryId
    fetch(`http://localhost:8002/states?country_id=${countryId}`) // Use countryId parameter
      .then((response) => response.json())
      .then((data) => {
        setStates(data);
      })
      .catch((error) => console.error("Error fetching states:", error));
  };

  // Fetch cities when selected state changes
  useEffect(() => {
    if (selectedState) {
      fetchCities(selectedState);
    }
  }, [selectedState]);
  useEffect(() => {
    setSelectedCity(""); // Reset city value to an empty string
  }, [setCountries]);

  const fetchCities = (stateId) => {
    // Change parameter name to stateId
    fetch(`http://localhost:8002/cities?state_id=${stateId}`) // Use stateId parameter
      .then((response) => response.json())
      .then((data) => {
        setCities(data);
      })
      .catch((error) => console.error("Error fetching cities:", error));
  };
  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(
      (prevShowConfirmPassword) => !prevShowConfirmPassword
    );
  };
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Validation and submission logic here
  };

  return (
    <div className="register-container "style={{marginTop: "30px", marginLeft: "0px", marginRight: "170px" }}>
      
        <div style={{ marginRight: "100px" }} className="offset-lg-3 col-lg-8 ">
          <form className="container" onSubmit={handlesubmit}>
            <div style={{ backgroundColor: "#a7daef" }} className="card">
              <div
                style={{
                  color: "white",
                  textAlign: "center",
                  backgroundColor: "#0b0e5c",
                }}
                className="card-header"
              >
                <h1>User Registration</h1>
              </div>
              <div className="card-body">
                <div  className="row">
                  <div className="col-lg-6">
                    <div className="form-group">
                      <label>
                        <b>User name</b> <span className="errmsg">*</span>
                      </label>
                      <input
                        value={username}
                        onChange={(e) => usernamechange(e.target.value)}
                        className="form-control"
                        placeholder="Enter user name"
                      ></input>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="form-group">
                      <label>
                        <b>Full name </b>
                        <span className="errmsg">*</span>
                      </label>
                      <input
                        value={name}
                        onChange={(e) => namechange(e.target.value)}
                        className="form-control"
                        placeholder="Enter full name"
                      ></input>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="form-group">
                      <label>
                        <b>Password </b>
                        <span className="errmsg">*</span>
                      </label>
                      <div className="input-group">
                        <input
                          value={password}
                          onChange={(e) => passwordchange(e.target.value)}
                          type={showPassword ? "text" : "password"}
                          className="form-control"
                          placeholder="Enter password"
                        />
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="form-group">
                      <label>
                        <b>Confirm password</b>{" "}
                        <span className="errmsg">*</span>
                      </label>
                      <div className="input-group">
                        <input
                          value={confirmpassword}
                          onChange={(e) =>
                            confirmpasswordchange(e.target.value)
                          }
                          type={showConfirmPassword ? "text" : "password"}
                          className="form-control"
                          placeholder="Confirm password"
                        />
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={toggleConfirmPasswordVisibility}
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="form-group">
                      <label>
                        <b>Address</b>
                      </label>
                      <textarea
                        value={address}
                        onChange={(e) => addresschange(e.target.value)}
                        className="form-control"
                      ></textarea>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="form-group">
                      <label>
                        <b>Email-id</b> <span className="errmsg">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => emailchange(e.target.value)}
                        className="form-control"
                        placeholder="Enter Email-id "
                      ></input>
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="form-group">
                      <label style={{ marginTop: "16px" }}>
                        <b>Gender </b>
                      </label>
                      <input
                        style={{ marginLeft: "10px" }}
                        type="radio"
                        checked={gender === "male"}
                        onChange={(e) => genderchange(e.target.value)}
                        name="gender"
                        value="male"
                        className="app-check"
                      ></input>
                      <label>
                        <b>Male </b>
                      </label>
                      <input
                        style={{ marginLeft: "10px" }}
                        type="radio"
                        checked={gender === "female"}
                        onChange={(e) => genderchange(e.target.value)}
                        name="gender"
                        value="female"
                        className="app-check"
                      ></input>
                      <label>
                        <b>FeMale</b>{" "}
                      </label>
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="form-group">
                      <label>
                        <b>Contact</b> <span className="errmsg">*</span>
                      </label>
                      <input
                        value={phone}
                        onChange={(e) => phonechange(e.target.value)}
                        className="form-control"
                        placeholder="Enter contact"
                      ></input>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="form-group">
                      <label>
                        <b>Country</b> <span className="errmsg">*</span>
                      </label>
                      <select
                        value={setCountries}
                        onChange={(e) => setSelectedCountries(e.target.value)}
                        className="form-control"
                      >
                        <option value="">Select country</option>
                        {country.map((setCountries) => (
                          <option key={setCountries.id} value={setCountries.id}>
                            {setCountries.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="form-group">
                      <label>
                        <b>State</b> <span className="errmsg">*</span>
                      </label>
                      <select
                        value={selectedState}
                        onChange={(e) => setSelectedStates(e.target.value)}
                        className="form-control"
                      >
                        <option value="">Select States</option>
                        {states.map((setSelectedStates) => (
                          <option
                            key={setSelectedStates.id}
                            value={setSelectedStates.id}
                          >
                            {setSelectedStates.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="form-group">
                      <label>
                        <b>City</b> <span className="errmsg">*</span>
                      </label>
                      <select
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        className="form-control"
                      >
                        <option value="">Select city</option>
                        {cities.map((selectedCity) => (
                          <option key={selectedCity.id} value={selectedCity.id}>
                            {selectedCity.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>
                        <b>Role </b>
                        <span className="errmsg">*</span>
                      </label>
                      <select
                        required
                        value={role}
                        onChange={(e) => rolechange(e.target.value)}
                        className="form-control"
                      >
                        <option value="Select role">Select role</option>
                        <option value="Admin">Admin</option>
                        <option value="Agent">Agent</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ textAlign: "center" }} className="card-footer">
                <button
                  style={{ backgroundColor: "darkblue" }}
                  className="btn btn-primary"
                >
                  Register
                </button>
                <div>
                  <h6 style={{ textSizeAdjust: "unset" }}>
                    <b>Already Have An Account? </b>
                    <Link
                      style={{
                        marginTop: "5px",
                        marginBottom: "10px",
                        textAlign: "center",
                        color: "blue",
                      }}
                      to="/login"
                    >
                      login
                    </Link>
                  </h6>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
   
  );
};
export default Register;
