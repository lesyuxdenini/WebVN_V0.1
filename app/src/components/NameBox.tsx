import { motion, AnimatePresence } from 'framer-motion';

interface NameBoxProps {
  name: string | null;
}

const nameColors: Record<string, string> = {
  'SEO-JUN': 'bg-[#243B6B] text-white',
  'HAN YU': 'bg-[#F5A3B7] text-[#243B6B]',
  'MIN-HO': 'bg-[#8B9DC3] text-white',
  'SUN-WOO': 'bg-[#7EC8A0] text-[#243B6B]',
  'FRIEND 1': 'bg-[#B8C5D6] text-[#243B6B]',
  'FRIEND 2': 'bg-[#B8C5D6] text-[#243B6B]',
  'STUDENT A': 'bg-[#B8C5D6] text-[#243B6B]',
  'STUDENT B': 'bg-[#B8C5D6] text-[#243B6B]',
  'STUDENT C': 'bg-[#B8C5D6] text-[#243B6B]',
  'STUDENT D': 'bg-[#B8C5D6] text-[#243B6B]',
  'FRIENDS': 'bg-[#B8C5D6] text-[#243B6B]',
};

export function NameBox({ name }: NameBoxProps) {
  const colorClass = name ? (nameColors[name] || 'bg-[#8B9DC3] text-white') : '';

  return (
    <div className="pointer-events-none mb-1 flex h-9 items-end sm:h-10">
      <AnimatePresence mode="wait">
        {name && (
          <motion.div
            key={name}
            className={`rounded-t-lg px-4 py-1 text-sm font-bold shadow-md sm:px-6 sm:text-base ${colorClass}`}
            initial={{ opacity: 0, y: 10, scaleX: 0.8 }}
            animate={{ opacity: 1, y: 0, scaleX: 1 }}
            exit={{ opacity: 0, y: 5, scaleX: 0.9 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            style={{ transformOrigin: 'left bottom' }}
          >
            {name}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
