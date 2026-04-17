import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AppProvider } from './AppContext';
import { Dashboard } from './pages/Dashboard';
import { Calibration } from './pages/Calibration';
import { FocusSession } from './pages/FocusSession';
import { Dichotomy } from './pages/Dichotomy';
import { Result } from './pages/Result';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/calibrate" element={<Calibration />} />
        <Route path="/focus" element={<FocusSession />} />
        <Route path="/dichotomy" element={<Dichotomy />} />
        <Route path="/result" element={<Result />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <AppProvider>
      <div className="bg-black min-h-screen text-on-surface">
        <AnimatedRoutes />
      </div>
    </AppProvider>
  );
}

export default App;
