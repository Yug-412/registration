import React, { useState, useRef, useEffect } from "react";
import {
  Dehaze,
  SupervisorAccount,
  Logout,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import {  useNavigate } from "react-router-dom";
import { useHistory } from 'react-router-dom';
import { toast } from "react-toastify";
import {
  FormControl,
  InputLabel,
  InputAdornment,
  IconButton,
  Button,
  Input,
  Box,
} from "@mui/material";

import { Container, Modal } from "react-bootstrap";
import { Dropdown } from "react-bootstrap";
import { toBeRequired } from "@testing-library/jest-dom/matchers";

export default function Topbaragents() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    password: false,
    confirmPassword: false,
  });
  const [passwords, setPasswords] = useState({
    newPassword: "",
    password: "",
    confirmPassword: "",
  });
  const usenavigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    usenavigate("/login");
  };

  const handleAgentClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleSubmitPasswordChange = async () => {
    try {
      const agentId = sessionStorage.getItem("id");
      if (!agentId) {
        toast.error("Agent ID not found");
        return;
      }
      if (!passwords.password || !passwords.confirmPassword) {
        toast.error("Please fill in both new-password and confirm password fields");
        return;
      }
      if (passwords.password === passwords.newPassword) {
        toast.error("New password must be different from the old password");
        return;
      }
      if (passwords.password !== passwords.confirmPassword) {
        toast.error("Password and Confirm Password don't match");
        return;
      }
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
      if (!passwordRegex.test(passwords.password)) {
        toast.error("Password must be 8 characters long and contain at least one letter, one number, and one symbol");
        return;
      }
  
      const agentData = await fetchAgentDataFromDatabase(agentId);
      const currentPassword = agentData.password;
  
      if (passwords.newPassword !== currentPassword) {
        toast.error("Old password must be different from the current password");
        return;
      }
  
      if (passwords.newPassword !== agentData.password) {
        toast.error("Please enter a valid password");
        return;
      }
  
      const response = await fetch(`http://localhost:8000/user/${agentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: passwords.password }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update password");
      }
  
      toast.success("Password updated successfully");
      setShowModal(false);
    } catch (error) {
      toast.error("Failed to update password");
    }
  };
  
  
  

  const handleClickShowPassword = (field) => () => {
    setShowPassword({ ...showPassword, [field]: !showPassword[field] });
  };

  const fetchAgentDataFromDatabase = async (agentId) => {
    try {
      const response = await fetch(`http://localhost:8000/user/${agentId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch agent data from the database");
      }
      const agentData = await response.json();

      if (!agentData.id) {
        throw new Error("Agent ID not found in the database");
      }

      return agentData;
    } catch (error) {
      throw new Error("Error fetching agent data: " + error.message);
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const navigate = useNavigate();

    const handleProfile = () => {
      navigate("/agentprofile");
    };
  
  const handleClickChangePassword = () => {
      // Reset passwords state
  setPasswords({
    newPassword: "",
    password: "",
    confirmPassword: "",});
    setShowModal(true);
  };

  return (
    <div className="topbar">
      <div className="topbarWrapper">
        <div className="topbarLeft">
          <span className="logo">
            <Dehaze />
            ocean
          </span>
        </div>
        <div style={{ marginLeft: "75%" }} onClick={handleLogout}>
          <Logout />
          logout
        </div>
        <div className="topbarRight">
          <div className="topbarIcons" onClick={handleAgentClick}>
            Agent
            <SupervisorAccount />
          </div>
          <Dropdown
            show={showDropdown}
            onClose={() => setShowDropdown(false)}
            ref={dropdownRef}
            style={{
              marginTop: "10px",
              backgroundColor: "grey",
              position: "absolute",
              right: "auto",
              left: "87%",
            }}
            align="start"
          >
            <Dropdown.Menu style={{ backgroundColor: "grey" }}>
              <Dropdown.Item onClick={handleProfile}>
                <b>Profile</b>
              </Dropdown.Item>
              <Dropdown.Item onClick={handleClickChangePassword}>
                <b>Change Password</b>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Box
          sx={{
            position: "absolute",
            marginTop: "150px",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "#cce2f5",
            boxShadow: 24,
            p: 4,
            borderRadius: "10px",
          }}
        >
          <h2>Change Password</h2>
          <FormControl variant="standard" fullWidth>
            <InputLabel htmlFor="newPassword"> Old Password</InputLabel>
            <Input
              id="newPassword"
              type={showPassword.newPassword ? "text" : "password"}
              value={passwords.newPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, newPassword: e.target.value })
              }
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword("newPassword")}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    {showPassword.newPassword ? (
                      <VisibilityOff />
                    ) : (
                      <Visibility />
                    )}
                  </IconButton>
                </InputAdornment>
              }
              className="password-input"
            />
          </FormControl>
          <FormControl variant="standard" fullWidth>
            <InputLabel htmlFor="password"> New Password</InputLabel>
            <Input
              id="password"
              type={showPassword.password ? "text" : "password"}
              value={passwords.password}
              required
              onChange={(e) =>
                setPasswords({ ...passwords, password: e.target.value })
              
              }
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword("password")}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    {showPassword.password ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              className="password-input"
            />
          </FormControl>
          <FormControl variant="standard" fullWidth>
            <InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>
            <Input
              id="confirmPassword"
              type={showPassword.confirmPassword ? "text" : "password"}
              value={passwords.confirmPassword}
              required
              onChange={(e) =>
                setPasswords({ ...passwords, confirmPassword: e.target.value })
              }
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword("confirmPassword")}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    {showPassword.confirmPassword ? (
                      <VisibilityOff />
                    ) : (
                      <Visibility />
                    )}
                  </IconButton>
                </InputAdornment>
              }
              className="password-input"
            />
          </FormControl>
          <Container className="text-center">
            <Button
              className="mt-2 text-center"
              variant="contained"
              color="primary"
              onClick={handleSubmitPasswordChange}
            >
              Submit
            </Button>
            
          </Container>
        </Box>
      </Modal>
    </div>
  );
}
