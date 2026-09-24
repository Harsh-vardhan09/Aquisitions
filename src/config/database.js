import 'dotenv/config';

import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

if (process.env.NODE_ENV === 'developement') {
  neonConfig.fetchEndpoint = 'http://neon-local:5432/sql';
  neonConfig.useSecureWebSocket = false;
  neonConfig.poolQueryViaFetch = true;
}

// Neon Local (dev) speaks plain HTTP; Neon Cloud (*.neon.tech) uses the driver defaults.
const { hostname, port } = new URL(process.env.DATABASE_URL);
if (!hostname.endsWith('.neon.tech')) {
  neonConfig.fetchEndpoint = `http://${hostname}:${port || 5432}/sql`;
  neonConfig.useSecureWebSocket = false;
  neonConfig.poolQueryViaFetch = true;
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

export { db, sql };
