import { lazy, Suspense, useEffect, useLayoutEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import APIDebugger from './components/APIDebugger';
import Home from './pages/Home';
import Projects from './pages/Projects';
import About from './pages/About';
import './App.css';

const RemoteAccess = lazy(() => import('./pages/RemoteAccess'));

function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    const resetScroll = () => window.scrollTo(0, 0);
    resetScroll();
    const frame = window.requestAnimationFrame(resetScroll);
    const timeout = window.setTimeout(resetScroll, 80);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
    };
  }, [pathname]);

  return null;
}

function App() {
  const [debuggerOpen, setDebuggerOpen] = useState(false);

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
      <ScrollToTop />
      <div className="page-container">
        <Header />
        <main id="main-content" className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/about" element={<About />} />
            <Route
              path="/remote"
              element={(
                <Suspense fallback={<div className="route-loading">Loading secure workspace…</div>}>
                  <RemoteAccess />
                </Suspense>
              )}
            />
          </Routes>
        </main>
        <Footer />
      </div>

      <APIDebugger isOpen={debuggerOpen} onClose={() => setDebuggerOpen(false)} />
    </Router>
  );
}

export default App;
