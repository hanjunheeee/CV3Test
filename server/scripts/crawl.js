import { connectDatabase } from '../src/config/database.js';
import { syncModels } from '../src/models/index.js';
import { runCrawler } from '../src/crawler/index.js';

const targetUrl = process.argv[2] || 'https://example.com';

async function main() {
  try {
    await connectDatabase();
    await syncModels();
    await runCrawler(targetUrl);
    process.exit(0);
  } catch (error) {
    console.error('Crawl script failed:', error);
    process.exit(1);
  }
}

main();
