// Update the Home component to retrieve email from session storage

import Topbar from "./topbar/Topbar";
import Sidebar from "./sidebar/Sidebar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";
import { AccountCircle } from "@mui/icons-material";

const Home = () => {
  const navigate = useNavigate();
  const [menustatus, setmenustatus] = useState(false);
  const [registeredAgentCount, setRegisteredAgentCount] = useState(0);
  const [activeAgentCount, setActiveAgentCount] = useState(0);
  const [deactivatedAgentCount, setDeactivatedAgentCount] = useState(0);
  const [totalAgentCount, setTotalAgentCount] = useState(0);
  const [newReferralCount, setNewReferralCount] = useState(0);
  const [assignedCount, setAssignedCount] = useState(0);
  const [completeCount, setCompleteCount] = useState(0);
  const [rejectCount, setRejectCount] = useState(0);

  useEffect(() => {
    const email = sessionStorage.getItem("email");
    if (!email) {
      navigate("/login");
    }
  }, []);
  useEffect(() => {
    fetchRegisteredAgentCount();
    fetchActiveAgentCount();
    fetchDeactivatedAgentCount();
    fetchTotalAgentCount();
    fetchNewReferralCount();
    fetchAssignedCount();
    fetchCompleteCount();
    fetchRejectCount ();
  }, []);
  const fetchTotalAgentCount = async () => {
    try {
      const response = await fetch('http://localhost:8000/user?role=Agent');
      if (!response.ok) {
        throw new Error('Failed to fetch total agent count');
      }
      const data = await response.json();
      setTotalAgentCount(data.length);
    } catch (error) {
      console.error('Error fetching total agent count:', error);
    }
  };
  const fetchRegisteredAgentCount = async () => {
    try {
      const response = await fetch('http://localhost:8000/user?role=Agent&status=Register');
      if (!response.ok) {
        throw new Error('Failed to fetch registered agent count');
      }
      const data = await response.json();
      setRegisteredAgentCount(data.length);
    } catch (error) {
      console.error('Error fetching registered agent count:', error);
    }
  };
  const fetchActiveAgentCount = async () => {
    try {
      const response = await fetch('http://localhost:8000/user?role=Agent&status=Active');
      if (!response.ok) {
        throw new Error('Failed to fetch active agent count');
      }
      const data = await response.json();
      setActiveAgentCount(data.length);
    } catch (error) {
      console.error('Error fetching active agent count:', error);
    }
  };
  const fetchDeactivatedAgentCount = async () => {
    try {
      const response = await fetch('http://localhost:8000/user?role=Agent&status=Deactive');
      if (!response.ok) {
        throw new Error('Failed to fetch deactivated agent count');
      }
      const data = await response.json();
      setDeactivatedAgentCount(data.length);
    } catch (error) {
      console.error('Error fetching deactivated agent count:', error);
    }
  };
  const fetchNewReferralCount = async () => {
    try {
      const response = await fetch('http://localhost:8000/referral?status=New');
      if (!response.ok) {
        throw new Error('Failed to fetch new referral count');
      }
      const data = await response.json();
      setNewReferralCount(data.length);
    } catch (error) {
      console.error('Error fetching new referral count:', error);
    }
  };
  const fetchAssignedCount = async () => {
    try {
      const response = await fetch('http://localhost:8000/referral?status=Inprocess');
      if (!response.ok) {
        throw new Error('Failed to fetch assigned count');
      }
      const data = await response.json();
      setAssignedCount(data.length);
    } catch (error) {
      console.error('Error fetching assigned count:', error);
    }
  };

  const fetchCompleteCount = async () => {
    try {
      const response = await fetch('http://localhost:8000/referral?status=Complete');
      if (!response.ok) {
        throw new Error('Failed to fetch complete count');
      }
      const data = await response.json();
      setCompleteCount(data.length);
    } catch (error) {
      console.error('Error fetching complete count:', error);
    }
  };

  const fetchRejectCount = async () => {
    try {
      const response = await fetch('http://localhost:8000/referral?status=Rejected');
      if (!response.ok) {
        throw new Error('Failed to fetch reject count');
      }
      const data = await response.json();
      setRejectCount(data.length);
    } catch (error) {
      console.error('Error fetching reject count:', error);
    }
  };

  return (
    <div>
      <Topbar setmenustatus={setmenustatus}/>
      <div className="sidecotainer">
        <Sidebar menustatus={menustatus}/>
        <div className="others">
          <div style={{width:'1035px'}} className="container">
            <div
              className="row"
              style={{ paddingLeft: "40px", paddingRight: "40px" }}
            >
              <h2 style={{ marginTop: "20px" }}>Admin</h2>
              <div
                className="col-lg-3"
                style={{ paddingTop: "40px", PaddingBottom: "40px" }}
              >
                <div className="card mb-3">
                  <div
                    style={{ backgroundColor: "#cce2f5" }}
                    className="card-body shadow"
                  >
                    <div className="d-flex flex-between-center mb-3">
                      <div className="d-flex align-items-center">
                        <div className="icon-item icon-item-sm bg-primary shadow-none me-2 bg-primary-subtle">
                          <AccountCircle className="svg-inline--fa fa-phone fa-w-16 fs-11 text-primary" />{" "}
                        </div>
                        <h6 className="mb-0">
                          <b>Total Agents</b>
                        </h6>
                      </div>
                    </div>
                    <div className="card-highlight">
                      <h1 className="card-number">{totalAgentCount}</h1>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="col-lg-3"
                style={{ paddingTop: "40px", PaddingBottom: "40px" }}
              >
                <div className="card mb-3">
                  <div
                    style={{ backgroundColor: "#cce2f5" }}
                    className="card-body shadow"
                  >
                    <div className="d-flex flex-between-center mb-3">
                      <div className="d-flex align-items-center">
                        <div className="icon-item icon-item-sm bg-primary shadow-none me-2 bg-primary-subtle">
                          <AccountCircle className="svg-inline--fa fa-phone fa-w-16 fs-11 text-primary" />{" "}
                        </div>
                        <h6 className="mb-0">
                          <b>Register</b>{" "}
                        </h6>
                      </div>
                    </div>
                    <div className="card-highlight">
                      <h1 className="card-number">{registeredAgentCount}</h1>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="col-lg-3"
                style={{ paddingTop: "40px", PaddingBottom: "40px" }}
              >
                <div className="card mb-3">
                  <div
                    style={{ backgroundColor: "#cce2f5" }}
                    className="card-body shadow"
                  >
                    <div className="d-flex flex-between-center mb-3">
                      <div className="d-flex align-items-center">
                        <div className="icon-item icon-item-sm bg-primary shadow-none me-2 bg-primary-subtle">
                          <AccountCircle className="svg-inline--fa fa-phone fa-w-16 fs-11 text-primary" />{" "}
                        </div>
                        <h6 className="mb-0">
                          <b>Active </b>
                        </h6>
                      </div>
                    </div>
                    <div className="card-highlight">
                      <h1 className="card-number">{activeAgentCount}</h1>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="col-lg-3"
                style={{ paddingTop: "40px", paddingBottom: "40px" }}
              >
                <div className="card mb-3">
                  <div
                    style={{ backgroundColor: "#cce2f5" }}
                    className="card-body shadow"
                  >
                    <div className="d-flex flex-between-center mb-3">
                      <div className="d-flex align-items-center">
                        <div className="icon-item icon-item-sm bg-primary shadow-none me-2 bg-primary-subtle">
                          <AccountCircle className="svg-inline--fa fa-phone fa-w-16 fs-11 text-primary" />
                        </div>
                        <h6 className="mb-0">
                          <b>Dective</b>{" "}
                        </h6>
                      </div>
                    </div>
                    <div className="card-highlight">
                      <h1 className="card-number">{deactivatedAgentCount}</h1>
                    </div>
                  </div>
                </div>
              </div>
<div>
  <h2 >Referral</h2>
</div>
              <div
                className="col-lg-3"
                style={{ paddingTop: "40px", PaddingBottom: "40px" }}
              >
                <div className="card mb-3">
                  <div
                    style={{ backgroundColor: "#cce2f5" }}
                    className="card-body shadow"
                  >
                    <div className="d-flex flex-between-center mb-3">
                      <div className="d-flex align-items-center">
                        <div className="icon-item icon-item-sm bg-primary shadow-none me-2 bg-primary-subtle">
                          <AccountCircle className="svg-inline--fa fa-phone fa-w-16 fs-11 text-primary" />{" "}
                        </div>
                        <h6 className="mb-0">
                          <b>New Referral </b>
                        </h6>
                      </div>
                    </div>
                    <div className="card-highlight">
                      <h1 className="card-number">{newReferralCount}</h1>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="col-lg-3"
                style={{ paddingTop: "40px", PaddingBottom: "40px" }}
              >
                <div className="card mb-3">
                  <div
                    style={{ backgroundColor: "#cce2f5" }}
                    className="card-body shadow"
                  >
                    <div className="d-flex flex-between-center mb-3">
                      <div className="d-flex align-items-center">
                        <div className="icon-item icon-item-sm bg-primary shadow-none me-2 bg-primary-subtle">
                          <AccountCircle className="svg-inline--fa fa-phone fa-w-16 fs-11 text-primary" />{" "}
                        </div>
                        <h6 className="mb-0">
                          <b>Assign </b>
                        </h6>
                      </div>
                    </div>
                    <div className="card-highlight">
                      <h1 className="card-number">{assignedCount}</h1>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="col-lg-3"
                style={{ paddingTop: "40px", PaddingBottom: "40px" }}
              >
                <div className="card mb-3">
                  <div
                    style={{ backgroundColor: "#cce2f5" }}
                    className="card-body shadow"
                  >
                    <div className="d-flex flex-between-center mb-3">
                      <div className="d-flex align-items-center">
                        <div className="icon-item icon-item-sm bg-primary shadow-none me-2 bg-primary-subtle">
                          <AccountCircle className="svg-inline--fa fa-phone fa-w-16 fs-11 text-primary" />{" "}
                        </div>
                        <h6 className="mb-0">
                          <b>Complete </b>
                        </h6>
                      </div>
                    </div>
                    <div className="card-highlight">
                      <h1 className="card-number">{completeCount}</h1>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="col-lg-3"
                style={{ paddingTop: "40px", PaddingBottom: "40px" }}
              >
                <div className="card mb-3">
                  <div
                    style={{ backgroundColor: "#cce2f5" }}
                    className="card-body shadow"
                  >
                    <div className="d-flex flex-between-center mb-3">
                      <div className="d-flex align-items-center">
                        <div className="icon-item icon-item-sm bg-primary shadow-none me-2 bg-primary-subtle">
                          <AccountCircle className="svg-inline--fa fa-phone fa-w-16 fs-11 text-primary" />{" "}
                        </div>
                        <h6 className="mb-0">
                          <b>Reject</b>
                        </h6>
                      </div>
                    </div>
                    <div className="card-highlight">
                      <h1 className="card-number">{rejectCount}</h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
