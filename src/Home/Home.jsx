import { useState, useEffect } from 'react'; // Import React hooks for state and side effects
import { useDispatch, useSelector } from 'react-redux'; // Import hooks for dispatching actions and selecting state from the Redux store
import { fetchUserData, deleteUser, updateUser, addUser } from '../store/userActions'; // Import Redux action creators
import { ToastContainer, toast } from 'react-toastify';  // Import ToastContainer and toast for notifications
import 'react-toastify/dist/ReactToastify.css'; // Import styles for notifications
import './Home.css'; // Import component-specific CSS styles

// EditModal component handles the functionality to edit user data
const EditModal = ({ user, closeModal, onSave }) => {
    const [editUser, setEditUser] = useState(user); // Local state to store editable user data

    // Handle changes in form fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditUser({
            ...editUser, // Preserve other fields
            [name]: value // Update the field being edited
        });
    };

    // Save changes and close modal
    const handleSave = () => {
        try {
            onSave(editUser); // Pass updated user data to parent
            closeModal(); // Close the modal
        } catch (error) {
            toast.error('Error saving user data!'); // Display error toast notification
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Edit User</h2>
                {/* Input fields for editing user data */}
                <label>First Name:</label>
                <input
                    type="text"
                    name="FirstName"
                    value={editUser.FirstName}
                    onChange={handleChange}
                />
                <label>Last Name:</label>
                <input
                    type="text"
                    name="SecondName"
                    value={editUser.SecondName}
                    onChange={handleChange}
                />
                <label>Department:</label>
                <input
                    type="text"
                    name="Department"
                    value={editUser.Department}
                    onChange={handleChange}
                />
                {/* Save and Cancel buttons */}
                <button onClick={handleSave} className='save-btn'>Save</button>
                <button onClick={closeModal} className='cancel-btn'>Cancel</button>
            </div>
        </div>
    );
};

// AddUserModal component handles adding a new user
const AddUserModal = ({ closeModal, onAddUser }) => {
    const [newUser, setNewUser] = useState({
        FirstName: '',
        SecondName: '',
        Department: '' // Initialize new user data
    });

    // Handle changes in form fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewUser({
            ...newUser, // Preserve other fields
            [name]: value // Update the field being entered
        });
    };

    // Submit form to add a new user
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission
        try {
            const userWithId = { ...newUser, Id: Date.now() }; // Add unique ID
            onAddUser(userWithId); // Pass new user data to parent
            closeModal(); // Close the modal
        } catch (error) {
            toast.error('Error adding user!'); // Display error toast notification
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Add New User</h2>
                {/* Form for entering new user data */}
                <form onSubmit={handleSubmit}>
                    <label>First Name:</label>
                    <input
                        type="text"
                        name="FirstName"
                        value={newUser.FirstName}
                        onChange={handleChange}
                        required
                    />
                    <label>Last Name:</label>
                    <input
                        type="text"
                        name="SecondName"
                        value={newUser.SecondName}
                        onChange={handleChange}
                        required
                    />
                    <label>Department:</label>
                    <input
                        type="text"
                        name="Department"
                        value={newUser.Department}
                        onChange={handleChange}
                        required
                    />
                    {/* Submit and Cancel buttons */}
                    <button type="submit" className='add-user-btn'>Add User</button>
                    <button type="button" onClick={closeModal} className='cancel-btn'>
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

// Main Home component that displays the user list and manages modals
const Home = () => {
    const dispatch = useDispatch(); // Dispatch actions to the Redux store
    const user = useSelector((state) => state.user); // Select user data from Redux state

    const [isModalOpen, setIsModalOpen] = useState(false); // State for edit modal visibility
    const [isAddModalOpen, setIsAddModalOpen] = useState(false); // State for add modal visibility
    const [selectedUser, setSelectedUser] = useState(null); // State for currently selected user
    const [currentPage, setCurrentPage] = useState(1); // State for pagination
    const usersPerPage = 8; // Number of users to display per page

    // Fetch user data on component mount
    useEffect(() => {
        try {
            dispatch(fetchUserData());
        } catch (error) {
            toast.error('Error fetching user data!'); // Display error toast notification
        }
    }, [dispatch]);

    // Handle deleting a user
    const handleDelete = (id) => {
        try {
            dispatch(deleteUser(id)); // Dispatch delete action
            toast.success('User deleted successfully!'); // Show success notification
        } catch (error) {
            toast.error('Error deleting user!'); // Display error toast notification
        }
    };

    // Handle editing a user
    const handleEdit = (user) => {
        setSelectedUser(user); // Set the user to be edited
        setIsModalOpen(true); // Open edit modal
    };

    // Handle saving edited user data
    const handleSave = (updatedUser) => {
        try {
            dispatch(updateUser(updatedUser)); // Dispatch update action
            toast.success('User updated successfully!'); // Show success notification
        } catch (error) {
            toast.error('Error updating user data!'); // Display error toast notification
        }
    };

    // Handle adding a new user
    const handleAddUser = (newUser) => {
        try {
            dispatch(addUser(newUser)); // Dispatch add action
            toast.success('User added successfully!'); // Show success notification
        } catch (error) {
            toast.error('Error adding user!'); // Display error toast notification
        }
    };

    // Close modals
    const closeModal = () => {
        setIsModalOpen(false);
    };

    const closeAddModal = () => {
        setIsAddModalOpen(false);
    };

    // Pagination logic
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = user.slice(indexOfFirstUser, indexOfLastUser); // Get users for the current page

    const totalPages = Math.ceil(user.length / usersPerPage); // Calculate total pages

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber); // Update current page
    };

    return (
        <div className="home-container">
            <h1 className='main-heading'>User Information</h1>
            {/* Add User button */}
            <div className='add-user-div'>
                <button onClick={() => setIsAddModalOpen(true)} className='add-user'>Add User</button>
            </div>

            {/* User table */}
            <table className="user-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
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
                            <td>{userData.Department}</td>
                            <td>
                                {/* Edit and Delete buttons */}
                                <button onClick={() => handleEdit(userData)} className='edit-btn'>Edit</button>
                                <button onClick={() => handleDelete(userData.Id)} className='delete-btn'>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination buttons */}
            <div className="pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        className={currentPage === index + 1 ? 'active-page' : 'no-active'}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>

            {/* Modals for editing and adding users */}
            {isModalOpen && (
                <EditModal
                    user={selectedUser}
                    closeModal={closeModal}
                    onSave={handleSave}
                />
            )}
            {isAddModalOpen && (
                <AddUserModal
                    closeModal={closeAddModal}
                    onAddUser={handleAddUser}
                />
            )}

            {/* Toast notification container */}
            <ToastContainer />
        </div>
    );
};

export default Home;
