import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import Navbar from './components/layout/Navbar';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
        <Navbar />
        <Routes>
          <Route path="/" element={<DashboardPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
