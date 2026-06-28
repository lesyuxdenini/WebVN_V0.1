import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useRef, useEffect } from 'react';
import type { HistoryEntry } from '@/types/vn';

interface HistoryLogProps {
  entries: HistoryEntry[];
  onClose: () => void;
}

export function HistoryLog({ entries, onClose }: HistoryLogProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries]);

  return (
    <motion.div
      className="absolute inset-0 z-40 flex flex-col bg-[#243B6B]/95 backdrop-blur-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <div className="flex items-center justify-between border-b border-[#FFF4E6]/10 px-4 py-3 sm:px-6">
        <h2 className="text-base font-bold text-[#FFF4E6] sm:text-lg">Dialogue History</h2>
        <button
          onClick={onClose}
          className="rounded-lg p-1 text-[#FFF4E6]/60 transition-colors hover:bg-[#F5A3B7]/20 hover:text-[#FFF4E6]"
        >
          <X size={20} />
        </button>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
        {entries.length === 0 ? (
          <p className="text-center text-sm text-[#FFF4E6]/40 italic">No dialogue yet...</p>
        ) : (
          <div className="flex flex-col gap-3">
            {entries.map((entry, i) => (
              <div key={i} className="rounded-lg bg-[#FFF4E6]/5 px-4 py-3">
                {entry.speaker && (
                  <p className="mb-1 text-xs font-bold text-[#F5A3B7] sm:text-sm">
                    {entry.speaker}
                  </p>
                )}
                <p
                  className={`text-sm leading-relaxed text-[#FFF4E6]/90 sm:text-base ${
                    !entry.speaker ? 'italic text-[#FFF4E6]/70' : ''
                  }`}
                >
                  {entry.text}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
