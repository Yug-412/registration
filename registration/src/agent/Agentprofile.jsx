import React, { useEffect, useState } from "react";
import "../App.css";
import { Modal, Button, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faEnvelope,
  faListCheck,
  faPhone,
  faTimes,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import Topbaragents from "../Topbaragents";
import SidebarAgents from "../Sidebaragents";
import { toHaveStyle } from "@testing-library/jest-dom/matchers";
import {  toast } from "react-toastify";

export default function Agentprofile() {
  const [menustatus, setMenuStatus] = useState(false);
  const [referralCount, setReferralCount] = useState(0);
  const [completeReferralCount, setCompleteReferralCount] = useState(0);
  const [rejectReferralCount, setRejectReferralCount] = useState(0);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const [passwordMismatchError, setPasswordMismatchError] = useState(false);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let id = sessionStorage.getItem("id");
    let email = sessionStorage.getItem("email");
    let role = sessionStorage.getItem("role");
    if (email === "" || email === null || role === "Admin") {
      navigate("/login");
    } else {
      const myagid = sessionStorage.getItem("agentid");
      fetch(`http://localhost:8000/user?id=${id}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.length > 0) {
            const user = data[0];
            setUsers([user]);
          }
        })
        .catch((error) => console.error("Error fetching user details:", error));

      fetch(`http://localhost:8000/referral?agentid=${id}`)
        .then((response) => response.json())
        .then((data) => {
          const completeReferrals = data.filter(
            (referral) => referral.status === "Complete"
          );
          const rejectReferrals = data.filter(
            (referral) => referral.status === "Rejected"
          );
          const inProcessReferrals = data.filter(
            (referral) => referral.status === "Inprocess"
          );
          setCompleteReferralCount(completeReferrals.length);
          setRejectReferralCount(rejectReferrals.length);
          setReferralCount(inProcessReferrals.length);
        })
        .catch((error) => console.error("Error fetching referrals:", error));
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "oldPassword") {
      setOldPassword(value);
    } else if (name === "newPassword") {
      setNewPassword(value);
    } else if (name === "confirmPassword") {
      setConfirmPassword(value);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setPasswordMatchError(false);
    setPasswordMismatchError(false);
  };

  const handleSubmit = () => {
    const user = users[0];
    if (user.password === oldPassword) {
      if (newPassword !== confirmPassword) {
        setPasswordMismatchError(true);
        return;
      } else {
        let id = sessionStorage.getItem("id");
        fetch(`http://localhost:8000/user/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: newPassword,
          }),
        })
          .then((response) => {
            if (response.ok) {
              setPasswordChangeSuccess(true);
              setShowModal(false);
            } else {
              // Handle error response from the server
            }
          })
          .catch((error) => {
            console.error("Error changing password:", error);
          });
      }
    } else {
      setPasswordMatchError(true);
      return;
    }
  };

  const handleUpdateUser = (updatedUserData) => {
    // Update user data in state
    setUsers([updatedUserData]);
  };


  const handleUpdateButtonClick = (user) => {
    // Send updated user data to backend
    const id = sessionStorage.getItem("id");
    fetch(`http://localhost:8000/user/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((response) => {
        if (response.ok) {
          // Handle successful update
          toast.success("Profile updated-- successfully");
          window.location.reload();
        } else {
          // Handle error response from the server
          toast.error("Failed to update user");
        }
      })
      .catch((error) => {
        console.error("Error updating user:", error);
        toast.error("Failed to update user");
      });
  };
 
    const [agentDetails, setAgentDetails] = useState("");
  
    useEffect(() => {
      // Fetch the agent details when the component mounts
      fetchAgentDetails();
    }, []);
  
    const fetchAgentDetails = async () => {
      try {
        // Fetching the agent ID from session storage
        const agentId = sessionStorage.getItem("id");
    
        // Ensure agent ID exists
        if (!agentId) {
          console.error("Agent ID not found in session storage.");
          return;
        }
    
        // Fetching the agent details from the backend using the agent ID
        const response = await fetch(`http://localhost:8000/user?id=${agentId}`);
        const data = await response.json();
    
        // Assuming the response contains an array of agents and you want to display the first agent's details
        if (Array.isArray(data) && data.length > 0) {
          const firstAgent = data[0];
          setAgentDetails({
            name: firstAgent.name,
            phone: firstAgent.phone,
          });
        } else {
          console.error("No agents found in the database.");
        }
      } catch (error) {
        console.error("Error fetching agent details:", error);
      }
    };
    

  return (
    <>
      <div>
        <Topbaragents setmenustatus={setMenuStatus} />
        <div className="sidecontainer">
          <SidebarAgents menustatus={menustatus} />
          <div  className="options">
            <div className="container">
              <div className="row justify-content-center">
                <section>
                  <div className="container py-4">
                    {users.map((user) => (
                      <div key={user.id} className="row">
                        <div className="col-lg-3">
                          <div className="card mb-4">
                            <div className="card-body">
                              <div className=" d-flex justify-content-center text-center align-items-center">
                                <div
                                  className="rounded-circle image-fluid"
                                  style={{
                                    width: "100px",
                                    height: "100px",
                                    background: "skyblue",
                                  }}
                                >
                                  {user.name && user.name && (
                                    <b
                                      style={{
                                        fontSize: "50px",
                                        color: "white",
                                      }}
                                    >{`${user.name.charAt(0)}`}</b>
                                  )}
                                </div>
                              </div>

                              <h5 className="my-3">{agentDetails.name}</h5>
                              <div style={{textAlign:"left",marginLeft:"20px"}}>
                              <p className="text-muted mb-1">
                                <b style={{  color: "black" }}>
                                  <FontAwesomeIcon icon={faPhone} />
                                </b>{" "}
                                {agentDetails.phone}
                              </p>
                              <p className="text-muted mb-1">
                                <b style={{ color: "black" }}>
                                  <FontAwesomeIcon icon={faEnvelope} />
                                </b>{" "}
                                {user.email}
                              </p>
                              <p className="text-muted mb-1">
                                <b style={{ color: "black" }}>
                                  <FontAwesomeIcon icon={faUser} />
                                </b>{" "}
                                {user.role}
                              </p></div>
                            </div>
                          </div>
                          <div className="card mb-4 mb-lg-0">
                            <div className="card-body p-0">
                              <b
                                className="list-group text-primary list-group-flush"
                                style={{
                                  marginLeft: "10px",
                                  padding: "8px",
                                  fontSize: "20px",
                                }}
                              >
                                Referrals
                              </b>
                              <ul className="list-group list-group-flush rounded-3">
                                <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                                  <i className="fa-lg">
                                    <span className="badge bg-primary">
                                      {referralCount}
                                    </span>
                                  </i>
                                  <b className="mb-0">
                                    <i className="text-primary">
                                      <FontAwesomeIcon
                                        icon={faListCheck}
                                      ></FontAwesomeIcon>
                                    </i>{" "}
                                    Assigned
                                  </b>
                                </li>

                                <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                                  <i className="fa-lg">
                                    <span className="badge bg-danger ">
                                      {rejectReferralCount}
                                    </span>
                                  </i>
                                  <b className="mb-0">
                                    <i className="text-danger">
                                      <FontAwesomeIcon
                                        icon={faTimes}
                                      ></FontAwesomeIcon>
                                    </i>{" "}
                                    Rejected
                                  </b>
                                </li>

                                <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                                  <i className="fa-lg">
                                    <span className="badge bg-success ">
                                      {completeReferralCount}
                                    </span>
                                  </i>
                                  <b className="mb-0">
                                    <i className="text-success">
                                      <FontAwesomeIcon
                                        icon={faCheck}
                                      ></FontAwesomeIcon>
                                    </i>{" "}
                                    Completed
                                  </b>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div className="col-lg-8">
                          <div className="card mb-4">
                            <div className="card-body">
                              <div className="row">
                                <div className="col-sm-3">
                                  <p className="mb-0"><b>Username</b></p>
                                </div>
                                <div className="col-sm-9">
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={user.username}
                                    onChange={(e) =>
                                      handleUpdateUser({
                                        ...user,
                                        username: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                              </div>
                              <hr />
                              <div className="row">
                                <div className="col-sm-3">
                                  <p className="mb-0"><b>Name</b></p>
                                </div>
                                <div className="col-sm-9">
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={user.name}
                                    onChange={(e) =>
                                      handleUpdateUser({
                                        ...user,
                                        name: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                              </div>

                              <hr />
                              <div className="row">
                                <div className="col-sm-3">
                                  <p className="mb-0"><b>Email</b></p>
                                </div>
                                <div className="col-sm-9">
                                  <input
                                    type="email"
                                    className="form-control"
                                    value={user.email}
                                    disabled 
                                  />
                                </div>
                              </div>
                              <hr />
                            
                              <div className="row">
                                <div className="col-sm-3">
                                  <p className="mb-0"><b>Phone</b></p>
                                </div>
                                <div className="col-sm-9">
                                  <input
                                    type="tel"
                                    className="form-control"
                                    value={user.phone}
                                    onChange={(e) =>
                                      handleUpdateUser({
                                        ...user,
                                        phone: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                              </div>
                              <hr />
                           
                              <div className="row">
                                <div className="col-sm-3">
                                  <p className="mb-0"><b>Address</b></p>
                                </div>
                                <div className="col-sm-9">
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={user.address}
                                    onChange={(e) =>
                                      handleUpdateUser({
                                        ...user,
                                        address: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                              </div>
                              <hr />
                              <Container className="text-center">
                              <div
                                className="row"
                                style={{ textAlign: "right" }}
                              >
                                <div   className="col-sm-7">
                                  <button style={{backgroundColor:'#666f76',color:'white'}}
                                  
                                    className="btn"
                                    onClick={() =>handleUpdateButtonClick(users[0])}
                                  >
                                    <b>Update</b>
                                  </button>
                                </div>
                              </div>
                              </Container>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
