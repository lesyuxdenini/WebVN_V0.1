import { motion } from 'framer-motion';
import { FastForward, Pause, Menu } from 'lucide-react';

interface GameControlsProps {
  isAutoMode: boolean;
  isSkipMode: boolean;
  onToggleAuto: () => void;
  onToggleSkip: () => void;
  onToggleMenu: () => void;
}

export function GameControls({
  isAutoMode,
  isSkipMode,
  onToggleAuto,
  onToggleSkip,
  onToggleMenu,
}: GameControlsProps) {
  return (
    <motion.div
      className="absolute right-2 top-2 z-30 flex items-center gap-1 sm:right-4 sm:top-4 sm:gap-2"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <button
        onClick={onToggleAuto}
        className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold transition-colors sm:h-9 sm:w-9 ${
          isAutoMode
            ? 'bg-[#F5A3B7] text-[#243B6B]'
            : 'bg-[#243B6B]/60 text-[#FFF4E6]/70 hover:bg-[#243B6B]/80 hover:text-[#FFF4E6]'
        }`}
        title="Auto"
      >
        {isAutoMode ? <Pause size={16} /> : 'A'}
      </button>
      <button
        onClick={onToggleSkip}
        className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold transition-colors sm:h-9 sm:w-9 ${
          isSkipMode
            ? 'bg-[#F5A3B7] text-[#243B6B]'
            : 'bg-[#243B6B]/60 text-[#FFF4E6]/70 hover:bg-[#243B6B]/80 hover:text-[#FFF4E6]'
        }`}
        title="Skip"
      >
        {isSkipMode ? <Pause size={16} /> : <FastForward size={16} />}
      </button>
      <button
        onClick={onToggleMenu}
        className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#243B6B]/60 text-[#FFF4E6]/70 transition-colors hover:bg-[#243B6B]/80 hover:text-[#FFF4E6] sm:h-9 sm:w-9"
        title="Menu"
      >
        <Menu size={16} />
      </button>
    </motion.div>
  );
}
