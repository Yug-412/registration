import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form } from "react-bootstrap";
import Topbaragents from "../Topbaragents";
import Sidebaragents from "../Sidebaragents";
import "./agent.css";
import defaultImage from "../images/image.png";
import { toast } from "react-toastify";

export default function Addproduct() {
  const navigate = useNavigate();
  const [image, setImage] = useState({
    placeholder: defaultImage,
    file: null,
  });
  const [newProductData, setNewProductData] = useState({
    brandname: "",
    countryorigin: "",
    productname: "",
    description: "",
    image:"",
    price: "",
    date: "",
  });

  const [highestId, setHighestId] = useState(null);

  useEffect(() => {
    fetchLastId();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const fetchLastId = () => {
    fetch("http://localhost:8001/product")
      .then((response) => response.json())
      .then((data) => {
        const lastId = data.length > 0 ? parseInt(data[data.length - 1].id) : 0;
        setHighestId(lastId);
      })
      .catch((error) => console.error("Error fetching last ID:", error));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const newProduct = {
        ...newProductData,
        id: (highestId + 1).toString(),
        agentId: sessionStorage.getItem("id"),
        image: image.placeholder // Assuming 'placeholder' contains the URL of the image
      };

      const response = await fetch("http://localhost:8001/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      });

      if (response.ok) {
        navigate("/product");
        toast.success("Add Product Suceesfully")
      } else {
        console.error("Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };
  

  function getCurrentDate() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const handleImageChange = (event) => {
    //const localfile=event.target.files[0]
    console.log(event.target.files[0]);
    if (
      event.target.files[0].type === "image/png" ||
      event.target.files[0].type === "image/jpeg"
    ) {
      //previw show
      const reader = new FileReader();
      reader.onload = (r) => {
        setImage({
          placeholder: r.target.result,
          file:event.target.files[0]
        });
        console.log(r.target.result)
      };

      reader.readAsDataURL(event.target.files[0]);
    } else {
      toast.error("Invalid File !!");
      image.file = null;
    }
  };

  return (
    <div>
      <Topbaragents />
      <div className="sidecontainer">
        <Sidebaragents />
        <div
          className="addd"
          style={{
            width: "1070px",
            marginLeft: "180px",
            marginRight: "80px",
            marginTop: "20px",
          }}
        >
          <div className="col-lg-6">
            <form
              onSubmit={handleAddProduct}
              className="addproduct"
              style={{ backgroundColor: "#cce2f5", borderRadius: "10px" }}
            >
              <div
                style={{
                  backgroundColor: "rgb(204, 226, 245",
                  borderTopLeftRadius: "10px",
                  borderTopRightRadius: "10px",
                }}
              >
                <div
                  style={{
                    marginLeft: "10px",
                    backgroundColor: "rgb(204, 226, 245",
                    borderTopLeftRadius: "10px",
                    borderTopRightRadius: "10px",
                    textAlign: "center",
                  }}
                  className="card-header"
                >
                  <h1> Add Product</h1>
                </div>
                <div>
                  <div
                    style={{ backgroundColor: "rgb(204, 226, 245" }}
                    className="card-body"
                  >
                    <div style={{ marginLeft: "10px" }} className="form-group">
                      <label>
                        <b>Brand Name:</b>
                      </label>
                      <input required
                        type="text"
                        name="brandname"
                        value={newProductData.brandname}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="Enter Brand Name"
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginLeft: "10px",
                      }}
                    >
                      <div style={{ width: "48%" }} className="form-group">
                        <label>
                          <b>Country of Origin:</b>
                        </label>
                        <input required
                          type="text"
                          name="countryorigin"
                          value={newProductData.countryorigin}
                          onChange={handleInputChange}
                          className="form-control"
                          placeholder="Enter Country of Origin"
                        />
                      </div>
                      <div
                        style={{ marginLeft: "10px" }}
                        className="col-lg-6 form-group"
                      >
                        <label>
                          <b>Date:</b>
                        </label>
                        <input required
                          type="date"
                          name="date"
                          value={newProductData.date}
                          min="1900-01-01" // Set min date to an arbitrary date
                          max={getCurrentDate()}
                          onChange={handleInputChange}
                          className="form-control"
                        />
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginLeft: "10px",
                      }}
                    >
                      <div style={{ width: "48%" }} className="form-group">
                        <label>
                          <b>Product Name:</b>
                        </label>
                        <input required
                          type="text"
                          name="productname"
                          value={newProductData.productname}
                          onChange={handleInputChange}
                          className="form-control"
                          placeholder="Enter Product Name"
                        />
                      </div>
                      <div
                        style={{ marginLeft: "10px", width: "50%" }}
                        className="form-group"
                      >
                        <label>
                          <b>Description:</b>
                        </label>
                        <input required
                          type="text"
                          name="description"
                          value={newProductData.description}
                          onChange={handleInputChange}
                          className="form-control"
                          placeholder="Enter Description"
                        />
                      </div>
                    </div>

                    <div style={{ marginLeft: "10px" }} className="form-group">
                      <label>
                        <b>Product Image:</b>
                      </label>
                      <img 
                        className="mb-1 mt-1"
                        style={{objectFit:'cover',
                          height: "100px",
                          width: "120px",
                          marginLeft: "10px",
                        }}
                        src={image.placeholder}
                        alt=""
                      />

                      <Form.Control type="file" onChange={handleImageChange} />
                    </div>
                    <div style={{ marginLeft: "10px" }} className="form-group">
                      <label>
                        <b>Price:</b>
                      </label>
                      <input required
                        type="text"
                        name="price"
                        value={newProductData.price}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="Enter Price"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div
                style={{
                  borderTopLeftRadius: "10px",
                  borderTopRightRadius: "10px",
                }}
                className="footer"
              >
                <button type="submit" className="btn btn-primary">
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
