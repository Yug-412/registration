import React, { useState } from "react";
import "./sidebar.css";
import { SupportAgent, Dashboard, RecentActors, AssignmentInd, AssignmentTurnedIn, ThumbDownAlt } from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";



export default function Sidebar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation(); // Use the useLocation hook to get the location object
 
 
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  
  const handleReferralClick = () => {
    toggleDropdown();
  };
  
  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">
            <Dashboard className="sidebarIcon"style={{ color: "#00254a" }} />
            <Link style={{ color: "#00254a" }} to="/home" className="sidebaragentsLink">Dashboard</Link>
          </h3>
          <ul className="sidebarList">
            <li className="sidebarListItem ">
              
                <SupportAgent className="sidebarIcon" />
                <Link style={{ color: "white" }} to="/agent" className="sidebarLink">
                Agent
              </Link>
            </li>
            <li className="sidebarListItem"onClick={handleReferralClick}>
              <RecentActors className="sidebarIcon" />
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
                      to="/refral/new"
                      className={location.pathname === "/referral/new" ? "sidebaragentsLink active" : "sidebaragentsLink"}
                    >
                      <h6 style={{ marginLeft: "4px", marginBottom: '5px', marginTop: '15px' }}><AssignmentInd />New Referral</h6>
                    </Link>
                  </li>
                  <li>
                    <Link
                      style={{ color: "white" }}
                      to="/refral/assign"
                      className={location.pathname === "/referral/assign" ? "sidebaragentsLink active" : "sidebaragentsLink"}
                    >
                      <h6 style={{ marginLeft: "4px", marginBottom: '5px', marginTop: '15px' }}><AssignmentInd />Assign Referral</h6>
                    </Link>
                  </li>
                  <li>
                    <Link
                      style={{ color: "white" }}
                      to="/refral/complete"
                      className={location.pathname === "/referral/complete" ? "sidebaragentsLink active" : "sidebaragentsLink"}
                    >
                      <h6 style={{ marginLeft: "4px", marginBottom: '5px' }}><AssignmentTurnedIn />Complete Referral</h6>
                    </Link>
                  </li>
                  <li>
                    <Link
                      style={{ color: "white" }}
                      to="/refral/reject"
                      className={location.pathname === "/referral/reject" ? "sidebaragentsLink active" : "sidebaragentsLink"}
                    >
                      <h6 style={{ marginLeft: "4px" }}><ThumbDownAlt /> Reject Referral</h6>
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
