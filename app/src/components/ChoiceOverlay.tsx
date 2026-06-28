import { motion } from 'framer-motion';

interface ChoiceOverlayProps {
  question: string;
  options: string[];
  onSelect: (index: number) => void;
}

export function ChoiceOverlay({ question, options, onSelect }: ChoiceOverlayProps) {
  return (
    <motion.div
      className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.p
        className="mb-8 max-w-lg text-center text-lg font-semibold text-[#FFF4E6] sm:text-xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {question}
      </motion.p>
      <div className="flex w-full max-w-md flex-col gap-3">
        {options.map((option, index) => (
          <motion.button
            key={index}
            className="rounded-lg border-2 border-[#F5A3B7]/50 bg-[#243B6B]/80 px-6 py-3 text-left text-sm font-medium text-[#FFF4E6] shadow-lg transition-colors hover:border-[#F5A3B7] hover:bg-[#243B6B] sm:text-base"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            onClick={() => onSelect(index)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {option}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
