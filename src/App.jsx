import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import { UserProvider } from './components/context/UserContext'
import Login from './components/login/Login'
import { FilterProvider } from './components/context/FilterContext'
import Product from './pages/Product'
import HowToCreate from './pages/HowToCreate'
import Act from './pages/Act'
import Footer from './components/footer/Footer'
import Navbar from './components/navbar/Navbar'
import ProtectedRoute from './components/protectedroute/ProtectedRoute'
import Users from './components/admin/User'
import Acts from './components/admin/Acts'

const App = () => {
  return (
    <UserProvider>
      <FilterProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path='/' Component={Home} />
            <Route path='/login' Component={Login} />
            <Route path='/act' Component={Product} />
            <Route path='/howtocreate' Component={HowToCreate} />
            <Route path='/act/create' Component={Act} />
            <Route
              path="/users"
              element={
                <ProtectedRoute>
                  <Users />
                </ProtectedRoute>
              }
            />
            <Route
              path="/acts"
              element={
                <ProtectedRoute>
                  <Acts />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Footer />
        </BrowserRouter>
      </FilterProvider>
    </UserProvider>
  )
}

export default App
