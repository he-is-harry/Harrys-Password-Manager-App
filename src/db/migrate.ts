import { migrate } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '../../drizzle/migrations';
import { db } from './index';

export async function runMigrations() {
    try {
        await migrate(db, migrations);
        console.log('Migrations ran successfully');
    } catch (error) {
        console.error('Error running migrations:', error);
        throw error;
    }
}
