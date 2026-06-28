import { createContext, useContext, useReducer, useCallback, type ReactNode } from 'react';
import type { GameState, GameAction, SaveSlot, GameScreen } from '@/types/vn';
import { chapters } from '@/data/chapters';
import {
  loadSettings,
  saveSettings,
  loadProgress,
  saveProgress,
  loadAutoSave,
  saveAutoSave,
  loadQuickSave,
  saveQuickSave,
  loadManualSlots,
  saveManualSlots,
} from '@/utils/storage';

const initialState: GameState = {
  currentScreen: 'title',
  currentChapter: 1,
  currentSceneIndex: 0,
  isAutoMode: false,
  isSkipMode: false,
  showHistory: false,
  showMenu: false,
  settings: loadSettings(),
  progress: loadProgress(),
  autoSave: loadAutoSave(),
  quickSave: loadQuickSave(),
  manualSlots: loadManualSlots(),
  history: [],
  notification: null,
  choiceResultIndex: 0,
  isPlayingChoiceResult: false,
};

function createSaveSlot(state: GameState): SaveSlot {
  const chapter = chapters.find((c) => c.id === state.currentChapter);
  return {
    chapter: state.currentChapter,
    sceneIndex: state.currentSceneIndex,
    timestamp: Date.now(),
    chapterName: chapter?.title || `Chapter ${state.currentChapter}`,
    sceneDescription: `Scene ${state.currentSceneIndex + 1}`,
  };
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_CHAPTER': {
      const chapter = chapters.find((c) => c.id === action.chapter);
      if (!chapter || chapter.comingSoon) return state;
      return {
        ...state,
        currentScreen: 'game' as GameScreen,
        currentChapter: action.chapter,
        currentSceneIndex: 0,
        isAutoMode: false,
        isSkipMode: false,
        showHistory: false,
        showMenu: false,
        history: [],
        choiceResultIndex: 0,
        isPlayingChoiceResult: false,
      };
    }

    case 'ADVANCE_SCENE': {
      if (state.isPlayingChoiceResult) return state;

      const chapter = chapters.find((c) => c.id === state.currentChapter);
      if (!chapter) return state;

      const nextIndex = state.currentSceneIndex + 1;

      if (nextIndex >= chapter.scenes.length) {
        return {
          ...state,
          currentSceneIndex: nextIndex,
          isAutoMode: false,
        };
      }

      const nextNode = chapter.scenes[nextIndex];
      const nodeKey = `${state.currentChapter}:${nextIndex}`;
      const isSeen = state.progress.seenNodes[nodeKey] || false;

      const newHistory =
        nextNode.type === 'dialogue'
          ? [...state.history, { speaker: nextNode.speaker, text: nextNode.text, timestamp: Date.now() }]
          : nextNode.type === 'narration'
            ? [...state.history, { text: nextNode.text, timestamp: Date.now() }]
            : state.history;

      const shouldAutoAdvance =
        state.isSkipMode && (state.settings.skipUnread || isSeen) && nextNode.type !== 'choice';

      const autoSaveSlot = createSaveSlot({ ...state, currentSceneIndex: nextIndex });
      saveAutoSave(autoSaveSlot);

      return {
        ...state,
        currentSceneIndex: nextIndex,
        history: newHistory,
        autoSave: autoSaveSlot,
        progress: {
          ...state.progress,
          seenNodes: { ...state.progress.seenNodes, [nodeKey]: true },
        },
        isAutoMode: shouldAutoAdvance ? state.isAutoMode : false,
      };
    }

    case 'SET_SCENE_INDEX': {
      const chapter = chapters.find((c) => c.id === state.currentChapter);
      if (!chapter) return state;
      const safeIndex = Math.max(0, Math.min(action.index, chapter.scenes.length - 1));
      return {
        ...state,
        currentSceneIndex: safeIndex,
        choiceResultIndex: 0,
        isPlayingChoiceResult: false,
      };
    }

    case 'TOGGLE_AUTO':
      return {
        ...state,
        isAutoMode: !state.isAutoMode,
        isSkipMode: false,
      };

    case 'TOGGLE_SKIP':
      return {
        ...state,
        isSkipMode: !state.isSkipMode,
        isAutoMode: false,
      };

    case 'MAKE_CHOICE': {
      return {
        ...state,
        choiceResultIndex: 0,
        isPlayingChoiceResult: true,
      };
    }

    case 'ADVANCE_CHOICE_RESULT': {
      const chapter = chapters.find((c) => c.id === state.currentChapter);
      if (!chapter) return state;

      const currentNode = chapter.scenes[state.currentSceneIndex];
      if (currentNode.type !== 'choice') return state;

      const nextResultIndex = state.choiceResultIndex + 1;

      if (nextResultIndex >= currentNode.result.length) {
        return {
          ...state,
          choiceResultIndex: nextResultIndex,
        };
      }

      const resultNode = currentNode.result[nextResultIndex];
      const newHistory =
        resultNode.type === 'dialogue'
          ? [...state.history, { speaker: resultNode.speaker, text: resultNode.text, timestamp: Date.now() }]
          : [...state.history, { text: resultNode.text, timestamp: Date.now() }];

      return {
        ...state,
        choiceResultIndex: nextResultIndex,
        history: newHistory,
      };
    }

    case 'FINISH_CHOICE_RESULT': {
      return {
        ...state,
        isPlayingChoiceResult: false,
        choiceResultIndex: 0,
      };
    }

    case 'TOGGLE_HISTORY':
      return { ...state, showHistory: !state.showHistory, showMenu: false };

    case 'TOGGLE_MENU':
      return { ...state, showMenu: !state.showMenu };

    case 'CHANGE_SCREEN':
      return {
        ...state,
        currentScreen: action.screen,
        showHistory: false,
        showMenu: false,
        isAutoMode: false,
        isSkipMode: false,
      };

    case 'UPDATE_SETTINGS': {
      const newSettings = { ...state.settings, ...action.settings };
      saveSettings(newSettings);
      return { ...state, settings: newSettings };
    }

    case 'QUICK_SAVE': {
      const slot = createSaveSlot(state);
      saveQuickSave(slot);
      return { ...state, quickSave: slot, notification: 'Quick saved!' };
    }

    case 'QUICK_LOAD': {
      const slot = loadQuickSave();
      if (!slot) {
        return { ...state, notification: 'No quick save data!' };
      }
      const chapter = chapters.find((c) => c.id === slot.chapter);
      if (!chapter) return { ...state, notification: 'Save data corrupted!' };
      return {
        ...state,
        currentChapter: slot.chapter,
        currentSceneIndex: slot.sceneIndex,
        currentScreen: 'game',
        choiceResultIndex: 0,
        isPlayingChoiceResult: false,
        isAutoMode: false,
        isSkipMode: false,
        showHistory: false,
        showMenu: false,
        notification: 'Quick loaded!',
      };
    }

    case 'MANUAL_SAVE': {
      const slot = createSaveSlot(state);
      const newSlots = [...state.manualSlots];
      newSlots[action.slot] = slot;
      saveManualSlots(newSlots);
      return { ...state, manualSlots: newSlots, notification: `Saved to Slot ${action.slot + 1}!` };
    }

    case 'MANUAL_LOAD': {
      const slot = state.manualSlots[action.slot];
      if (!slot) {
        return { ...state, notification: `Slot ${action.slot + 1} is empty!` };
      }
      const chapter = chapters.find((c) => c.id === slot.chapter);
      if (!chapter) return { ...state, notification: 'Save data corrupted!' };
      return {
        ...state,
        currentChapter: slot.chapter,
        currentSceneIndex: slot.sceneIndex,
        currentScreen: 'game',
        choiceResultIndex: 0,
        isPlayingChoiceResult: false,
        isAutoMode: false,
        isSkipMode: false,
        showHistory: false,
        showMenu: false,
        notification: `Loaded from Slot ${action.slot + 1}!`,
      };
    }

    case 'UNLOCK_CHAPTER': {
      if (state.progress.unlockedChapters.includes(action.chapter)) return state;
      const newProgress = {
        ...state.progress,
        unlockedChapters: [...state.progress.unlockedChapters, action.chapter],
      };
      saveProgress(newProgress);
      return { ...state, progress: newProgress, notification: `Chapter ${action.chapter} unlocked!` };
    }

    case 'COMPLETE_CHAPTER': {
      const newProgress = {
        ...state.progress,
        completedChapters: [...state.progress.completedChapters, action.chapter],
      };
      const nextChapter = action.chapter + 1;
      if (nextChapter <= 10 && !newProgress.unlockedChapters.includes(nextChapter)) {
        newProgress.unlockedChapters = [...newProgress.unlockedChapters, nextChapter];
      }
      saveProgress(newProgress);
      return {
        ...state,
        progress: newProgress,
        notification: `Chapter ${action.chapter} complete!`,
      };
    }

    case 'SHOW_NOTIFICATION':
      return { ...state, notification: action.message };

    case 'HIDE_NOTIFICATION':
      return { ...state, notification: null };

    case 'RETURN_TO_TITLE':
      return {
        ...state,
        currentScreen: 'title',
        isAutoMode: false,
        isSkipMode: false,
        showHistory: false,
        showMenu: false,
        choiceResultIndex: 0,
        isPlayingChoiceResult: false,
      };

    default:
      return state;
  }
}

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return <GameContext.Provider value={{ state, dispatch }}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
}

export function useGameActions() {
  const { dispatch } = useGame();

  return {
    startChapter: useCallback((chapter: number) => dispatch({ type: 'START_CHAPTER', chapter }), [dispatch]),
    advanceScene: useCallback(() => dispatch({ type: 'ADVANCE_SCENE' }), [dispatch]),
    setSceneIndex: useCallback((index: number) => dispatch({ type: 'SET_SCENE_INDEX', index }), [dispatch]),
    toggleAuto: useCallback(() => dispatch({ type: 'TOGGLE_AUTO' }), [dispatch]),
    toggleSkip: useCallback(() => dispatch({ type: 'TOGGLE_SKIP' }), [dispatch]),
    makeChoice: useCallback((optionIndex: number) => dispatch({ type: 'MAKE_CHOICE', optionIndex }), [dispatch]),
    advanceChoiceResult: useCallback(() => dispatch({ type: 'ADVANCE_CHOICE_RESULT' }), [dispatch]),
    finishChoiceResult: useCallback(() => dispatch({ type: 'FINISH_CHOICE_RESULT' }), [dispatch]),
    toggleHistory: useCallback(() => dispatch({ type: 'TOGGLE_HISTORY' }), [dispatch]),
    toggleMenu: useCallback(() => dispatch({ type: 'TOGGLE_MENU' }), [dispatch]),
    changeScreen: useCallback((screen: GameScreen) => dispatch({ type: 'CHANGE_SCREEN', screen }), [dispatch]),
    updateSettings: useCallback(
      (settings: Partial<GameState['settings']>) => dispatch({ type: 'UPDATE_SETTINGS', settings }),
      [dispatch],
    ),
    quickSave: useCallback(() => dispatch({ type: 'QUICK_SAVE' }), [dispatch]),
    quickLoad: useCallback(() => dispatch({ type: 'QUICK_LOAD' }), [dispatch]),
    manualSave: useCallback((slot: number) => dispatch({ type: 'MANUAL_SAVE', slot }), [dispatch]),
    manualLoad: useCallback((slot: number) => dispatch({ type: 'MANUAL_LOAD', slot }), [dispatch]),
    unlockChapter: useCallback((chapter: number) => dispatch({ type: 'UNLOCK_CHAPTER', chapter }), [dispatch]),
    completeChapter: useCallback((chapter: number) => dispatch({ type: 'COMPLETE_CHAPTER', chapter }), [dispatch]),
    showNotification: useCallback((message: string) => dispatch({ type: 'SHOW_NOTIFICATION', message }), [dispatch]),
    hideNotification: useCallback(() => dispatch({ type: 'HIDE_NOTIFICATION' }), [dispatch]),
    returnToTitle: useCallback(() => dispatch({ type: 'RETURN_TO_TITLE' }), [dispatch]),
  };
}
