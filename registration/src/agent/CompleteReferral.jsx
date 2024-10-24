import React, { useEffect, useState } from "react";
import Topbaragents from "../Topbaragents";
import Sidebaragents from "../Sidebaragents";
import "./agent.css";
import { Dropdown, DropdownButton } from "react-bootstrap";

export default function CompleteReferral() {
  const [referral, setReferral] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchReferral();
  }, []);

  const fetchReferral = () => {
    let agid = sessionStorage.getItem("id");
    fetch(`http://localhost:8000/referral?agentid=${agid}&&status=Complete`)
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
        // Remove the rejected referral from the state
        if (newStatus === 'Rejected') {
          setReferral(referral.filter(ref => ref.id !== id));
        } else {
          setReferral(
            referral.map((u) =>
              u.id === updatedReferral.id
                ? { ...u, status: updatedReferral.status }
                : u
            )
          );
        }
        setShowModal(false);
      })
      .catch((error) => console.error("Error updating status:", error));
  };
  
  return (
    <div>
      <Topbaragents />
      <div className="sidecontainer">
        <Sidebaragents />
        <div className="complete">
          <div style={{ marginTop: "50px", marginLeft: "50px" }}>
            <div className="col-lg-10">
              <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
                Complete Referral
              </h1>

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
                                  <Dropdown.Item
                                    onClick={() =>
                                      handleStatusUpdate(ref.id, "Complete")
                                    }
                                  >
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
    
  );
}
