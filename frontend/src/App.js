import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate, Outlet, useNavigate } from 'react-router-dom';
import BaseLayout from './pages/BaseLayout';
import RoomList from './pages/RoomList';
import RoomOverview from './pages/RoomOverview';
import Login from './pages/Login';
import Register from './pages/Register';
import Verify from './pages/Verify';
import { Debug } from './pages/Debug';
import Logout from './pages/Logout';
import RoomEdit from './pages/RoomEdit';
import Users from './pages/Users';
import ChangePw from './pages/ChangePw.js';
import NetworkWrapper from './provider/Network.js';
import UserOverview from './pages/UserOverview';

import { AuthProvider, AuthContext } from "./provider/AuthProvider";
import { ProtectedRoute } from "./provider/ProtectedRoute";
import AdminRoute from "./provider/AdminRoute.js";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Offline page doesn't need to be wrapped - it's always accessible */}
          
          {/* NetworkStatusWrapper as parent route that renders Outlet */}
          <Route element={<NetworkWrapper />}>
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify" element={<Verify />} />
            
            {/* Protected routes still work as before */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<BaseLayout title="Room List" content={<RoomList />} />} />
              <Route path="/change-pw" element={<ChangePw />} />
              <Route path="/overview/:id" element={<RoomOverview />} />
              <Route path="/debug" element={<BaseLayout title="debug" content={<Debug />} />} />
              <Route path="/user-overview" element={<UserOverview />} />
              
              <Route element={<AdminRoute />}>
                <Route path="/users" element={<BaseLayout title="Users" content={<Users />} />} />
                <Route path="/edit/:id" element={<BaseLayout title="Edit" content={<RoomEdit />} />} />
              </Route>
            </Route>
            
            <Route path="/list-dev" element={<BaseLayout title="Room List" content={<RoomList />} />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;