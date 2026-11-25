import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import APIDebugger from './components/APIDebugger';
import Experience from './pages/Experience';
import Home from './pages/Home';

const RemoteAccess = lazy(() => import('./pages/RemoteAccess'));

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
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/experience" element={<Experience />} />
        {/* Old URLs from the previous version of the site. */}
        <Route path="/projects" element={<Navigate to="/experience#projects" replace />} />
        <Route path="/about" element={<Navigate to="/" replace />} />
        <Route
          path="/remote"
          element={(
            <Suspense fallback={<div className="route-loading">Loading secure workspace…</div>}>
              <RemoteAccess />
            </Suspense>
          )}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <APIDebugger isOpen={debuggerOpen} onClose={() => setDebuggerOpen(false)} />
    </Router>
  );
}

export default App;
