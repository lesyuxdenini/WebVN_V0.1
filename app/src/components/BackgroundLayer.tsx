import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface BackgroundLayerProps {
  background: string | null;
}

export function BackgroundLayer({ background }: BackgroundLayerProps) {
  const [currentBg, setCurrentBg] = useState<string | null>(null);
  const [previousBg, setPreviousBg] = useState<string | null>(null);
  const prevBgRef = useRef<string | null>(null);

  useEffect(() => {
    if (background && background !== prevBgRef.current) {
      setPreviousBg(prevBgRef.current);
      setCurrentBg(background);
      prevBgRef.current = background;
    }
  }, [background]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <AnimatePresence mode="sync">
        {previousBg && previousBg !== currentBg && (
          <motion.div
            key={`prev-${previousBg}`}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(/backgrounds/${previousBg})` }}
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          />
        )}
      </AnimatePresence>
      {currentBg && (
        <motion.div
          key={`curr-${currentBg}`}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(/backgrounds/${currentBg})` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        />
      )}
    </div>
  );
}
