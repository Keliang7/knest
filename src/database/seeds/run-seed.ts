// src/database/seeds/run-seeds.ts
import dataSource from '../data-source';
import { seedUsers } from './user.seed';

async function run() {
  await dataSource.initialize();
  try {
    await seedUsers(dataSource);
  } finally {
    await dataSource.destroy();
  }
}

run().catch((err) => {
  console.error('❌ Seed failed', err);
  process.exit(1);
});
