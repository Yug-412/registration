import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Dropdown, DropdownButton } from "react-bootstrap";
import Topbaragents from "../Topbaragents";
import Sidebaragents from "../Sidebaragents";
import "bootstrap/dist/css/bootstrap.min.css";
import "./agent.css";

export default function Refrralagents() {
  const usenavigate = useNavigate();
  useEffect(() => {
    let email = sessionStorage.getItem("email");
    if (email === "" || email === null) {
      usenavigate("/login");
    }
  }, []);

  const [menustatus, setmenustatus] = useState(false);
  const [referral, setReferral] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedReferralId, setSelectedReferralId] = useState(null);
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    fetchReferral();
  }, []);

  const fetchReferral = () => {
    let agid = sessionStorage.getItem("id");
    fetch(`http://localhost:8000/referral?agentid=${agid}`)
      .then((response) => response.json())
      .then((data) => setReferral(data))
      .catch((error) => console.error("Error fetching referral:", error));
  };

  const handleStatusUpdate = (id, newStatus) => {
    const confirmed = window.confirm(
      `Are you sure you want to ${newStatus.toLowerCase()} this user?`
    );
    if (!confirmed) return;
    fetch(`http://localhost:8000/referral/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update status");
        }
        return response.json();
      })
      .then((updatedReferral) => {
        setReferral(
          referral.map((u) =>
            u.id === updatedReferral.id
              ? { ...u, status: updatedReferral.status }
              : u
          )
        );
        setShowModal(false);
      })
      .catch((error) => console.error("Error updating status:", error));
  };

 

  const handleAgentSelection = (agentId) => {
    const selectedAgent = agents.find((agent) => agent.id === agentId);
    const confirmed = window.confirm(
      `Are you sure you want to assign this referral to ${selectedAgent.name}?`
    );
    if (!confirmed) return;
    const referralId = selectedReferralId;

    fetch(`http://localhost:8000/referral/${referralId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ agentid: agentId, status: "Inprocess" }), // Update the status to Inprocess
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to assign agent");
        }
        return response.json();
      })
      .then((updatedReferral) => {
        setReferral(
          referral.map((u) =>
            u.id === updatedReferral.id
              ? { ...u, agentid: updatedReferral.agentid, status: updatedReferral.status }
              : u
          )
        );
        setShowModal(false);
      })
      .catch((error) => console.error("Error assigning agent:", error));
  };

  return (
    <div>
      <Topbaragents setmenustatus={setmenustatus} />
      <div className="sidecontainer">
        <Sidebaragents menustatus={menustatus} />
        <div className="options">
          <div style={{ marginTop: "50px", marginLeft: "50px" }}>
            <div className="col-lg-10">
              <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
                Referral
              </h1>
              <div  className="table-responsive">
              <table className="table table-bordered table-striped table-custom">

                  <thead className="table">
                    <tr>
                      <th>ID</th>
                      <th>Firstname</th>
                      <th>Last Name</th>
                      <th>Email</th>
                      <th>Contact</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {referral.map((ref) => (
                      <tr key={ref.id}>
                        <td>{ref.id}</td>
                        <td>{ref.firstname}</td>
                        <td>{ref.lastname}</td>
                        <td>{ref.email}</td>
                        <td>{ref.phone}</td>
                        <td>{ref.status}</td>
                        <td>
                          {ref.status !== "Rejected" ? (
                            <DropdownButton
                              id={`dropdown-${ref.id}`}
                              title="Action"
                            >
                              {ref.status === "Inprocess" && (
                                <>
                                  <Dropdown.Item onClick={() => handleStatusUpdate(ref.id,"Complete")}>
                                    Complete
                                  </Dropdown.Item>
                                  <Dropdown.Item
                                    onClick={() =>
                                      handleStatusUpdate(ref.id, "Rejected")
                                    }
                                  >
                                    Reject
                                  </Dropdown.Item>
                                </>
                              )}

                              {ref.status === "Complete" && (
                                <Dropdown.Item
                                  onClick={() =>
                                    handleStatusUpdate(ref.id, "Rejected")
                                  }
                                >
                                  Reject
                                </Dropdown.Item>
                              )}
                            </DropdownButton>
                          ) : (
                            <b>N/A</b>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Assign Agent</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Selected Referral ID: {selectedReferralId}</p>
          <DropdownButton
            id="dropdown-basic-button"
            title="Select Agent"
          >
            {agents.map((agent) => (
              <Dropdown.Item
                key={agent.id}
                onClick={() => handleAgentSelection(agent.id)}
              >
                {agent.name}
              </Dropdown.Item>
            ))}
          </DropdownButton>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
