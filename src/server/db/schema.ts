// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm"
import { int, sqliteTableCreator, text } from "drizzle-orm/sqlite-core"
import { v4 } from "uuid"

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = sqliteTableCreator((name) => `kyoumi_${name}`)

export const users = createTable("user", {
  id: text("id").primaryKey().$default(v4),
  admin: int("admin", { mode: "boolean" }),
})

export const cards = createTable("card", {
  id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("title", { length: 256 }).notNull(),
  content: text("content", { mode: "json" }).notNull(),
  topic: text("topic", {
    enum: ["pain-point", "brown-bag", "new-idea", "improvement", "fun"],
  }).notNull(),
  importance: int("importance", { mode: "number" }).default(0),
  complete: int("complete", { mode: "boolean" }),
  cloak: int("cloak", { mode: "boolean" }),
  createdAt: int("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date()
  ),
})
