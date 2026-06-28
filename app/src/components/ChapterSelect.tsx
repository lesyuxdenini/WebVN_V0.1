import { motion } from 'framer-motion';
import { ArrowLeft, Lock, Clock } from 'lucide-react';
import { useGame, useGameActions } from '@/context/GameContext';
import { chapters } from '@/data/chapters';

export function ChapterSelect() {
  const { state } = useGame();
  const { startChapter, changeScreen } = useGameActions();

  const handleSelectChapter = (chapterId: number) => {
    if (state.progress.unlockedChapters.includes(chapterId) && chapterId <= 2) {
      startChapter(chapterId);
    }
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
        <h1 className="text-lg font-bold text-[#FFF4E6]">Chapter Select</h1>
      </div>

      {/* Chapter Grid */}
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-8">
        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2">
          {chapters.map((chapter, index) => {
            const isUnlocked = state.progress.unlockedChapters.includes(chapter.id);
            const isCompleted = state.progress.completedChapters.includes(chapter.id);
            const isPlayable = isUnlocked && !chapter.comingSoon;

            return (
              <motion.button
                key={chapter.id}
                className={`relative flex items-start gap-4 rounded-xl border p-4 text-left transition-all ${
                  isPlayable
                    ? 'border-[#F5A3B7]/30 bg-[#FFF4E6]/5 hover:border-[#F5A3B7]/60 hover:bg-[#FFF4E6]/10'
                    : 'cursor-not-allowed border-[#FFF4E6]/5 bg-[#FFF4E6]/[0.02]'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleSelectChapter(chapter.id)}
                whileHover={isPlayable ? { scale: 1.02 } : {}}
                whileTap={isPlayable ? { scale: 0.98 } : {}}
              >
                {/* Chapter number */}
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-lg font-bold sm:h-14 sm:w-14 sm:text-xl ${
                    isPlayable
                      ? isCompleted
                        ? 'bg-[#7EC8A0]/20 text-[#7EC8A0]'
                        : 'bg-[#F5A3B7]/20 text-[#F5A3B7]'
                      : 'bg-[#FFF4E6]/5 text-[#FFF4E6]/20'
                  }`}
                >
                  {chapter.comingSoon ? (
                    <Clock size={20} />
                  ) : !isUnlocked ? (
                    <Lock size={20} />
                  ) : (
                    chapter.id
                  )}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-sm font-bold sm:text-base ${
                      isPlayable ? 'text-[#FFF4E6]' : 'text-[#FFF4E6]/30'
                    }`}
                  >
                    {chapter.title}
                  </p>
                  <p
                    className={`mt-0.5 text-xs sm:text-sm ${
                      isPlayable ? 'text-[#FFF4E6]/60' : 'text-[#FFF4E6]/20'
                    }`}
                  >
                    {chapter.comingSoon ? 'Coming Soon' : chapter.subtitle}
                  </p>
                  {isCompleted && (
                    <span className="mt-1 inline-block rounded-full bg-[#7EC8A0]/20 px-2 py-0.5 text-[10px] font-bold text-[#7EC8A0]">
                      COMPLETED
                    </span>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
