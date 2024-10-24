import React, { useEffect, useState } from "react";
import "./agentcomponets.css";
import { Dropdown, DropdownButton } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Topbar from "./topbar/Topbar";
import Sidebar from "./sidebar/Sidebar";
import { useNavigate } from "react-router-dom";

export default function Agentcomponets() {
  const usenavigate = useNavigate();
  useEffect(() => {
    let email = sessionStorage.getItem("email");
    if (email === "" || email === null) {
      usenavigate("/login");
    }
  }, []);
  const agentPerPage = 5;
  const [totalPages, setTotalPages] = useState(0);
  const [menustatus, setmenustatus] = useState(false);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);


  useEffect(() => {
    fetchTotalUsersCount();
    fetchUsers(); // Fetch users on component mount
  }, [currentPage]); // Fetch users when the currentPage changes
  const fetchTotalUsersCount = () => {
    const url = `http://localhost:8000/user/count?role=Agent`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const totalUsers = data.count;
        setTotalPages(Math.ceil(totalUsers / agentPerPage));
      })
      .catch((error) => {
        console.error("Error fetching total users count:", error);
      });
  };

  const fetchUsers = () => {
    const startIndex = (currentPage - 1) * agentPerPage;
    const url = `http://localhost:8000/user?role=Agent&_start=${startIndex}&_limit=${agentPerPage}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching users:", error));
  };

  const handleStatusUpdate = (id, newStatus) => {
    const confirmed = window.confirm(
      `Are you sure you want to ${newStatus.toLowerCase()} this user?`
    );
    if (!confirmed) return;
    fetch(`http://localhost:8000/user/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update status");
        }
        return response.json();
      })
      .then((updatedUser) => {
        setUsers(
          users.map((u) =>
            u.id === updatedUser.id ? { ...u, status: updatedUser.status } : u
          )
        );
      })
      .catch((error) => console.error("Error updating status:", error));
  };


  const handlePageChange = (direction) => {
    setCurrentPage((prevPage) =>
      direction === "next" ? prevPage + 1 : prevPage - 1
    );
  };

  return (
    <div>
      <Topbar setmenustatus={setmenustatus} />
      <div className="sidecontainer">
        <Sidebar menustatus={menustatus} />
        <div className="options">
          <div style={{ marginLeft: "50px" }}>
            <div className="col-lg-10">
              <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
                Agents
              </h1>
              <div className="table">
                <table className="table table-bordered table-striped">
                  <thead className="bg-primary text-white">
                    <tr>
                      <th>ID</th>
                      <th>Username</th>
                      <th>FullName</th>
                      <th>Email</th>
                      <th>Contact</th>
                      <th>Gender</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.username}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.phone}</td>
                        <td>{user.gender}</td>
                        <td>{user.role}</td>
                        <td>{user.status}</td>
                        <td>
                          {user.status !== "Declined" ? (
                            <DropdownButton
                              id={`dropdown-${user.id}`}
                              title="Action"
                            >
                              {user.status === "Register" && (
                                <>
                                  <Dropdown.Item
                                    onClick={() =>
                                      handleStatusUpdate(user.id, "Approved")
                                    }
                                  >
                                    Approve
                                  </Dropdown.Item>
                                  <Dropdown.Item
                                    onClick={() =>
                                      handleStatusUpdate(user.id, "Declined")
                                    }
                                  >
                                    Decline
                                  </Dropdown.Item>
                                </>
                              )}
                              {user.status === "Approved" && (
                                <>
                                  <Dropdown.Item
                                    onClick={() =>
                                      handleStatusUpdate(user.id, "Active")
                                    }
                                  >
                                    Activate
                                  </Dropdown.Item>
                                  <Dropdown.Item
                                    onClick={() =>
                                      handleStatusUpdate(user.id, "Deactive")
                                    }
                                  >
                                    Deactivate
                                  </Dropdown.Item>
                                </>
                              )}
                              {user.status === "Active" && (
                                <Dropdown.Item
                                  onClick={() =>
                                    handleStatusUpdate(user.id, "Deactive")
                                  }
                                >
                                  Deactivate
                                </Dropdown.Item>
                              )}
                              {user.status === "Deactive" && (
                                <Dropdown.Item
                                  onClick={() =>
                                    handleStatusUpdate(user.id, "Active")
                                  }
                                >
                                  Activate
                                </Dropdown.Item>
                              )}
                            </DropdownButton>
                          ) : (
                            <b>N/A</b>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
                  disabled={users.length < agentPerPage}
                  onClick={() => handlePageChange("next")}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
