import { useState, useEffect, useCallback, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGame, useGameActions } from '@/context/GameContext';
import { chapters } from '@/data/chapters';
import { BackgroundLayer } from './BackgroundLayer';
import { CGLayer } from './CGLayer';
import { NameBox } from './NameBox';
import { DialogueBox } from './DialogueBox';
import { ChoiceOverlay } from './ChoiceOverlay';
import { TransitionOverlay } from './TransitionOverlay';
import { GameMenu } from './GameMenu';
import { HistoryLog } from './HistoryLog';
import { GameControls } from './GameControls';
import { ChapterEnd } from './ChapterEnd';
import type { SceneNode } from '@/types/vn';

export function GameScreen() {
  const { state } = useGame();
  const {
    advanceScene,
    toggleAuto,
    toggleSkip,
    toggleMenu,
    toggleHistory,
    makeChoice,
    advanceChoiceResult,
    finishChoiceResult,
    returnToTitle,
    startChapter,
    completeChapter,
    hideNotification,
  } = useGameActions();

  const [currentBg, setCurrentBg] = useState<string | null>(null);
  const [currentCg, setCurrentCg] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionText, setTransitionText] = useState('');
  const [showChapterEnd, setShowChapterEnd] = useState(false);

  // Auto-hide notifications after 2 seconds
  useEffect(() => {
    if (state.notification) {
      const timer = setTimeout(() => {
        hideNotification();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state.notification, hideNotification]);

  const chapter = useMemo(
    () => chapters.find((c) => c.id === state.currentChapter),
    [state.currentChapter],
  );

  const currentNode: SceneNode | null = chapter
    ? chapter.scenes[state.currentSceneIndex] || null
    : null;

  // Handle background and CG changes as we advance through scenes
  useEffect(() => {
    if (!chapter) return;

    // Look backwards from current index to find the latest background
    let latestBg = currentBg;
    let latestCg = currentCg;
    for (let i = state.currentSceneIndex; i >= 0; i--) {
      const node = chapter.scenes[i];
      if (!node) continue;
      if (node.type === 'bg_change' && !latestBg) {
        latestBg = node.bg;
      }
      if (node.type === 'cg_show' && !latestCg) {
        latestCg = node.cg;
      }
      if (node.type === 'cg_hide' && latestCg === null) {
        latestCg = null;
      }
      // Inline bg/cg on regular nodes
      if ('bg' in node && node.bg && !latestBg) {
        latestBg = node.bg;
      }
      if ('cg' in node && node.cg !== undefined) {
        if (node.cg === null) latestCg = null;
        else latestCg = node.cg;
      }
      if (latestBg && latestCg !== undefined) break;
    }

    // Also check current node directly
    if (currentNode) {
      if (currentNode.type === 'bg_change') {
        latestBg = currentNode.bg;
      } else if (currentNode.type === 'cg_show') {
        latestCg = currentNode.cg;
      } else if (currentNode.type === 'cg_hide') {
        latestCg = null;
      }
    }

    if (latestBg !== undefined) setCurrentBg(latestBg || null);
    setCurrentCg(latestCg || null);

    // Handle transitions
    if (currentNode?.type === 'transition') {
      setTransitionText(currentNode.text);
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        advanceScene();
      }, 2000);
      return () => clearTimeout(timer);
    }

    // Auto-advance through bg_change, cg_show, cg_hide nodes
    if (
      currentNode?.type === 'bg_change' ||
      currentNode?.type === 'cg_show' ||
      currentNode?.type === 'cg_hide'
    ) {
      const timer = setTimeout(() => {
        advanceScene();
      }, 100);
      return () => clearTimeout(timer);
    }

    // Handle chapter end
    if (currentNode?.type === 'chapter_end') {
      setShowChapterEnd(true);
      completeChapter(state.currentChapter);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.currentSceneIndex, state.currentChapter]);

  const handleAdvance = useCallback(() => {
    if (isTransitioning || showChapterEnd) return;

    if (state.isPlayingChoiceResult) {
      const choiceNode = chapter?.scenes[state.currentSceneIndex];
      if (choiceNode?.type === 'choice') {
        if (state.choiceResultIndex + 1 >= choiceNode.result.length) {
          finishChoiceResult();
          advanceScene();
        } else {
          advanceChoiceResult();
        }
      }
    } else {
      advanceScene();
    }
  }, [
    isTransitioning,
    showChapterEnd,
    state.isPlayingChoiceResult,
    state.choiceResultIndex,
    chapter,
    advanceScene,
    advanceChoiceResult,
    finishChoiceResult,
  ]);

  const handleChoiceSelect = useCallback(
    (index: number) => {
      makeChoice(index);
      // Start playing the result immediately
      setTimeout(() => advanceChoiceResult(), 100);
    },
    [makeChoice, advanceChoiceResult],
  );

  const handleChapterEndContinue = useCallback(() => {
    setShowChapterEnd(false);
    const nextChapter = state.currentChapter + 1;
    if (nextChapter <= 2) {
      startChapter(nextChapter);
    } else {
      returnToTitle();
    }
  }, [state.currentChapter, startChapter, returnToTitle]);

  const handleCloseMenu = useCallback(() => {
    toggleMenu();
  }, [toggleMenu]);

  const handleCloseHistory = useCallback(() => {
    toggleHistory();
  }, [toggleHistory]);

  // Determine what to render
  const renderContent = () => {
    // Transition overlay
    if (isTransitioning) {
      return <TransitionOverlay text={transitionText} />;
    }

    // Chapter end
    if (showChapterEnd) {
      return <ChapterEnd chapter={state.currentChapter} onContinue={handleChapterEndContinue} />;
    }

    // Choice
    if (currentNode?.type === 'choice' && !state.isPlayingChoiceResult) {
      return (
        <ChoiceOverlay
          question={currentNode.question}
          options={currentNode.options}
          onSelect={handleChoiceSelect}
        />
      );
    }

    // Playing choice result
    if (state.isPlayingChoiceResult && chapter) {
      const choiceNode = chapter.scenes[state.currentSceneIndex];
      if (choiceNode?.type === 'choice') {
        const resultNode = choiceNode.result[state.choiceResultIndex];
        if (resultNode) {
          return (
            <>
              <NameBox name={resultNode.type === 'dialogue' ? resultNode.speaker : null} />
              <DialogueBox
                text={resultNode.text}
                isNarration={resultNode.type === 'narration'}
                speed={state.settings.textSpeed}
                isSkipMode={state.isSkipMode}
                isAutoMode={state.isAutoMode}
                onAdvance={handleAdvance}
              />
            </>
          );
        }
      }
    }

    // Regular narration/dialogue
    if (currentNode?.type === 'narration' || currentNode?.type === 'dialogue') {
      return (
        <>
          <NameBox name={currentNode.type === 'dialogue' ? currentNode.speaker : null} />
          <DialogueBox
            text={currentNode.text}
            isNarration={currentNode.type === 'narration'}
            speed={state.settings.textSpeed}
            isSkipMode={state.isSkipMode}
            isAutoMode={state.isAutoMode}
            onAdvance={handleAdvance}
          />
        </>
      );
    }

    // For bg_change, cg_show, cg_hide nodes - auto advance
    if (
      currentNode?.type === 'bg_change' ||
      currentNode?.type === 'cg_show' ||
      currentNode?.type === 'cg_hide'
    ) {
      return null;
    }

    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-[#FFF4E6]/50 italic">End of chapter</p>
      </div>
    );
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#1a1a2e]">
      {/* Background Layer */}
      <BackgroundLayer background={currentBg} />

      {/* CG Layer */}
      <CGLayer cg={currentCg} />

      {/* Vignette overlay */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(36,59,107,0.3)_100%)]" />

      {/* Game Controls (top bar) */}
      <GameControls
        isAutoMode={state.isAutoMode}
        isSkipMode={state.isSkipMode}
        onToggleAuto={toggleAuto}
        onToggleSkip={toggleSkip}
        onToggleMenu={toggleMenu}
      />

      {/* Dialogue Area */}
      <div className="absolute inset-x-0 bottom-0 z-20 px-3 pb-4 sm:px-8 sm:pb-6 md:px-16 md:pb-8">
        {renderContent()}
      </div>

      {/* Overlays */}
      <AnimatePresence>
        {state.showMenu && (
          <GameMenu
            onClose={handleCloseMenu}
            quickSave={state.quickSave}
            manualSlots={state.manualSlots}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {state.showHistory && <HistoryLog entries={state.history} onClose={handleCloseHistory} />}
      </AnimatePresence>

      {/* Notification */}
      <AnimatePresence>
        {state.notification && (
          <motion.div
            className="absolute left-1/2 top-4 z-50 -translate-x-1/2 rounded-lg bg-[#243B6B] px-4 py-2 text-sm font-medium text-[#F5A3B7] shadow-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {state.notification}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
