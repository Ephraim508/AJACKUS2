import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import store from './store/store';  // Import the store

ReactDOM.render(
  <Provider store={store}> {/* Provide the Redux store to your application */}
    <App />
  </Provider>,
  document.getElementById('root')
);
