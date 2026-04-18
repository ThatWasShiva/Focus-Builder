import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AppProvider } from './AppContext';
import { LimitsProvider } from './context/LimitsContext';
import { Dashboard } from './pages/Dashboard';
import { Calibration } from './pages/Calibration';
import { ModeSelection } from './pages/ModeSelection';
import { FocusSession } from './pages/FocusSession';
import { TaskSession } from './pages/TaskSession';
import { Dichotomy } from './pages/Dichotomy';
import { Result } from './pages/Result';
import { LimitsConfig } from './pages/LimitsConfig';
import { ZipGame } from './components/game/ZipGame';
import { InterceptOverlay } from './components/InterceptOverlay';
import { useInterceptOnResume } from './hooks/useInterceptOnResume';
import { useLimits } from './context/LimitsContext';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/calibrate" element={<Calibration />} />
        <Route path="/mode" element={<ModeSelection />} />
        <Route path="/focus" element={<FocusSession />} />
        <Route path="/task-focus" element={<TaskSession />} />
        <Route path="/dichotomy" element={<Dichotomy />} />
        <Route path="/result" element={<Result />} />
        <Route path="/limits" element={<LimitsConfig />} />
        <Route path="/game/:mode" element={<ZipGame />} />
      </Routes>
    </AnimatePresence>
  );
}

// Inner component so it can access LimitsContext
function AppWithIntercept() {
  const { monitoredApps } = useLimits();
  const { interceptedApp, dismissIntercept } = useInterceptOnResume(monitoredApps);

  return (
    <div className="bg-black min-h-screen text-on-surface">
      <AnimatedRoutes />
      <InterceptOverlay app={interceptedApp} onDismiss={dismissIntercept} />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <LimitsProvider>
        <AppWithIntercept />
      </LimitsProvider>
    </AppProvider>
  );
}

export default App;
