import { useCallback } from 'react';

export const useSound = () => {
  const playBloop = useCallback(() => {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // 440 Hz
    oscillator.frequency.exponentialRampToValueAtTime(110, audioCtx.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.1);

    setTimeout(() => {
      audioCtx.close();
    }, 150);
  }, []);

  const playChime = useCallback(() => {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator1 = audioCtx.createOscillator();
    const oscillator2 = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator1.type = 'sine';
    oscillator1.frequency.setValueAtTime(880, audioCtx.currentTime); // A5

    oscillator2.type = 'triangle';
    oscillator2.frequency.setValueAtTime(1760, audioCtx.currentTime); // A6 (harmonic)

    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.05); // Attack
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.5); // Long decay

    oscillator1.connect(gainNode);
    oscillator2.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator1.start();
    oscillator2.start();

    oscillator1.stop(audioCtx.currentTime + 1.5);
    oscillator2.stop(audioCtx.currentTime + 1.5);

    setTimeout(() => {
      audioCtx.close();
    }, 1600);
  }, []);

  return { playBloop, playChime };
};
