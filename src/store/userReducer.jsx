// Export Home component
import axios from 'axios';

// Action to set user data in the Redux store
export const setUserData = (data) => ({
    type: 'SET_USER_DATA',
    payload: data
});

// Action to delete a user
export const deleteUser = (id) => ({
    type: 'DELETE_USER',
    payload: id
});

// Action to update a user
export const updateUser = (updatedUser) => ({
    type: 'UPDATE_USER',
    payload: updatedUser
});
// Action to add a new user
export const addUser = (newUser) => ({
    type: 'ADD_USER',
    payload: newUser
});


// Thunk action to fetch user data
export const fetchUserData = () => async (dispatch) => {
    try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/users');
        
        // Map the response data
        const result = response.data.map((each) => ({
            Id: each.id,
            FirstName: each.name.split(' ')[0],
            SecondName: each.name.split(' ')[1] || '',
            Department: each.company.name
        }));

        // Dispatch the action to store the fetched data in the Redux store
        dispatch(setUserData(result));
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};
const initialState = [];

// Reducer to handle user data actions
const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_USER_DATA':
            return action.payload;
        case 'DELETE_USER':
            return state.filter((user) => user.Id !== action.payload); // Filter out the deleted user
        case 'UPDATE_USER':
            return state.map((user) =>
                user.Id === action.payload.Id ? { ...user, ...action.payload } : user
            ); // Update the user data
        case 'ADD_USER':
            return [...state, action.payload]; // Add the new user to the state
        default:
            return state;
    }
};

export default userReducer;
