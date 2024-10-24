import React from 'react'
import "./topbar.css"
import {SupervisorAccount,Logout,Dehaze} from '@mui/icons-material';
import {  useNavigate } from "react-router-dom";

export default function Topbar() {
  const usenavigate = useNavigate()
  const handleLogout = () => {
    usenavigate("/login");
  };
  return (
    <div className='topbar'>
      <div className='topbarWrapper'>
<div className='topbarLeft'>
  <span className='logo'>
    <Dehaze/>
    ocean
    </span>
</div>
<div style={{ marginLeft: "75%" }} onClick={handleLogout}>
          <Logout />
          logout
        </div>
<div className='topbarRigjt'>
  <div className="topbarIcons">
   Admin
  <SupervisorAccount/>
    
  </div>
</div>

      </div>
    </div>
  )
} 
