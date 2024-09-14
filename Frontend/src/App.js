
import React from 'react';
import { BrowserRouter , Route, Routes } from 'react-router-dom';
import AdminDashboard from './AdminPanel/AdminDashboard'; // Import other components for admin panel
import AdminPanel from './AdminPanel/AdminPanel';
import AdminAuthentication from './AdminPanel/AdminAuthentication';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/adminpanel" element={<AdminPanel/>}>
          <Route index element={<AdminAuthentication />} /> {/* This renders on /adminpanel */}
          <Route path="/adminpanel/dashboard" element={<AdminDashboard />} /> {/* Other admin routes */}
          {/* Add more admin routes here */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
