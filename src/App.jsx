import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/navbar/Navbar';
import Video from './pages/Video';
import Banner from './components/banner/Banner';
import Login from './components/login/Login';
import { UserProvider } from './components/context/UserContext'; // Импортируем UserProvider
import ProtectedRoute from './components/protectedroute/ProtectedRoute';
import Attribute from './components/admin/Attribute';
import Users from './components/admin/User';
import Category from './components/admin/Category';

const App = () => {
  return (
    <UserProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<><Banner /><Home /></>} />
          <Route path="/video" element={<><Banner /><Video /></>} />
          <Route path='/login' element={<Login />} />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <Users />
              </ProtectedRoute>
            }
          />
          <Route
            path="/category"
            element={
              <ProtectedRoute>
                <Category />
              </ProtectedRoute>
            }
          />
          <Route
            path="/attribute"
            element={
              <ProtectedRoute>
                <Attribute />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
};

export default App;
