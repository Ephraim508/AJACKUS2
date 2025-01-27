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
    }
};

const initialState = [];

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_USER_DATA':
            return action.payload;
        case 'DELETE_USER':
            return state.filter((user) => user.Id !== action.payload);
        case 'UPDATE_USER':
            return state.map((user) =>
                user.Id === action.payload.Id ? { ...user, ...action.payload } : user
            );
        case 'ADD_USER':
            return [...state, action.payload];
        default:
            return state;
    }
};

export default userReducer;
