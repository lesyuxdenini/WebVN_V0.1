import { motion } from 'framer-motion';

interface TransitionOverlayProps {
  text: string;
}

export function TransitionOverlay({ text }: TransitionOverlayProps) {
  return (
    <motion.div
      className="absolute inset-0 z-25 flex items-center justify-center bg-[#243B6B]/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className="mx-auto mb-4 h-px w-24 bg-[#F5A3B7]/50" />
        <p className="text-base font-medium tracking-wider text-[#FFF4E6]/80 sm:text-lg">
          {text}
        </p>
        <div className="mx-auto mt-4 h-px w-24 bg-[#F5A3B7]/50" />
      </motion.div>
    </motion.div>
  );
}
