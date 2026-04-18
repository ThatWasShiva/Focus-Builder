import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ComplianceReport } from './hooks/useComplianceTracker';

interface AppContextType {
  streakCount: number;
  totalFeetSaved: number;
  lastCalibrationDate: string | null;
  incrementStreak: () => void;
  updateFeetSaved: (sessionDurationSeconds: number) => void;
  addFeetSavedExplicit: (feet: number) => void;
  markCalibrationComplete: () => void;
  
  // Temporary session bridging
  complianceReport: ComplianceReport | null;
  setComplianceReport: React.Dispatch<React.SetStateAction<ComplianceReport | null>>;
  pendingFeetSeconds: number;
  setPendingFeetSeconds: React.Dispatch<React.SetStateAction<number>>;
  lastSessionMode: 'free' | 'task' | null;
  setLastSessionMode: React.Dispatch<React.SetStateAction<'free' | 'task' | null>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [streakCount, setStreakCount] = useState<number>(() => {
    const saved = localStorage.getItem('streakCount');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [totalFeetSaved, setTotalFeetSaved] = useState<number>(() => {
    const saved = localStorage.getItem('totalFeetSaved');
    return saved ? parseFloat(saved) : 0;
  });

  const [lastCalibrationDate, setLastCalibrationDate] = useState<string | null>(() => {
    return localStorage.getItem('lastCalibrationDate');
  });

  // Temporary state for crossing the Dichotomy bridge
  const [complianceReport, setComplianceReport] = useState<ComplianceReport | null>(null);
  const [pendingFeetSeconds, setPendingFeetSeconds] = useState<number>(0);
  const [lastSessionMode, setLastSessionMode] = useState<'free' | 'task' | null>(null);

  useEffect(() => {
    localStorage.setItem('streakCount', streakCount.toString());
  }, [streakCount]);

  useEffect(() => {
    localStorage.setItem('totalFeetSaved', totalFeetSaved.toString());
  }, [totalFeetSaved]);

  const incrementStreak = () => setStreakCount(prev => prev + 1);

  const updateFeetSaved = (sessionDurationSeconds: number) => {
    setTotalFeetSaved(prev => prev + (sessionDurationSeconds * 0.5));
  };

  const addFeetSavedExplicit = (feet: number) => {
    setTotalFeetSaved(prev => prev + feet);
  };

  const markCalibrationComplete = () => {
    const today = new Date().toDateString();
    setLastCalibrationDate(today);
    localStorage.setItem('lastCalibrationDate', today);
  };

  return (
    <AppContext.Provider value={{ 
      streakCount, totalFeetSaved, lastCalibrationDate, 
      incrementStreak, updateFeetSaved, addFeetSavedExplicit, markCalibrationComplete,
      complianceReport, setComplianceReport,
      pendingFeetSeconds, setPendingFeetSeconds,
      lastSessionMode, setLastSessionMode
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
