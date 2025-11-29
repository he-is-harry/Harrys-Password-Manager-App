import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';

const expoDb = openDatabaseSync(process.env.EXPO_PUBLIC_STORAGE_DB_FILE_NAME!);
export const db = drizzle(expoDb);
