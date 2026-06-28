import { motion } from 'framer-motion';
import { Play, BookOpen, Settings, Users } from 'lucide-react';
import { useGameActions } from '@/context/GameContext';
import { CherryBlossoms } from './CherryBlossoms';

export function TitleScreen() {
  const { startChapter, changeScreen } = useGameActions();

  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center overflow-hidden bg-[#243B6B]">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(245,163,183,0.15)_0%,_transparent_60%)]" />

      {/* Cherry blossom particles */}
      <CherryBlossoms count={35} />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-4">
        {/* Logo */}
        <motion.div
          className="w-72 sm:w-96 md:w-[28rem]"
          initial={{ opacity: 0, y: -30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <img
            src="/logo/title_screen_logo.jpg"
            alt="How to Make the Top Student Fall in Love"
            className="w-full drop-shadow-2xl"
          />
        </motion.div>

        {/* Tagline */}
        <motion.p
          className="text-center text-sm tracking-widest text-[#F5A3B7]/70 sm:text-base"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          A BL Visual Novel
        </motion.p>

        {/* Menu buttons */}
        <motion.div
          className="mt-4 flex w-full max-w-xs flex-col gap-2.5 sm:max-w-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <MenuButton
            icon={<Play size={18} />}
            label="Start Game"
            primary
            onClick={() => startChapter(1)}
          />
          <MenuButton
            icon={<BookOpen size={18} />}
            label="Chapters"
            onClick={() => changeScreen('chapter_select')}
          />
          <MenuButton
            icon={<Settings size={18} />}
            label="Settings"
            onClick={() => changeScreen('settings')}
          />
          <MenuButton
            icon={<Users size={18} />}
            label="Credits"
            onClick={() => changeScreen('credits')}
          />
        </motion.div>
      </div>

      {/* Bottom info */}
      <motion.p
        className="absolute bottom-4 z-10 text-xs text-[#FFF4E6]/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        Version 0.1
      </motion.p>
    </div>
  );
}

function MenuButton({
  icon,
  label,
  primary,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  primary?: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      className={`flex items-center justify-center gap-3 rounded-lg px-6 py-3 text-sm font-bold shadow-md transition-colors sm:text-base ${
        primary
          ? 'bg-[#F5A3B7] text-[#243B6B] hover:bg-[#ffd1dc]'
          : 'border border-[#FFF4E6]/20 bg-[#243B6B]/60 text-[#FFF4E6] backdrop-blur-sm hover:border-[#F5A3B7]/50 hover:bg-[#243B6B]/80'
      }`}
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      {icon}
      {label}
    </motion.button>
  );
}
