import * as path from 'path';
import * as dotenv from 'dotenv';

export function parseEnvFile(argv: any) {
  const envPostfix = typeof argv.env === 'undefined'? '' : `.${argv.env}`;
  const dotenvPath = path.resolve(process.cwd(), `.env${envPostfix}`);
  const { parsed } = dotenv.config({ path: dotenvPath });
  return parsed;
}