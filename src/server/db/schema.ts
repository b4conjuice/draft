// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations, sql } from 'drizzle-orm'
import {
  integer,
  pgTable,
  pgTableCreator,
  timestamp,
  varchar,
  serial,
  text,
} from 'drizzle-orm/pg-core'

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator(name => `draft_${name}`)

export const notes = pgTable('n4_note', {
  id: serial('id').primaryKey(),
  text: varchar('text').notNull(),
  title: varchar('title', { length: 256 }).notNull(),
  body: varchar('body').notNull(),
  list: text('list').array().notNull(),
  author: varchar('author', { length: 256 }).notNull(),
  tags: text('tags').array().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(
    () => new Date()
  ),
})

export const drafts = createTable('draft', {
  // id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  noteId: integer('note_id')
    .references(() => notes.id)
    .primaryKey(),
  teams: text('teams').array().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(
    () => new Date()
  ),
})

export const draftsRelations = relations(drafts, ({ one }) => ({
  note: one(notes, {
    fields: [drafts.noteId],
    references: [notes.id],
  }),
}))
