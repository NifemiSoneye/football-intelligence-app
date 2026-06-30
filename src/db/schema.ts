import {
  pgTable,
  varchar,
  timestamp,
  integer,
  text,
  json,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { unique } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  kindeId: varchar("kinde_id").notNull().unique(),
  email: varchar("email").unique().notNull(),
  name: varchar("name"),
  avatarUrl: varchar("avatar"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const userPreferences = pgTable("user_preferences", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  favoriteTeamsIds: json("favorite_teams").$type<number[]>().default([]),
  favoriteLeaguesIds: json("favorite_leagues").$type<number[]>().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const matchChatSession = pgTable(
  "match_chat_sessions",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    matchId: integer("match_id").notNull(),
    matchSnapshot: json("match_snapshot").notNull(),
    saved: boolean("saved").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    uniqueUserMatch: unique().on(table.userId, table.matchId),
  }),
);

export const chatMessages = pgTable("chat_messages", {
  id: text("id").primaryKey(),
  sessionId: text("session_id")
    .notNull()
    .references(() => matchChatSession.id, { onDelete: "cascade" }),
  role: text("role", { enum: ["user", "assistant"] }).notNull(),
  content: varchar("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
