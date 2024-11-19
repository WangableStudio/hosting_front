import React from 'react';
import { BrowserRouter, Navigate, Route, Router, Routes } from 'react-router-dom';
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
import Media from './components/admin/Media';
import { FilterProvider } from './components/context/FilterContext';
import UserMedia from './components/user/UserMedia';

const App = () => {
  return (
    <UserProvider>
      <FilterProvider>
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
            <Route
              path="/vd"
              element={
                <ProtectedRoute>
                  <Media />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ph"
              element={
                <ProtectedRoute>
                  <Media />
                </ProtectedRoute>
              }
            />
            <Route path='/user' element={<Navigate to="/user/vd" replace />} />
            <Route path='/user/vd' element={<UserMedia />} />
            <Route path='/user/ph' element={<UserMedia />} />
          </Routes>
        </BrowserRouter>
      </FilterProvider>
    </UserProvider>
  );
};

export default App;
