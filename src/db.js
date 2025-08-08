import Dexie from 'dexie';

export const db = new Dexie('intelligentReaderDB');

db.version(1).stores({
  articles: '++id, &url, title, savedAt',
});