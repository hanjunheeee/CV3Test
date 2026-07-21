import { connectDatabase } from '../src/config/database.js';
import { env } from '../src/config/env.js';
import { runCrawler } from '../src/crawler/index.js';
import { syncModels } from '../src/models/index.js';

async function main() {
  try {
    await connectDatabase();
    await syncModels();
    await runCrawler({
      email: env.crawl.email,
      password: env.crawl.password,
    });
    process.exit(0);
  } catch (error) {
    console.error('Crawl script failed:', error.message);
    process.exit(1);
  }
}

main();
