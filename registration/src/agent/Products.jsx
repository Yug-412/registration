import React, { useEffect, useState } from "react";
import Topbaragents from "../Topbaragents";
import Sidebaragents from "../Sidebaragents";
import { Link, useNavigate } from "react-router-dom";
import { Delete, Edit } from "@mui/icons-material";
import defaultImage from "../images/image.png";
import { Modal, Button, TextField, Box, Grid } from "@mui/material"; // Import Grid
import "./agent.css";
import { toast } from "react-toastify";
import { Form } from "react-bootstrap";

export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editedProductData, setEditedProductData] = useState({
    id: "",
    brandname: "",
    countryorigin: "",
    productname: "",
    description: "",
    image: "",
    price: "",
    date: "", // Remove the pre-filled date
  });
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 3;
  const [image, setImage] = useState({
    placeholder: defaultImage,
    file: null,
  });

  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  useEffect(() => {
    let email = sessionStorage.getItem("email");
    if (email === "" || email === null) {
      navigate("/login");
    } else {
      fetchProducts();
    }
  }, [navigate, currentPage]);

  const fetchProducts = () => {
    const agentId = sessionStorage.getItem("id");
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;

    fetch(`http://localhost:8001/product?agentId=${agentId}`)
      .then((response) => response.json())
      .then((data) => setProducts(data.slice(startIndex, endIndex)))
      .catch((error) => console.error("Error fetching products:", error));
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setEditedProductData(product);
    setIsModalOpen(true); // Open the modal when editing
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdate = () => {
    fetch(`http://localhost:8001/product/${editingProduct.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editedProductData), // Send only edited data without modifying the date
    })
      .then((response) => {
        if (response.ok) {
          toast.success("update Product sucessfully")
          return response.json(); 
         
          // Parse response JSON
        } else {
          throw new Error("Failed to update product");
        }
      })
      .then((updatedProduct) => {
        // Update the products state to reflect the changes
        const updatedProducts = products.map((product) => {
          if (product.id === updatedProduct.id) {
            return updatedProduct;
          } else {
            return product;
          }
        });
        setProducts(updatedProducts);

        setIsModalOpen(false); // Close the modal after updating
      })
      .catch((error) => {
        console.error("Error updating product:", error);
        // Handle error state or display an error message
      });
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setIsModalOpen(false); // Close the modal
  };

  const handleDelete = (productId) => {
    const confirmed = window.confirm("Are you sure you want to delete this product?");
    if (!confirmed) return;
    console.log("Deleting product with ID:", productId);
    fetch(`http://localhost:8001/product/${productId}`, {
      method: "DELETE",
    })
      .then((response) => {
        
        if (response.ok) {
          console.log("Product deleted successfully");
          // Filter out the deleted product from the products state
          const updatedProducts = products.filter(
            (product) => product.id !== productId
          );
          setProducts(updatedProducts); // Update the state
        } else {
          console.error("Failed to delete product");
        }
      })
      .catch((error) => console.error("Error deleting product:", error));
  };

  function getCurrentDate() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const handlePageChange = (direction) => {
    setCurrentPage((prevPage) =>
      direction === "next" ? prevPage + 1 : prevPage - 1
    );
  };
  // Function to handle file input change
  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedProductData({ ...editedProductData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const defaultImageUrl = "https://example.com/default-image.jpg";

  return (
    <div>
      <Topbaragents />
      <div className="sidecontainer">
        <Sidebaragents />
        <div className="products">
          <Link to="/addproduct" className="btn btn-primary mt-3">
            Add Product
          </Link>
          <table className="table table-bordered table-striped mt-3">
            <thead className="bg-primary text-blue">
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Brand</th>
                <th>Country</th>
                <th>Product name</th>
                <th>Description</th>
                <th>Product Image</th>
                <th>Price</th>
                <th >Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.date}</td>
                  <td>{product.brandname}</td>
                  <td>{product.countryorigin}</td>
                  <td>{product.productname}</td>
                  <td>{product.description}</td>
                  <td>
                    <img
                      src={product.image} // Assuming 'image' contains the image URL
                      alt="Product"
                      style={{ width: "100px", height: "100px" }} // Adjust width and height as needed
                    />
                  </td>
                  <td>{product.price}</td>
                  <td>
                    <Edit
                      className="edit"
                      onClick={() => handleEdit(product)}
                    />
                    <Delete onClick={() => handleDelete(product.id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <button
              style={{ backgroundColor: "grey" }}
              className="btn btn-secondary"
              disabled={currentPage === 1}
              onClick={() => handlePageChange("prev")}
            >
              Previous
            </button>
            <span className="mx-2">{currentPage}</span>
            <button
              style={{ backgroundColor: "grey" }}
              className="btn btn-secondary"
              disabled={products.length < productsPerPage}
              onClick={() => handlePageChange("next")}
            >
              Next
            </button>
          </div>
          <Modal open={isModalOpen} onClose={handleCancelEdit}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
                bgcolor: "#cce2f5",
                boxShadow: 24,
                p: 4,
              }}
            >
              <h2>Edit Product</h2>
              <TextField
                label="Brand Name"
                variant="outlined"
                fullWidth
                value={editedProductData.brandname}
                name="brandname"
                onChange={handleInputChange}
                margin="normal"
              />{" "}
              <Grid container spacing={2}>
                {/* Use Grid container */}
                <Grid item xs={6}>
                  {/* Each Grid item takes 50% width */}
                  <TextField
                    label="Country of Origin"
                    variant="outlined"
                    fullWidth
                    value={editedProductData.countryorigin}
                    name="countryorigin"
                    onChange={handleInputChange}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={6}>
                  {/* Each Grid item takes 50% width */}
                  <TextField
                    type="Date"
                    variant="outlined"
                    fullWidth
                    value={editedProductData.date} // No pre-filled value
                    min="1900-01-01" // Set min date to an arbitrary date
                    max={getCurrentDate()}
                    name="date"
                    onChange={handleInputChange}
                    margin="normal"
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                {/* Product Name */}
                <Grid item xs={6}>
                  <TextField
                    label="Product Name"
                    variant="outlined"
                    fullWidth
                    value={editedProductData.productname}
                    name="productname"
                    onChange={handleInputChange}
                    margin="normal"
                  />
                </Grid>
                {/* Description */}
                <Grid item xs={6}>
                  <TextField
                    label="Description"
                    variant="outlined"
                    fullWidth
                    value={editedProductData.description}
                    name="description"
                    onChange={handleInputChange}
                    margin="normal"
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                {/* Product Image Input */}
                <Grid item xs={12}>
                <Form.Control style={{backgroundColor:'#5e95b5'}} type="file" onChange={handleFileInputChange} />
                </Grid>
                {/* Display Product Image */}
                <Grid item xs={12}>
                  {editedProductData.image ? (
                    <img
                      src={editedProductData.image}
                      alt="Product"
                      style={{ height: "80px", width: "80px" }}
                    />
                  ) : (
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
                  )}
                </Grid>
              </Grid>
              <TextField
                label="Price"
                variant="outlined"
                fullWidth
                value={editedProductData.price}
                name="price"
                onChange={handleInputChange}
                margin="normal"
              />
              <Button
                onClick={handleUpdate}
                variant="contained"
                color="primary"
                sx={{ mr: 2 }}
              >
                Update
              </Button>
              <Button onClick={handleCancelEdit} variant="contained">
                Cancel
              </Button>
            </Box>
          </Modal>
        </div>
      </div>
    </div>
  );
}
