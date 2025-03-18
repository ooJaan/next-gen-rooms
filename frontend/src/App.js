import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BaseLayout from './pages/BaseLayout';
import RoomList from './pages/RoomList';
import RoomOverview from './pages/RoomOverview';
import Login from './pages/Login';
import Register from './pages/Register';
import Verify from './pages/Verify';
import Logout from './pages/Logout';

import { AuthProvider } from "./provider/AuthProvider";
import { ProtectedRoute } from "./provider/ProtectedRoute"

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<BaseLayout title="home"></BaseLayout>} />
          <Route path="/login" element={<BaseLayout title="Login" content={<Login />} />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<BaseLayout title="Register" content={<Register />} />} />
          <Route path="/verify" element={<BaseLayout title="Verify" content={<Verify />} />} />
          <Route path="/contact" element={<BaseLayout title="contact"></BaseLayout>} />
          <Route element={<ProtectedRoute />}>
            <Route path="/list" element={<BaseLayout title="Room List" content={<RoomList></RoomList>}> </BaseLayout>} />
          </Route>
          <Route path="/list-dev" element={<BaseLayout title="Room List" content={<RoomList></RoomList>}> </BaseLayout>} />
          <Route path="/overview/:id" element={<BaseLayout title="Room List" content={<RoomOverview></RoomOverview>}> </BaseLayout>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;