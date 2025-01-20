import React, { useState } from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import PreLoader from './components/PreLoader'
import './App.css'

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
                  </Routes>
              </main>
              <Footer />
          </div>
      </Router>
  );
}

export default App;