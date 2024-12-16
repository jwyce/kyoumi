import { env } from "@/env"
import { type Config } from "drizzle-kit"

export default {
  schema: "./src/server/db/schema.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  tablesFilter: ["kyoumi_*"],
} satisfies Config
