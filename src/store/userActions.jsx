import axios from 'axios';

export const setUserData = (data) => ({
    type: 'SET_USER_DATA',
    payload: data
});

export const deleteUser = (id) => ({
    type: 'DELETE_USER',
    payload: id
});

export const updateUser = (updatedUser) => ({
    type: 'UPDATE_USER',
    payload: updatedUser
});

export const addUser = (newUser) => ({
    type: 'ADD_USER',
    payload: newUser
});

export const setUserDataError = (error) => ({
    type: 'SET_USER_DATA_ERROR',
    payload: error
});

export const fetchUserData = () => async (dispatch) => {
    try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/users');
        const result = response.data.map((each) => ({
            Id: each.id,
            FirstName: each.name.split(' ')[0],
            SecondName: each.name.split(' ')[1] || '',
            Email: each.email,
            Department: each.company.name
        }));
        dispatch(setUserData(result));
    } catch (error) {
        console.error('Error fetching data:', error);
        dispatch(setUserDataError('Failed to load user data. Please try again later.'));
    }
};
