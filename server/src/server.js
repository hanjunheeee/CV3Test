import app from './app.js';
import { env } from './config/env.js';
import { connectDatabase } from './config/database.js';
import { syncModels } from './models/index.js';

async function startServer() {
  try {
    await connectDatabase();
    await syncModels();

    app.listen(env.port, () => {
      console.log(`Server running on http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
