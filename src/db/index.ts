import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import * as schema from "./schema";

if (process.env.NODE_ENV === "development") {
  config({ path: ".env.local" });
}

const sql = neon(process.env.DATABASE_URL!);

const db = drizzle(sql, { schema });

export { db };
