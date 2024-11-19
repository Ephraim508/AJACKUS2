import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';  // Corrected import statement

import userReducer from './userReducer';

// Combine reducers
const rootReducer = combineReducers({
    user: userReducer
});

// Create Redux store with thunk middleware
const store = createStore(
    rootReducer,
    applyMiddleware(thunk)  // Apply the thunk middleware
);

export default store;
