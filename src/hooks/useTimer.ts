import { useState, useEffect } from 'react';

export const useTimer = (isActive: boolean) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, seconds]);

  const formattedTime = new Date(seconds * 1000).toISOString().substr(14, 5);

  return { seconds, formattedTime, setSeconds };
};
