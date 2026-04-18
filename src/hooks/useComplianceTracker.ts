import { useState, useEffect, useRef, useCallback } from 'react';

export interface ComplianceReport {
  complianceLevel: 'full' | 'partial' | 'none';
  violations: {
    visibility: number;
    touch: number;
  };
  totalViolations: number;
}

export const useComplianceTracker = (mode: 'free' | 'task', enabled: boolean = true) => {
  const [isTracking, setIsTracking] = useState(false);
  const [visibilityViolations, setVisibilityViolations] = useState(0);
  const [touchViolations, setTouchViolations] = useState(0);
  
  const visibilityRef = useRef(0);
  const touchRef = useRef(0);

  const startTracking = useCallback(() => {
    if (!enabled) return;
    setIsTracking(true);
    setVisibilityViolations(0);
    setTouchViolations(0);
    visibilityRef.current = 0;
    touchRef.current = 0;
  }, [enabled]);

  const stopTracking = useCallback(() => {
    setIsTracking(false);
  }, []);

  const getComplianceReport = useCallback((sessionEndedEarly: boolean): ComplianceReport => {
    const total = visibilityRef.current + touchRef.current;
    let level: 'full' | 'partial' | 'none' = 'full';

    if (sessionEndedEarly) {
      level = 'none';
    } else if (mode === 'free') {
      if (total === 0) level = 'full';
      else if (visibilityRef.current < 2 && touchRef.current <= 3) level = 'partial';
      else level = 'none';
    } else if (mode === 'task') {
      if (visibilityRef.current === 0) level = 'full';
      else level = 'none';
    }

    return {
      complianceLevel: level,
      violations: {
        visibility: visibilityRef.current,
        touch: touchRef.current
      },
      totalViolations: total
    };
  }, [mode]);

  useEffect(() => {
    if (!isTracking) return;

    const handleVisibility = () => {
      if (document.hidden) {
        visibilityRef.current += 1;
        setVisibilityViolations(prev => prev + 1);
      }
    };

    const handleTouch = () => {
      touchRef.current += 1;
      setTouchViolations(prev => prev + 1);
    };

    document.addEventListener('visibilitychange', handleVisibility);
    
    // In free mode, the user puts the phone face down and doesn't touch it.
    if (mode === 'free') {
      window.addEventListener('touchstart', handleTouch, { passive: true });
      window.addEventListener('mousedown', handleTouch, { passive: true });
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      if (mode === 'free') {
        window.removeEventListener('touchstart', handleTouch);
        window.removeEventListener('mousedown', handleTouch);
      }
    };
  }, [isTracking, mode]);

  return {
    startTracking,
    stopTracking,
    getComplianceReport,
    totalViolations: visibilityViolations + touchViolations
  };
};
