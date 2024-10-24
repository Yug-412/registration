import React, { useEffect, useState } from "react";
import "./agent.css";
import Topbaragents from "../Topbaragents";
import Sidebaragents from "../Sidebaragents";
import { useNavigate } from "react-router-dom";
import { AccountCircle } from "@mui/icons-material";
export default function Agentsdash() {
  const usenavigate = useNavigate();
  useEffect(() => {
    let email = sessionStorage.getItem("email");
    if (email === "" || email === null) {
      usenavigate("/login");
    }
  }, []);
  const [menustatus, setmenustatus] = useState(false);
  const [products, setproducts] = useState([]);
  const [assignReferralCount, setAssignReferralCount] = useState(0);
  const [completeReferralCount, setCompleteReferralCount] = useState(0);

  useEffect(() => {
    fetchproducts();
    fetchReferralCounts();
  }, []);

  const fetchproducts = () => {
    fetch("http://localhost:8001/product")
      .then((response) => response.json())
      .then((data) => setproducts(data))
      .catch((error) => console.error("Error fetching Products:", error));
  };
  const fetchReferralCounts = () => {
    let agentId = sessionStorage.getItem("id");
  
    Promise.all([
      fetch(`http://localhost:8000/referral?agentid=${agentId}&status=Inprocess`),
      fetch(`http://localhost:8000/referral?agentid=${agentId}&status=Complete`)
      
    ])
    .then(([assignedResponse, completedResponse]) => Promise.all([assignedResponse.json(), completedResponse.json()]))
    .then(([assignedReferrals, completedReferrals]) => {
      setAssignReferralCount(assignedReferrals.length);
      setCompleteReferralCount(completedReferrals.length);
    })
    .catch((error) => console.error("Error fetching referral counts:", error));
  };
  
  return (
    <div>
      <Topbaragents />
      <div className="sidecotainer">
        <Sidebaragents />
        <div className="agentdash"><div className='container'>
                        <div className="row" style={{paddingLeft:'40px',paddingRight:'40px'}}>
                            <h3 style={{marginTop:'40px'}}>Agent Dashboard</h3>
                            
                            <div className="col-lg-3"style={{ paddingTop:'40px',marginLeft:'20%',marginRight:'10%',PaddingBottom:'40px'}}>
                                <div className='card mb-3'>
                                    <div  style={{ backgroundColor: "#cce2f5" }}
                    className="card-body shadow">
                                        <div className='d-flex flex-between-center mb-3'>
                                            <div className='d-flex align-items-center'>
                                                <div className='icon-item icon-item-sm bg-primary shadow-none me-2 bg-primary-subtle'>
                                                <AccountCircle className="svg-inline--fa fa-phone fa-w-16 fs-11 text-primary" />{" "}
                                                </div>
                                                <h6 className="mb-0"><b>Assign Referral:</b></h6>
                                            </div>
                                        </div>
                                        <div className="card-highlight">
                                            <h1 className="card-number">{assignReferralCount}</h1>
                                        </div>
                                    </div>
                                </div> 
                            </div>
                          

                            <div className="col-lg-3" style={{paddingTop:'40px', paddingBottom:'40px',PaddingBottom:'40px'}}>
                                <div className='card mb-3'>
                                    <div style={{textAlign:'center', backgroundColor: "#cce2f5" }}
                    className="card-body shadow">
                                        <div className='d-flex flex-between-center mb-3'>
                                            <div className='d-flex align-items-center'>
                                                <div className='icon-item icon-item-sm bg-primary shadow-none me-2 bg-primary-subtle'>
                                                <AccountCircle className="svg-inline--fa fa-phone fa-w-16 fs-11 text-primary" />{" "}                                                </div>
                                                <h6 className="mb-0"><b>Complete Referal:</b></h6>
                                            </div>
                                        </div>
                                        <div className="card-highlight">
                                            <h1 className="card-number">{completeReferralCount}</h1>
                                        </div>
                                    </div>
                                </div>
                            </div>
                           
                            {/* Repeat above div 3 more times */}
                            {/* Adjust content and properties as needed */}
                        </div>
                    </div></div>
      </div>
    </div>
  );
}
