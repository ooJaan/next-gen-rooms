import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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

import { AuthProvider } from "./provider/AuthProvider";
import { ProtectedRoute } from "./provider/ProtectedRoute"
import AdminRoute from "./provider/AdminRoute.js"

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<Verify />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<BaseLayout title="Room List" content={<RoomList></RoomList>}> </BaseLayout>} />
            <Route path="/change-pw" element={<ChangePw />} />
            <Route path="/overview/:id" element={<RoomOverview></RoomOverview>} />
            <Route path="/debug" element={<BaseLayout title="debug" content={<Debug />}></BaseLayout>} />
            <Route element={<AdminRoute />}>
              <Route path="/users" element={<BaseLayout title="Users" content={<Users />}></BaseLayout>} />
              <Route path="/edit/:id" element={<BaseLayout title="Edit" content={<RoomEdit />} />} />
            </Route>
          </Route>
          <Route path="/list-dev" element={<BaseLayout title="Room List" content={<RoomList></RoomList>}> </BaseLayout>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;