import { seedPopularMovies } from './seedMovies.js';

export async function runSeeders() {
  if (process.env.SEED_ON_START === 'true') {
    console.log('🌱 SEED_ON_START is enabled. Starting seeding...\n');
    try {
      await seedPopularMovies(500);
    } catch (error) {
      console.error('Seeding failed:', error.message);
    }
  } else {
    console.log('SEED_ON_START is disabled. Skipping automatic seeding.');
  }
}