
import React from 'react';
import { BrowserRouter , Route, Routes } from 'react-router-dom';
import AdminDashboard from './AdminPanel/AdminDashboard'; // Import other components for admin panel
import AdminPanel from './AdminPanel/AdminPanel';
import AdminAuthentication from './AdminPanel/AdminAuthentication';
import PrivateComponent from './AdminPanel/PrivateComponent';
import AddCategory from './AdminPanel/AddCategory';
import ManageCategories from './AdminPanel/ManageCategories';
import AddBrand from './AdminPanel/AddBrand';
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/adminpanel" element={<AdminPanel/>}>
          <Route index element={<AdminAuthentication />} /> {/* This renders on /adminpanel */}
          <Route element={<PrivateComponent />}>

          <Route path="/adminpanel/dashboard" element={<AdminDashboard />} /> {/* Other admin routes */}
          <Route path="/adminpanel/AddCategory" element={<AddCategory />} /> {/* Add route for adding category */}
          <Route path="/adminpanel/ManageCategories" element={<ManageCategories />} /> {/* Add route for adding category */}
          <Route path="/adminpanel/AddBrands" element={<AddBrand />} /> {/* Add route for adding category */}

          </Route>
          {/* Add more admin routes here */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
