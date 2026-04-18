import { useRef, useCallback, useEffect } from 'react';

export const useAmbientSound = () => {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const initAudio = useCallback(() => {
    if (audioCtxRef.current) return;
    
    // @ts-ignore
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtxRef.current = new AudioContext();
    
    // Generate white noise buffer
    const bufferSize = 2 * audioCtxRef.current.sampleRate;
    const noiseBuffer = audioCtxRef.current.createBuffer(1, bufferSize, audioCtxRef.current.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    // Create a low-pass filter to make it "brown/rainy"
    const filter = audioCtxRef.current.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, audioCtxRef.current.currentTime);
    filter.Q.setValueAtTime(1, audioCtxRef.current.currentTime);

    gainNodeRef.current = audioCtxRef.current.createGain();
    gainNodeRef.current.gain.setValueAtTime(0, audioCtxRef.current.currentTime);

    filter.connect(gainNodeRef.current);
    gainNodeRef.current.connect(audioCtxRef.current.destination);

    const playLoop = () => {
      const source = audioCtxRef.current!.createBufferSource();
      source.buffer = noiseBuffer;
      source.loop = true;
      source.connect(filter);
      source.start();
      sourceRef.current = source;
    };

    playLoop();
  }, []);

  const play = useCallback(() => {
    initAudio();
    if (audioCtxRef.current && gainNodeRef.current) {
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      gainNodeRef.current.gain.linearRampToValueAtTime(0.05, audioCtxRef.current.currentTime + 2);
    }
  }, [initAudio]);

  const stop = useCallback(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.linearRampToValueAtTime(0, audioCtxRef.current.currentTime + 1);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  return { play, stop };
};
