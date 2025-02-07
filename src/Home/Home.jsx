import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserData,
  deleteUser,
  updateUser,
  addUser,
} from "../store/userActions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Home.css";

const validateUser = (user) => {
  const errors = {};
  if (!user.FirstName.trim()) errors.FirstName = "First name is required.";
  if (!user.SecondName.trim()) errors.SecondName = "Last name is required.";
  if (!user.Email.trim()) errors.Email = "Email is required";
  if (!user.Department.trim()) errors.Department = "Department is required.";
  return errors;
};
//modal

const EditModal = ({ user, closeModal, onSave }) => {
  const [editUser, setEditUser] = useState(user);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditUser({ ...editUser, [name]: value });
  };

  const handleSave = () => {
    const validationErrors = validateUser(editUser);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      onSave(editUser);
      closeModal();
    } catch {
      toast.error("Error saving user data!");
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Edit User</h2>
        <label>First Name:</label>
        <input
          type="text"
          name="FirstName"
          value={editUser.FirstName}
          onChange={handleChange}
        />
        {errors.FirstName && <p className="error" style={{color:"red",fontFamily:"times-romans"}}>{errors.FirstName}</p>}

        <label>Last Name:</label>
        <input
          type="text"
          name="SecondName"
          value={editUser.SecondName}
          onChange={handleChange}
        />
        {errors.SecondName && <p className="error" style={{color:"red",fontFamily:"times-romans"}}>{errors.SecondName}</p>}

        <label>Email:</label>
        <input
          type="email"
          name="Email"
          value={editUser.Email}
          onChange={handleChange}
        />
        {errors.Email && <p className="error" style={{color:"red",fontFamily:"times-romans"}}>{errors.Email}</p>}

        <label>Department:</label>
        <input
          type="text"
          name="Department"
          value={editUser.Department}
          onChange={handleChange}
        />
        {errors.Department && <p className="error" style={{color:"red",fontFamily:"times-romans"}}>{errors.Department}</p>}

        <button onClick={handleSave} className="save-btn">
          Save
        </button>
        <button onClick={closeModal} className="cancel-btn">
          Cancel
        </button>
      </div>
    </div>
  );
};
//addusermodal

const AddUserModal = ({ closeModal, onAddUser }) => {
  const [newUser, setNewUser] = useState({
    FirstName: "",
    SecondName: "",
    Email: "",
    Department: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateUser(newUser);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      onAddUser({ ...newUser, Id: Date.now() });
      closeModal();
    } catch {
      toast.error("Error adding user!");
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Add New User</h2>
        <form onSubmit={handleSubmit}>
          <label>First Name:</label>
          <input
            type="text"
            name="FirstName"
            value={newUser.FirstName}
            onChange={handleChange}
          />
          {errors.FirstName && <p className="error" style={{color:"red",fontFamily:"times-romans"}}>{errors.FirstName}</p>}

          <label>Last Name:</label>
          <input
            type="text"
            name="SecondName"
            value={newUser.SecondName}
            onChange={handleChange}
          />
          {errors.SecondName && <p className="error" style={{color:"red",fontFamily:"times-romans"}}>{errors.SecondName}</p>}

          <label>Email:</label>
          <input
            type="email"
            name="Email"
            value={newUser.Email}
            onChange={handleChange}
          />
          {errors.Email && <p className="error" style={{color:"red",fontFamily:"times-romans"}}>{errors.Email}</p>}

          <label>Department:</label>
          <input
            type="text"
            name="Department"
            value={newUser.Department}
            onChange={handleChange}
          />
          {errors.Department && <p className="error" style={{color:"red",fontFamily:"times-romans"}}>{errors.Department}</p>}

          <button type="submit" className="add-user-btn">
            Add User
          </button>
          <button type="button" onClick={closeModal} className="cancel-btn">
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

const Home = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteUser(id));
    toast.success("User deleted successfully!");
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleSave = (updatedUser) => {
    dispatch(updateUser(updatedUser));
    toast.success("User updated successfully!");
  };

  const handleAddUser = (newUser) => {
    dispatch(addUser(newUser));
    toast.success("User added successfully!");
  };

  const closeModal = () => setIsModalOpen(false);
  const closeAddModal = () => setIsAddModalOpen(false);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = user.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(user.length / usersPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="home-container">
      <h1 className="main-heading">AJACKUS EMPLOYEES</h1>
      <div className="add-user-div">
        <button onClick={() => setIsAddModalOpen(true)} className="add-user">
          Add User
        </button>
      </div>
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((userData) => (
            <tr key={userData.Id}>
              <td>{userData.Id}</td>
              <td>{userData.FirstName}</td>
              <td>{userData.SecondName}</td>
              <td>{userData.Email}</td>
              <td>{userData.Department}</td>
              <td>
                <button
                  onClick={() => handleEdit(userData)}
                  className="edit-btn"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(userData.Id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={currentPage === index + 1 ? "active-page" : ""}
          >
            {index + 1}
          </button>
        ))}
      </div>
      {isModalOpen && (
        <EditModal
          user={selectedUser}
          closeModal={closeModal}
          onSave={handleSave}
        />
      )}
      {isAddModalOpen && (
        <AddUserModal closeModal={closeAddModal} onAddUser={handleAddUser} />
      )}
      <ToastContainer />
    </div>
  );
};

export default Home;
