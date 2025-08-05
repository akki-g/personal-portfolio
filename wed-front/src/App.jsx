import React, { useState, useEffect } from 'react'
import {BrowserRouter as Router, Routes, Route, useLocation} from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import RemoteAccess from './pages/RemoteAccess'
import PreLoader from './components/PreLoader'
import './App.css'

// Component to scroll to top on route changes
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
      <Router>
        <PreLoader />
          <div className="page-container">
              <Header />
              <main className="main-content">
                  <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/remote" element={<RemoteAccess />} />
                  </Routes>
              </main>
              <Footer />
          </div>
      </Router>
  );
}

export default App;