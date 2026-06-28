import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

interface ChapterEndProps {
  chapter: number;
  onContinue: () => void;
}

export function ChapterEnd({ chapter, onContinue }: ChapterEndProps) {
  return (
    <motion.div
      className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#243B6B]/90 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Heart className="h-8 w-8 text-[#F5A3B7]" fill="#F5A3B7" />
        <h2 className="text-2xl font-bold text-[#FFF4E6] sm:text-3xl">
          Chapter {chapter} Complete
        </h2>
        {chapter < 2 ? (
          <p className="text-sm text-[#FFF4E6]/60">Chapter {chapter + 1} unlocked!</p>
        ) : (
          <p className="text-sm text-[#FFF4E6]/60">Thank you for playing Version 0.1</p>
        )}
        <motion.button
          className="mt-4 rounded-lg bg-[#F5A3B7] px-8 py-3 text-sm font-bold text-[#243B6B] shadow-lg transition-colors hover:bg-[#ffd1dc]"
          onClick={onContinue}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {chapter < 2 ? 'Continue' : 'Return to Title'}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
