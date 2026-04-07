import AsyncStorage from '@react-native-async-storage/async-storage';

const FAV_KEY = '@carlights/favorites';
const RECENT_KEY = '@carlights/recent';
const MAX_RECENT = 12;

const memoryFav = new Set<string>();
const memoryRecent: string[] = [];
let loaded = false;

async function ensureLoaded() {
  if (loaded) return;
  try {
    const [f, r] = await Promise.all([
      AsyncStorage.getItem(FAV_KEY),
      AsyncStorage.getItem(RECENT_KEY),
    ]);
    if (f) JSON.parse(f).forEach((id: string) => memoryFav.add(id));
    if (r) {
      const arr = JSON.parse(r) as string[];
      memoryRecent.push(...arr.slice(0, MAX_RECENT));
    }
  } catch {
    /* ignore */
  }
  loaded = true;
}

export async function getFavoriteIds(): Promise<string[]> {
  await ensureLoaded();
  return [...memoryFav];
}

export async function toggleFavorite(lightId: string): Promise<boolean> {
  await ensureLoaded();
  if (memoryFav.has(lightId)) {
    memoryFav.delete(lightId);
  } else {
    memoryFav.add(lightId);
  }
  await AsyncStorage.setItem(FAV_KEY, JSON.stringify([...memoryFav]));
  return memoryFav.has(lightId);
}

export async function isFavorite(lightId: string): Promise<boolean> {
  await ensureLoaded();
  return memoryFav.has(lightId);
}

export async function recordRecent(lightId: string): Promise<void> {
  await ensureLoaded();
  const idx = memoryRecent.indexOf(lightId);
  if (idx >= 0) memoryRecent.splice(idx, 1);
  memoryRecent.unshift(lightId);
  while (memoryRecent.length > MAX_RECENT) memoryRecent.pop();
  await AsyncStorage.setItem(RECENT_KEY, JSON.stringify(memoryRecent));
}

export async function getRecentIds(): Promise<string[]> {
  await ensureLoaded();
  return [...memoryRecent];
}
