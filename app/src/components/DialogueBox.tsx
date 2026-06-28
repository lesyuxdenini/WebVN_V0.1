import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTypewriter } from '@/hooks/useTypewriter';

interface DialogueBoxProps {
  text: string;
  isNarration: boolean;
  speed: number;
  isSkipMode: boolean;
  isAutoMode: boolean;
  onComplete?: () => void;
  onAdvance: () => void;
}

export function DialogueBox({
  text,
  isNarration,
  speed,
  isSkipMode,
  isAutoMode,
  onComplete,
  onAdvance,
}: DialogueBoxProps) {
  const [hasCompleted, setHasCompleted] = useState(false);

  const handleComplete = useCallback(() => {
    setHasCompleted(true);
    onComplete?.();
  }, [onComplete]);

  const { displayedText, isComplete, skipToEnd } = useTypewriter({
    text,
    speed,
    isSkipMode,
    onComplete: handleComplete,
  });

  useEffect(() => {
    setHasCompleted(false);
  }, [text]);

  useEffect(() => {
    if (isAutoMode && isComplete && hasCompleted) {
      const timer = setTimeout(() => {
        onAdvance();
      }, (6 - speed) * 400 + 500);
      return () => clearTimeout(timer);
    }
  }, [isAutoMode, isComplete, hasCompleted, onAdvance, speed]);

  const handleClick = useCallback(() => {
    if (!isComplete) {
      skipToEnd();
    } else {
      onAdvance();
    }
  }, [isComplete, skipToEnd, onAdvance]);

  return (
    <motion.div
      className="relative cursor-pointer rounded-lg border-2 border-[#243B6B]/30 bg-[#243B6B]/90 px-5 py-4 shadow-2xl backdrop-blur-sm sm:px-8 sm:py-5"
      onClick={handleClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className={`min-h-[3rem] text-base leading-relaxed sm:text-lg sm:leading-relaxed ${
          isNarration
            ? 'italic text-[#FFF4E6]/80'
            : 'font-medium text-[#FFF4E6]'
        }`}
      >
        {displayedText}
        {!isComplete && (
          <span className="ml-0.5 inline-block h-5 w-0.5 animate-pulse bg-[#F5A3B7]" />
        )}
      </div>
      {isComplete && (
        <motion.div
          className="absolute bottom-2 right-3 sm:bottom-3 sm:right-5"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="h-0 w-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#F5A3B7]" />
        </motion.div>
      )}
    </motion.div>
  );
}
