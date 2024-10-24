import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { Box } from "@mui/material";
import { useParams } from "react-router-dom";
import Topbaragents from '../Topbaragents';
import Sidebaragents from '../Sidebaragents';

function EditProduct() {
  const [agentId, setAgentId] = useState("");
  const [agentName, setAgentName] = useState("");
  const [pdtName, setPdtName] = useState("");
  const [pdtDesc, setPdtDesc] = useState("");
  const [pdtPrice, setPdtPrice] = useState("");
  const [pdtDate, setPdtDate] = useState("");
  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");
  const [brandName, setBrandName] = useState("");
  const [image, setImage] = useState("");
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const navigate = useNavigate();
  const { pdtId } = useParams(); // Access agentId from URL parameter

  useEffect(() => {
    fetchReferrals(pdtId);
  });

  const fetchReferrals = async (pdtId) => {
    try {
      const response = await fetch(
        `http://localhost:8002/addpdt?id=${pdtId}`, // Use agentId to fetch referrals
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch referrals");
      }
      const referralData = await response.json();
      console.log(referralData);

      const parts = referralData[0].pdtdate.split("-");
      const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;

      setAgentId(referralData[0].agentid);
      setAgentName(referralData[0].agentname);
      setPdtName(referralData[0].pdtname);
      setPdtDesc(referralData[0].pdtdesc);
      setPdtPrice(referralData[0].pdtprice);
      setPdtDate(formattedDate);
      setBrandName(referralData[0].brandname);
      setImage(referralData[0].image);
      console.log(image)
      setSelectedCountry(referralData[0].countryorigin);
    } catch (error) {
      console.error("Error fetching referrals:", error);
    }
  };

  useEffect(() => {
    // Get the current date
    const today = new Date();
    // Calculate the first day of the current month
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    // Calculate the last day of the current month
    const lastDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    );

    // Set minDate to the ISO string format of the first day of the current month
    setMinDate(firstDayOfMonth.toISOString().split("T")[0]);
    // Set maxDate to the ISO string format of the last day of the current month
    setMaxDate(lastDayOfMonth.toISOString().split("T")[0]);
  }, []);

  useEffect(() => {
    async function fetchCountries() {
      try {
        const response = await axios.get(
          "https://api.countrystatecity.in/v1/countries",
          {
            headers: {
              "X-CSCAPI-KEY":
                "NnpmYnhnU2dUd3pteGRYMWZRTkFpVklEeVJDU3JtZ0pwblFoUUxOaQ==",
            },
          }
        );
        setCountries(response.data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    }

    fetchCountries();
  }, []);

  const handleEditProduct = async (productId) => {
    try {
      //   const agentId = sessionStorage.getItem("id");
      // const agentName = sessionStorage.getItem("name");
      const parts = pdtDate.split("-");
      const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;

      const updatedProduct = {
        id: productId,
        agentid: agentId,
        agentname: agentName,
        pdtname: pdtName,
        pdtdesc: pdtDesc,
        pdtprice: pdtPrice,
        pdtdate: formattedDate,
        brandname: brandName,
        countryorigin: selectedCountry,
        image: URL.createObjectURL(image),
      };

      // Send a PUT request to the server to update the product
      await axios.put(
        `http://localhost:8002/addpdt/${productId}`,
        updatedProduct
      );

      toast.success("Product Updated Successfully!");
      navigate("/addpdt");
    } catch (error) {
      // Handle errors, e.g., show an error message
      console.error("Error updating product:", error.message);
    }
  };

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    console.log("Name of the image: ", e.target.files);
  };

  return (
    <div className="bgcolor">
      <Topbaragents />
      <Box height={120} />
      <Box sx={{ display: "flex" }}>
        <Sidebaragents />

        <div className="container card my-5 bg-light p-2 col-4">
          <section className="">
            <form
              className="row g-3 p-3"
              onSubmit={() => handleEditProduct(pdtId)}
            >
              <div className="col-md-6 mb-3">
                <label htmlFor="inputPdtName" className="form-label">
                  Product Name <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="inputPdtName"
                  value={pdtName}
                  onChange={(e) => {
                    setPdtName(e.target.value);
                  }}
                  placeholder="Laptop"
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="inputPdtDesc" className="form-label">
                  Description <span style={{ color: "red" }}>*</span>
                </label>
                <textarea
                  type="text"
                  className="form-control"
                  id="inputPdtDesc"
                  rows="2"
                  value={pdtDesc}
                  onChange={(e) => {
                    setPdtDesc(e.target.value);
                  }}
                  placeholder="Efficient gadget"
                  required
                ></textarea>
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="inputPdtPrice" className="form-label">
                  Price <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <input
                    type="number"
                    className="form-control"
                    id="inputPdtPrice"
                    value={pdtPrice}
                    onChange={(e) => {
                      setPdtPrice(e.target.value);
                    }}
                    placeholder="52000"
                    required
                  />
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="inputPdtDate" className="form-label">
                  Date <span style={{ color: "red" }}>*</span>
                </label>
                {/* <input
                  type="date"
                  className="form-control"
                  id="inputPdtDate"
                  value={pdtDate} onChange={(e)=>{setPdtDate(e.target.value)}}
                  required
                /> */}
                <input
                  type="date"
                  className="form-control"
                  id="inputPdtDate"
                  value={pdtDate}
                  onChange={(e) => setPdtDate(e.target.value)}
                  // Set minimum and maximum allowed dates
                  min={minDate}
                  max={maxDate}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="inputBrandName" className="form-label">
                  Brand Name <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="inputBrandName"
                  value={brandName}
                  onChange={(e) => {
                    setBrandName(e.target.value);
                  }}
                  placeholder="Apple"
                  required
                />
              </div>
              <div className="col-md-6 mb-4">
                <label htmlFor="inputCountryOrigin" className="form-label">
                  Country Origin <span style={{ color: "red" }}>*</span>
                </label>
                <select
                  id="inputCountry"
                  className="form-select"
                  value={selectedCountry}
                  onChange={handleCountryChange}
                >
                  <option value="" className="dropdown-item">
                    Select Country...
                  </option>
                  {countries.map((country) => (
                    <option
                      key={country.code}
                      value={country.code}
                      className="dropdown-item"
                    >
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-12 mb-3">
                <label htmlFor="inputBrandName" className="form-label">
                  Upload an Image <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="inputImage"
                  // value={image}
                  onChange={handleImageChange}
                  required
                />
              </div>

              <div className="col-12 text-center">
                <button type="submit" className="btn btn-warning btn-lg ms-2">
                  Save
                </button>
              </div>
            </form>
          </section>
        </div>
      </Box>
    </div>
  );
}

export default EditProduct;
