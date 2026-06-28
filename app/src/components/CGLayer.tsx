import { AnimatePresence, motion } from 'framer-motion';

interface CGLayerProps {
  cg: string | null;
}

export function CGLayer({ cg }: CGLayerProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        {cg && (
          <motion.img
            key={cg}
            src={`/cgs/${cg}`}
            alt="CG"
            className="max-h-full max-w-full object-contain"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
