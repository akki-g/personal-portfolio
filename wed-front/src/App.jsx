import React, { useState, useEffect } from 'react'
import {BrowserRouter as Router, Routes, Route, useLocation} from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import RemoteAccess from './pages/RemoteAccess'
import PreLoader from './components/PreLoader'
import APIDebugger from './components/APIDebugger'
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
  const [debuggerOpen, setDebuggerOpen] = useState(false);

  // Global keyboard shortcut to open debugger (Ctrl+Shift+D)
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.shiftKey && event.code === 'KeyD') {
        event.preventDefault();
        setDebuggerOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

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
          
          {/* API Debugger */}
          <APIDebugger 
            isOpen={debuggerOpen}
            onClose={() => setDebuggerOpen(false)}
          />
          
          {/* Debug trigger button (only visible in development) */}
          {import.meta.env.DEV && (
            <button 
              onClick={() => setDebuggerOpen(true)}
              style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                background: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '50px',
                height: '50px',
                cursor: 'pointer',
                fontSize: '20px',
                zIndex: 1000,
                boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
              }}
              title="Open API Debugger (Ctrl+Shift+D)"
            >
              🔍
            </button>
          )}
      </Router>
  );
}

export default App;