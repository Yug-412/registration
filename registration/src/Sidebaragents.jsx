import React, { useState } from "react";
import { SupportAgent, Dashboard, RecentActors, AssignmentTurnedIn, ThumbDownAlt, AssignmentInd } from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";
import "./sidebaragents.css";

export default function SidebarAgents() {
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Function to toggle dropdown when clicking on the "Referral" menu item
  const handleReferralClick = () => {
    toggleDropdown();
  };

  return (
    <div className="sidebaragents">
      <div className="sidebaragentsWrapper">
        <div className="sidebaragentsMenu">
          <h3 className="sidebaragentsTitle">
            <Dashboard
              style={{ color: "#00254a" }}
              className="sidebaragentsLink"
            />
            <Link
              style={{ color: "#00254a" }}
              to="/agentdash"
              className="sidebaragentsLink"
            >
              Dashboard
            </Link>
          </h3>
          <ul className="sidebaragentsList">
            <li style={{marginBottom:'3px' }} className="sidebaragentsListItem ">
              <Link
                style={{ color: "white" }}
                to="/product"
                className="sidebaragentsLink"
              >
                <SupportAgent
                  style={{ color: "white" }}
                  className="sidebaragentsIcon"
                />
                Product
              </Link>
            </li>
            <li className="sidebaragentsListItem">
              <div className="sidebaragentsDropdown" onClick={handleReferralClick}>
                <RecentActors
                  style={{ color: "white" }}
                  className="sidebaragentsIcon"
                />
                Referral
                {dropdownOpen ? (
                  <span style={{ marginLeft: "6px" }}>&#9650;</span>
                ) : (
                  <span style={{ marginLeft: "6px" }}>&#9660;</span>
                )}

                {dropdownOpen && (
                  <ul className="sidebaragentsDropdownMenu">
                    <li>
                      <Link
                        style={{ color: "white" }}
                        to="/referral/assign"
                        className={
                          location.pathname === "/referral/assign"
                            ? "sidebaragentsLink active"
                            : "sidebaragentsLink"
                        }
                      >
                        <h6 style={{ marginLeft: "4px",marginBottom:'5px',marginTop:'15px' }}><AssignmentInd/>Assign Referral</h6>
                      </Link>
                    </li>
                    <li>
                      <Link
                        style={{ color: "white" }}
                        to="/referral/complete"
                        className={
                          location.pathname === "/referral/complete"
                            ? "sidebaragentsLink active"
                            : "sidebaragentsLink"
                        }
                      >
                        <h6 style={{ marginLeft: "4px",marginBottom:'5px' }}><AssignmentTurnedIn/>Complete Referral</h6>
                      </Link>
                    </li>
                    <li>
                      <Link
                        style={{ color: "white" }}
                        to="/referral/reject"
                        className={
                          location.pathname === "/referral/reject"
                            ? "sidebaragentsLink active"
                            : "sidebaragentsLink"
                        }
                      >
                        <h6 style={{ marginLeft: "4px" }}><ThumbDownAlt/> Reject Referral</h6>
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
