import { execSync } from 'child_process';
import * as dotenv from 'dotenv';
import { setupDatabase } from './utils/setupDatabase';

dotenv.config({ path: '.env.test' });

const setup = async () => {
  try {
    await setupDatabase();
    execSync('prisma migrate dev ', { stdio: 'inherit' });
    execSync('jest', { stdio: 'inherit' });
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
};

setup();
