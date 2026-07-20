import { sequelize } from '../config/database.js';
import { HomeshoppingRanking } from './HomeshoppingRanking.js';

export { sequelize, HomeshoppingRanking };

export async function syncModels() {
  await sequelize.sync();
}
