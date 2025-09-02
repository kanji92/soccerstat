import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import bg from './assets/pole.jpg'; // фон

// Импорты страниц
import Leagues from './pages/Leagues';
import LeagueMatches from './pages/LeagueMatches';
import Teams from './pages/Teams';
import TeamMatches from './pages/TeamMatches';

function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <Router>
        <main>
          <Routes>
            <Route path="/" element={<Leagues />} />
            <Route path="/league/:id" element={<LeagueMatches />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/team/:id" element={<TeamMatches />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;
