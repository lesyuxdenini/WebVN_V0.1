import { motion } from 'framer-motion';
import {
  Play,
  Save,
  Upload,
  Settings,
  BookOpen,
  Home,
  X,
  RotateCcw,
} from 'lucide-react';
import { useGameActions } from '@/context/GameContext';
import type { SaveSlot } from '@/types/vn';

interface GameMenuProps {
  onClose: () => void;
  quickSave: SaveSlot | null;
  manualSlots: (SaveSlot | null)[];
}

export function GameMenu({ onClose, quickSave, manualSlots }: GameMenuProps) {
  const {
    quickSave: doQuickSave,
    quickLoad: doQuickLoad,
    manualSave,
    manualLoad,
    toggleHistory,
    changeScreen,
    returnToTitle,
  } = useGameActions();

  return (
    <motion.div
      className="absolute inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-full max-w-sm rounded-xl border border-[#F5A3B7]/30 bg-[#243B6B]/95 p-6 shadow-2xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#FFF4E6]">Menu</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-[#FFF4E6]/60 transition-colors hover:bg-[#F5A3B7]/20 hover:text-[#FFF4E6]"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <button
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-left text-[#FFF4E6] transition-colors hover:bg-[#F5A3B7]/20"
            onClick={() => {
              onClose();
            }}
          >
            <Play size={18} />
            <span className="text-sm font-medium">Continue</span>
          </button>

          <button
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-left text-[#FFF4E6] transition-colors hover:bg-[#F5A3B7]/20"
            onClick={() => {
              doQuickSave();
              onClose();
            }}
          >
            <Save size={18} />
            <span className="text-sm font-medium">Quick Save</span>
          </button>

          <button
            className={`flex items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors ${
              quickSave
                ? 'text-[#FFF4E6] hover:bg-[#F5A3B7]/20'
                : 'cursor-not-allowed text-[#FFF4E6]/30'
            }`}
            onClick={() => {
              if (quickSave) {
                doQuickLoad();
                onClose();
              }
            }}
          >
            <Upload size={18} />
            <span className="text-sm font-medium">Quick Load</span>
          </button>

          <button
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-left text-[#FFF4E6] transition-colors hover:bg-[#F5A3B7]/20"
            onClick={() => {
              toggleHistory();
              onClose();
            }}
          >
            <BookOpen size={18} />
            <span className="text-sm font-medium">History Log</span>
          </button>

          <button
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-left text-[#FFF4E6] transition-colors hover:bg-[#F5A3B7]/20"
            onClick={() => {
              changeScreen('settings');
            }}
          >
            <Settings size={18} />
            <span className="text-sm font-medium">Settings</span>
          </button>

          <div className="my-1 border-t border-[#FFF4E6]/10" />

          <button
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-left text-[#FFF4E6] transition-colors hover:bg-[#F5A3B7]/20"
            onClick={() => {
              returnToTitle();
              onClose();
            }}
          >
            <Home size={18} />
            <span className="text-sm font-medium">Return to Title</span>
          </button>
        </div>

        {/* Manual Save Slots */}
        <div className="mt-4 border-t border-[#FFF4E6]/10 pt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#FFF4E6]/50">
            Save Slots
          </p>
          <div className="flex gap-2">
            {manualSlots.map((slot, i) => (
              <button
                key={i}
                className="flex flex-1 flex-col items-center rounded-lg bg-[#FFF4E6]/10 px-2 py-2 text-[#FFF4E6] transition-colors hover:bg-[#F5A3B7]/30"
                onClick={() => {
                  if (slot) {
                    manualLoad(i);
                  } else {
                    manualSave(i);
                  }
                  onClose();
                }}
              >
                <RotateCcw size={14} />
                <span className="mt-1 text-xs">{i + 1}</span>
                {slot && (
                  <span className="mt-0.5 text-[10px] text-[#F5A3B7]">
                    {new Date(slot.timestamp).toLocaleDateString()}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
