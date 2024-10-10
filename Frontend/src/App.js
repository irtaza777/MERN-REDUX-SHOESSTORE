import React from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import AdminDashboard from './AdminPanel/AdminDashboard';
import AdminPanel from './AdminPanel/AdminPanel';
import AdminAuthentication from './AdminPanel/AdminAuthentication';
import PrivateComponent from './AdminPanel/PrivateComponent';
import AddCategory from './AdminPanel/AddCategory';
import ManageCategories from './AdminPanel/ManageCategories';
import AddBrand from './AdminPanel/AddBrand';
import ManageBrands from './AdminPanel/ManageBrands';
import AddProduct from './AdminPanel/AddProduct';
import AdminProductsShoesize from './AdminPanel/AdminProductsShoesize';
import AdminProductColor from './AdminPanel/AdminProductColor';
import ManageProducts from './AdminPanel/ManageProducts';
import LandingPage from './Components/LandingPage/LandingPage';
import Navbar from './Components/Navbar/Navbar';
import UserAuthentication from './Components/UserAuthentication/UserAuthentication';
import Products from './Components/Products/Products';
import Cart from './Components/Cart/Cart';

const App = () => {
  // Custom hook to determine if we're on an admin route
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/adminpanel');

  return (
    <>
      {/* Only show Navbar if not on admin panel routes */}
      {!isAdminRoute && <Navbar />}

      <Routes>
        <Route path="/adminpanel" element={<AdminPanel />}>
          <Route index element={<AdminAuthentication />} /> {/* This renders on /adminpanel */}
          <Route element={<PrivateComponent />}>
            <Route path="/adminpanel/dashboard" element={<AdminDashboard />} /> {/* Other admin routes */}
            <Route path="/adminpanel/AddCategory" element={<AddCategory />} /> {/* Add route for adding category */}
            <Route path="/adminpanel/ManageCategories" element={<ManageCategories />} /> {/* Add route for managing categories */}
            <Route path="/adminpanel/AddBrands" element={<AddBrand />} /> {/* Add route for adding brand */}
            <Route path="/adminpanel/ManageBrands" element={<ManageBrands />} /> {/* Add route for managing brands */}
            <Route path="/adminpanel/AddProduct" element={<AddProduct />} /> {/* Add route for adding product */}
            <Route path="/adminpanel/AdminProductsShoesize" element={<AdminProductsShoesize />} /> {/* Add route for managing shoe sizes */}
            <Route path="/adminpanel/AdminProducts/ProductColor" element={<AdminProductColor />} /> {/* Add route for product color */}
            <Route path="/adminpanel/AdminProducts/AllProductsDetails" element={<ManageProducts />} /> {/* Add route for managing products */}
          </Route>
        </Route>

        <Route path="/" element={<LandingPage />} /> {/* Add route for landing page */}
        <Route path="/UserAuthentication" element={<UserAuthentication />} /> {/* Add route for landing page */}
        <Route path="/Products" element={<Products />} /> {/* Add route for landing page */}
        <Route path="/cart" element={<Cart />} /> {/* Add route for landing page */}
      </Routes>
    </>
  );
};

const AppWrapper = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

export default AppWrapper;
