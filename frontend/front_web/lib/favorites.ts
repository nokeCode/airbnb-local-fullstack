type FavoriteEntry = {
  id: number;
  addedAt: string;
};

const FAVORITES_KEY = 'favoritePropertyEntries';

function readEntries(): FavoriteEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => typeof item?.id === 'number' && typeof item?.addedAt === 'string');
  } catch {
    return [];
  }
}

function writeEntries(entries: FavoriteEntry[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(entries));
}

export function getFavoriteEntries(): FavoriteEntry[] {
  return readEntries();
}

export function getFavoriteIds(): number[] {
  return readEntries().map((entry) => entry.id);
}

export function isFavorite(id: number): boolean {
  return readEntries().some((entry) => entry.id === id);
}

export function toggleFavorite(id: number): { isFavorite: boolean; entries: FavoriteEntry[] } {
  const entries = readEntries();
  const exists = entries.some((entry) => entry.id === id);
  const next = exists
    ? entries.filter((entry) => entry.id !== id)
    : [{ id, addedAt: new Date().toISOString() }, ...entries];
  writeEntries(next);
  return { isFavorite: !exists, entries: next };
}

export function removeFavorite(id: number): FavoriteEntry[] {
  const entries = readEntries().filter((entry) => entry.id !== id);
  writeEntries(entries);
  return entries;
}
