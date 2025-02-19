import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BaseLayout from './pages/BaseLayout';
import RoomList from './pages/RoomList';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BaseLayout title="home"></BaseLayout>} />
        <Route path="/contact" element={<BaseLayout title="contact"></BaseLayout>} />
        <Route path="/rooms" element={<BaseLayout title="Room List" content={<RoomList></RoomList>}> </BaseLayout>} />
      </Routes>
    </Router>
  );
};

export default App;