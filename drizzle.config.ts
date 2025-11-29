import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    schema: './src/db/schema',
    out: './drizzle',
    dialect: 'sqlite',
    driver: 'expo',
    dbCredentials: {
        url: process.env.EXPO_PUBLIC_STORAGE_DB_FILE_NAME!,
    },
});
