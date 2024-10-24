// import React, { useEffect, useState } from "react";
// import Topbaragents from "./Topbaragents";
// import Sidebaragents from "./Sidebaragents";
// import { useNavigate } from "react-router-dom";

// export default function Product() {
//   const navigate = useNavigate();

//   useEffect(() => {
//     let email = sessionStorage.getItem("email");
//     if (email === "" || email === null) {
//       navigate("/login");
//     }

//     fetchProduct();
//   }, [navigate]);

//   const [product, setProduct] = useState([]);

//   const fetchReferral = () => {
//     fetch("http://localhost:8000/referral")
//       .then((response) => response.json())
//       .then((data) => setReferral(data))
//       .catch((error) => console.error("Error fetching referral:", error));
//   };

//   return (
//     <div>
//       <Topbaragents />
//       <div className="sidecontainer">
//         <Sidebaragents />
//         <div className="agentdash">
//           <div style={{ marginLeft: "50px" }}>
//             <div className="col-lg-10">
//               <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
//                 Products
//               </h1>
//               <div className="table-responsive">
//                 <table className="table table-bordered table-striped">
//                   <thead className="bg-primary text-white">
//                     <tr>
//                       <th>ID</th>
//                       <th>Date</th>
//                       <th>Brandname</th>
//                       <th>Country-Origin</th>
//                       <th>Productname</th>
//                       <th>Description</th>
//                       <th>Price</th>
//                       <th>Action</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {product.map((pro) => (
//                       <tr key={pro.id}>
//                         <td>{pro.id}</td>
//                         <td>{pro.date}</td>
//                         <td>{pro.brandname}</td>
//                         <td>{pro.country - origin}</td>
//                         <td>{pro.productname}</td>
//                         <td>{pro.description}</td>
//                         <td>{pro.price}</td>
//                         <td>{pro.action}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
