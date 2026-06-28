// ===== VISUAL NOVEL TYPE DEFINITIONS =====

export interface BaseNode {
  bg?: string;
  cg?: string | null;
}

export interface NarrationNode extends BaseNode {
  type: 'narration';
  text: string;
}

export interface DialogueNode extends BaseNode {
  type: 'dialogue';
  speaker: string;
  text: string;
}

export interface TransitionNode {
  type: 'transition';
  text: string;
}

export interface ChoiceNode {
  type: 'choice';
  question: string;
  options: string[];
  result: (NarrationNode | DialogueNode)[];
  bg?: string;
  cg?: string;
}

export interface ChapterEndNode extends BaseNode {
  type: 'chapter_end';
}

export interface BGChangeNode {
  type: 'bg_change';
  bg: string;
}

export interface CGShowNode {
  type: 'cg_show';
  cg: string;
}

export interface CGHideNode {
  type: 'cg_hide';
}

export type SceneNode = NarrationNode | DialogueNode | TransitionNode | ChoiceNode | ChapterEndNode | BGChangeNode | CGShowNode | CGHideNode;

export interface ChapterData {
  id: number;
  title: string;
  subtitle: string;
  scenes: SceneNode[];
  comingSoon?: boolean;
}

export interface HistoryEntry {
  speaker?: string;
  text: string;
  timestamp: number;
}

export interface SaveSlot {
  chapter: number;
  sceneIndex: number;
  timestamp: number;
  chapterName: string;
  sceneDescription: string;
}

export interface GameSettings {
  textSpeed: number;
  autoSpeed: number;
  skipUnread: boolean;
  fullscreen: boolean;
}

export interface GameProgress {
  unlockedChapters: number[];
  completedChapters: number[];
  seenNodes: Record<string, boolean>;
}

export type GameScreen = 'title' | 'game' | 'chapter_select' | 'settings' | 'credits';

export interface GameState {
  currentScreen: GameScreen;
  currentChapter: number;
  currentSceneIndex: number;
  isAutoMode: boolean;
  isSkipMode: boolean;
  showHistory: boolean;
  showMenu: boolean;
  settings: GameSettings;
  progress: GameProgress;
  autoSave: SaveSlot | null;
  quickSave: SaveSlot | null;
  manualSlots: (SaveSlot | null)[];
  history: HistoryEntry[];
  notification: string | null;
  choiceResultIndex: number;
  isPlayingChoiceResult: boolean;
}

export type GameAction =
  | { type: 'START_CHAPTER'; chapter: number }
  | { type: 'ADVANCE_SCENE' }
  | { type: 'SET_SCENE_INDEX'; index: number }
  | { type: 'TOGGLE_AUTO' }
  | { type: 'TOGGLE_SKIP' }
  | { type: 'MAKE_CHOICE'; optionIndex: number }
  | { type: 'ADVANCE_CHOICE_RESULT' }
  | { type: 'TOGGLE_HISTORY' }
  | { type: 'TOGGLE_MENU' }
  | { type: 'CHANGE_SCREEN'; screen: GameScreen }
  | { type: 'UPDATE_SETTINGS'; settings: Partial<GameSettings> }
  | { type: 'QUICK_SAVE' }
  | { type: 'QUICK_LOAD' }
  | { type: 'MANUAL_SAVE'; slot: number }
  | { type: 'MANUAL_LOAD'; slot: number }
  | { type: 'UNLOCK_CHAPTER'; chapter: number }
  | { type: 'COMPLETE_CHAPTER'; chapter: number }
  | { type: 'SHOW_NOTIFICATION'; message: string }
  | { type: 'HIDE_NOTIFICATION' }
  | { type: 'RETURN_TO_TITLE' }
  | { type: 'FINISH_CHOICE_RESULT' };
