import type { GameProgress, GameSettings, SaveSlot } from '@/types/vn';

const STORAGE_KEYS = {
  settings: 'vn_settings',
  progress: 'vn_progress',
  autoSave: 'vn_autosave',
  quickSave: 'vn_quicksave',
  manualSlots: 'vn_manual_slots',
} as const;

const DEFAULT_SETTINGS: GameSettings = {
  textSpeed: 3,
  autoSpeed: 3,
  skipUnread: false,
  fullscreen: false,
};

const DEFAULT_PROGRESS: GameProgress = {
  unlockedChapters: [1],
  completedChapters: [],
  seenNodes: {},
};

export function loadSettings(): GameSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.settings);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    // ignore
  }
  return { ...DEFAULT_SETTINGS };
}

export function saveSettings(settings: GameSettings): void {
  localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
}

export function loadProgress(): GameProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.progress);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_PROGRESS,
        ...parsed,
        seenNodes: parsed.seenNodes || {},
      };
    }
  } catch {
    // ignore
  }
  return { ...DEFAULT_PROGRESS };
}

export function saveProgress(progress: GameProgress): void {
  localStorage.setItem(STORAGE_KEYS.progress, JSON.stringify(progress));
}

export function loadAutoSave(): SaveSlot | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.autoSave);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return null;
}

export function saveAutoSave(slot: SaveSlot): void {
  localStorage.setItem(STORAGE_KEYS.autoSave, JSON.stringify(slot));
}

export function loadQuickSave(): SaveSlot | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.quickSave);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return null;
}

export function saveQuickSave(slot: SaveSlot): void {
  localStorage.setItem(STORAGE_KEYS.quickSave, JSON.stringify(slot));
}

export function loadManualSlots(): (SaveSlot | null)[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.manualSlots);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return [null, null, null];
}

export function saveManualSlots(slots: (SaveSlot | null)[]): void {
  localStorage.setItem(STORAGE_KEYS.manualSlots, JSON.stringify(slots));
}

export function clearAllData(): void {
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
}
