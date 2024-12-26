import { env } from '@/env';
import { type Config } from 'drizzle-kit';

export default {
	schema: './src/server/db/schema.ts',
	dialect: 'turso',
	dbCredentials: {
		url: env.TURSO_CONNECTION_URL,
		authToken: env.TURSO_AUTH_TOKEN,
	},
	tablesFilter: ['kyoumi_*'],
} satisfies Config;
