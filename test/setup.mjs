import { execSync } from 'child_process';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

try {
  execSync('prisma migrate dev ', { stdio: 'inherit' });
  execSync('jest', { stdio: 'inherit' });
} catch (e) {
  console.error(e.message);
  process.exit(1);
}
