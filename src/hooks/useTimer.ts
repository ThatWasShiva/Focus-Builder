import { useState, useEffect } from 'react';

export const useTimer = (isActive: boolean, initialSeconds: number = 0, isCountdown: boolean = false) => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(seconds => {
          if (isCountdown) {
            if (seconds <= 0) return 0;
            return seconds - 1;
          }
          return seconds + 1;
        });
      }, 1000);
    } else if (!isActive && seconds !== initialSeconds) {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, seconds]);

  const formattedTime = new Date(seconds * 1000).toISOString().substr(14, 5);

  return { seconds, formattedTime, setSeconds };
};
