import { BrowserRouter, Route, Routes, } from "react-router-dom";
import "./App.css";
import Login from "./Login";
import Refrralagents from "./agent/Refrralagents";
import Register from "./Register";
import { ToastContainer }from "react-toastify";
import Home from "./componets/Home";
import Agentcomponets from "./componets/Agentcomponets";
import Refral from "./componets/Refral";
import Agentsdash from "./agent/Agentsdash";
import Products from "./agent/Products"
import Addproduct from "./agent/Addproduct";
import EditProduct from "./agent/EditProduct";
import AssignReferral from './agent/AssignReferral'; // Import your AssignReferral component
import CompleteReferral from './agent/CompleteReferral';
import RejectReferral from "./agent/RejectReferral";
import AdminAssign from "./componets/AdminAssign";
import AdminComplete from "./componets/AdminComplete";
import AdminNew from "./componets/AdminNew";
import AdminReject from "./componets/AdminReject";
import Agentprofile from "./agent/Agentprofile";
import ForgotPassword from "./agent/Forgotpassword";
import ResetPassword from "./agent/Resetpassword";
import OTPInput from "./agent/OTPInput";

function App() {
  return (
    <div className="App">
      
      <ToastContainer theme="colored"></ToastContainer>
      <BrowserRouter>
        <Routes> 
        <Route path="/refrralagents" element={<Refrralagents/>}></Route>
        <Route path="/agent" element={<Agentcomponets/>}></Route>
        <Route path="/refral" element={<Refral/>}></Route>
          <Route path="/home" element={<Home />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/" element={<Register />}></Route>
          <Route path="/agentdash" element={<Agentsdash/>}></Route>
          <Route path="/product" element={<Products/>}></Route>
          <Route path="/addproduct" element={<Addproduct/>}></Route>
          <Route path="/referral/assign" element={<AssignReferral />} />
          <Route path="/referral/complete" element={<CompleteReferral />} />
          <Route path="/editproduct" element={<EditProduct/>}></Route>
          <Route path="/referral/reject" element={<RejectReferral />} />
          <Route path="/refral/assign" element={<AdminAssign />} /> 
          <Route path="/refral/complete" element={<AdminComplete />} />
          <Route path="/refral/reject" element={<AdminReject />} />
          <Route path="/refral/new" element={<AdminNew />} />
          <Route path="/agentprofile" element={<Agentprofile />} /> 
          <Route path="/forgotpass" element={<ForgotPassword  />} /> 
          <Route path="/resetpass/:id" element={<ResetPassword />} /> 
          <Route path="/otpinputs" element={<OTPInput />} /> 
        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;
