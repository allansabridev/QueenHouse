import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Candidates from './pages/Candidates';
import Vote from './pages/Vote';
import Live from './pages/Live';
import Login from './pages/Login';
import Admin from './pages/Admin';
import { DataProvider } from './context/DataContext';

const App: React.FC = () => {
  return (
    <DataProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-[#050505] text-white font-sans selection:bg-pink-500 selection:text-white">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/candidates" element={<Candidates />} />
              <Route path="/vote" element={<Vote />} />
              <Route path="/live" element={<Live />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </DataProvider>
  );
};

export default App;
