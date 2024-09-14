// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Import the Tailwind CSS file

import { Provider } from 'react-redux';
import store from './Store/store'; // Import the store
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}> {/* Wrap the App component with Provider */}
    <App />
  </Provider>
);
