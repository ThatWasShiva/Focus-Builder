import React, { createContext, useContext, useEffect, useState } from 'react';

interface AppContextType {
  streakCount: number;
  totalFeetSaved: number;
  incrementStreak: () => void;
  updateFeetSaved: (sessionDurationSeconds: number) => void;
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

  return (
    <AppContext.Provider value={{ streakCount, totalFeetSaved, incrementStreak, updateFeetSaved }}>
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
