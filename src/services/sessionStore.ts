import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Shot } from '../models/types';

const KEY = '@pinpoint/mvp/current-session';

export async function loadSession(): Promise<Shot[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Shot[]) : [];
  } catch {
    return [];
  }
}

export async function saveSession(shots: Shot[]): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(shots));
}

export async function clearSession(): Promise<void> {
  await AsyncStorage.removeItem(KEY);
}
