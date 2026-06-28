import { useState, useEffect, useRef, useCallback } from 'react';

interface UseTypewriterOptions {
  text: string;
  speed: number;
  isSkipMode: boolean;
  onComplete?: () => void;
}

export function useTypewriter({ text, speed, isSkipMode, onComplete }: UseTypewriterOptions) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const indexRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const instantDelay = speed >= 5 ? 5 : 0;
  const charDelay = speed >= 5 ? 5 : speed <= 1 ? 80 : speed === 2 ? 50 : speed === 3 ? 30 : 15;

  useEffect(() => {
    setDisplayedText('');
    setIsComplete(false);
    indexRef.current = 0;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (isSkipMode) {
      setDisplayedText(text);
      setIsComplete(true);
      onCompleteRef.current?.();
      return;
    }

    if (speed >= 5) {
      setDisplayedText(text);
      const timeout = setTimeout(() => {
        setIsComplete(true);
        onCompleteRef.current?.();
      }, instantDelay);
      return () => clearTimeout(timeout);
    }

    intervalRef.current = setInterval(() => {
      indexRef.current += 1;
      setDisplayedText(text.slice(0, indexRef.current));

      if (indexRef.current >= text.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsComplete(true);
        onCompleteRef.current?.();
      }
    }, charDelay);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, speed, isSkipMode, charDelay, instantDelay]);

  const skipToEnd = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setDisplayedText(text);
    setIsComplete(true);
    onCompleteRef.current?.();
  }, [text]);

  return { displayedText, isComplete, skipToEnd };
}
