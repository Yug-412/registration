import React, { useState, useEffect } from "react";
import Sidebar from "./sidebar/Sidebar";
import Topbar from "./topbar/Topbar";
import { Dropdown, DropdownButton } from "react-bootstrap";

export default function AdminReject() {
  const [menustatus, setmenustatus] = useState(false);
  const [referral, setReferral] = useState([]);

  useEffect(() => {
    // Function to fetch referral data with status "Rejected" from the database
    const fetchReferralData = async () => {
      try {
        // Make API call to fetch referral data with status "Rejected"
        const response = await fetch(
          "http://localhost:8000/referral?status=Rejected"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch referral data");
        }
        const data = await response.json();
        // Update state with fetched referral data
        setReferral(data);
      } catch (error) {
        console.error("Error fetching referral data:", error);
      }
    };

    // Call the fetchReferralData function when the component mounts
    fetchReferralData();
  }, []); // Empty dependency array to ensure useEffect runs only once on component mount

  return (
    <div>
      <Topbar setmenustatus={setmenustatus} />
      <div className="sidecontainer">
        <Sidebar menustatus={menustatus} />
        <div className="options">
          <div style={{ marginLeft: "50px" }}>
            <div className="col-lg-10">
              <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
                Referral
              </h1>
              <div className="table-responsive">
                <table className="table table-bordered table-striped">
                  <thead className="bg-primary text-white">
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
                          {ref.status === "Rejected" ? (
                            "N/A"
                          ) : (
                            <DropdownButton
                              id={`dropdown-${ref.id}`}
                              title="Action"
                            >
                              <Dropdown.Item>View Details</Dropdown.Item>
                            </DropdownButton>
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
    </div>
  );
}
