import { motion } from 'framer-motion';
import { ArrowLeft, Monitor, Trash2 } from 'lucide-react';
import { useGame, useGameActions } from '@/context/GameContext';
import { clearAllData } from '@/utils/storage';
import { useState } from 'react';

export function SettingsScreen() {
  const { state } = useGame();
  const { changeScreen, updateSettings } = useGameActions();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const textSpeedLabels = ['Slow', 'Normal', 'Fast', 'Faster', 'Instant'];
  const autoSpeedLabels = ['Slow', 'Normal', 'Fast', 'Faster', 'Fastest'];

  const handleClearData = () => {
    clearAllData();
    setShowClearConfirm(false);
    window.location.reload();
  };

  return (
    <div className="flex h-screen w-screen flex-col bg-[#243B6B]">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-[#FFF4E6]/10 px-4 py-3 sm:px-8">
        <button
          onClick={() => changeScreen('title')}
          className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-[#FFF4E6]/70 transition-colors hover:bg-[#F5A3B7]/20 hover:text-[#FFF4E6]"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <h1 className="text-lg font-bold text-[#FFF4E6]">Settings</h1>
      </div>

      {/* Settings content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-8">
        <div className="mx-auto max-w-lg space-y-6">
          {/* Text Speed */}
          <motion.div
            className="rounded-xl border border-[#FFF4E6]/10 bg-[#FFF4E6]/5 p-4 sm:p-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <label className="mb-3 block text-sm font-bold text-[#FFF4E6]">
              Text Speed: {textSpeedLabels[state.settings.textSpeed - 1]}
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={state.settings.textSpeed}
              onChange={(e) => updateSettings({ textSpeed: parseInt(e.target.value) })}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-[#FFF4E6]/10 accent-[#F5A3B7]"
            />
            <div className="mt-1 flex justify-between text-[10px] text-[#FFF4E6]/40">
              <span>Slow</span>
              <span>Instant</span>
            </div>
          </motion.div>

          {/* Auto Speed */}
          <motion.div
            className="rounded-xl border border-[#FFF4E6]/10 bg-[#FFF4E6]/5 p-4 sm:p-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <label className="mb-3 block text-sm font-bold text-[#FFF4E6]">
              Auto Mode Speed: {autoSpeedLabels[state.settings.autoSpeed - 1]}
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={state.settings.autoSpeed}
              onChange={(e) => updateSettings({ autoSpeed: parseInt(e.target.value) })}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-[#FFF4E6]/10 accent-[#F5A3B7]"
            />
            <div className="mt-1 flex justify-between text-[10px] text-[#FFF4E6]/40">
              <span>Slow</span>
              <span>Fastest</span>
            </div>
          </motion.div>

          {/* Skip Unread */}
          <motion.div
            className="flex items-center justify-between rounded-xl border border-[#FFF4E6]/10 bg-[#FFF4E6]/5 p-4 sm:p-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div>
              <p className="text-sm font-bold text-[#FFF4E6]">Skip Unread Text</p>
              <p className="text-xs text-[#FFF4E6]/50">Allow skipping unread dialogue</p>
            </div>
            <button
              onClick={() => updateSettings({ skipUnread: !state.settings.skipUnread })}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                state.settings.skipUnread ? 'bg-[#F5A3B7]' : 'bg-[#FFF4E6]/20'
              }`}
            >
              <span
                className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  state.settings.skipUnread ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </motion.div>

          {/* Fullscreen */}
          <motion.div
            className="flex items-center justify-between rounded-xl border border-[#FFF4E6]/10 bg-[#FFF4E6]/5 p-4 sm:p-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="flex items-center gap-3">
              <Monitor size={18} className="text-[#FFF4E6]/50" />
              <div>
                <p className="text-sm font-bold text-[#FFF4E6]">Fullscreen</p>
                <p className="text-xs text-[#FFF4E6]/50">Toggle fullscreen mode</p>
              </div>
            </div>
            <button
              onClick={() => {
                const newVal = !state.settings.fullscreen;
                updateSettings({ fullscreen: newVal });
                if (newVal) {
                  document.documentElement.requestFullscreen();
                } else {
                  document.exitFullscreen();
                }
              }}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                state.settings.fullscreen ? 'bg-[#F5A3B7]' : 'bg-[#FFF4E6]/20'
              }`}
            >
              <span
                className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  state.settings.fullscreen ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </motion.div>

          {/* Clear Data */}
          <motion.div
            className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 sm:p-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trash2 size={18} className="text-red-400/70" />
                <div>
                  <p className="text-sm font-bold text-red-300">Clear All Data</p>
                  <p className="text-xs text-red-300/50">Reset all progress and saves</p>
                </div>
              </div>
              <button
                onClick={() => setShowClearConfirm(true)}
                className="rounded-lg bg-red-500/20 px-4 py-2 text-xs font-bold text-red-300 transition-colors hover:bg-red-500/30"
              >
                Clear
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Clear confirmation */}
      {showClearConfirm && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-sm rounded-xl border border-red-500/30 bg-[#243B6B] p-6 shadow-2xl">
            <h3 className="mb-2 text-lg font-bold text-red-300">Clear All Data?</h3>
            <p className="mb-4 text-sm text-[#FFF4E6]/60">
              This will erase all save data, progress, and settings. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 rounded-lg bg-[#FFF4E6]/10 px-4 py-2.5 text-sm font-bold text-[#FFF4E6] transition-colors hover:bg-[#FFF4E6]/20"
              >
                Cancel
              </button>
              <button
                onClick={handleClearData}
                className="flex-1 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-red-600"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
