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

// Action to set error when API call fails
export const setUserDataError = (error) => ({
    type: 'SET_USER_DATA_ERROR',
    payload: error
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
        dispatch(setUserDataError('Failed to load user data. Please try again later.'));
    }
};
