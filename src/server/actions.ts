'use server'

import { auth } from '@clerk/nextjs/server'
import { and, desc, eq } from 'drizzle-orm'

import { db } from './db'
import { type DraftFields, type Note } from '@/lib/types'
import { drafts, notes } from './db/schema'

export async function getNote(noteId: number) {
  const user = await auth()

  if (!user.userId) throw new Error('unauthorized')

  const note = await db.query.notes.findFirst({
    where: (model, { eq }) =>
      and(eq(model.id, noteId), eq(model.author, user.userId)),
  })

  return note
}

const DRAFT_TAG = '🦄'

export async function saveNote(note: Note) {
  const user = await auth()

  if (!user.userId) throw new Error('unauthorized')

  const tags = note?.tags ?? []
  const newTags = tags.includes(DRAFT_TAG) ? tags : [...tags, DRAFT_TAG]

  const newNotes = await db
    .insert(notes)
    .values({
      ...note,
      author: user.userId,
      tags: newTags,
    })
    .onConflictDoUpdate({
      target: notes.id,
      set: {
        text: note.text,
        title: note.title,
        body: note.body,
        tags: newTags,
      },
    })
    .returning()

  if (!newNotes || newNotes.length < 0) throw new Error('something went wrong')
  const newNote = newNotes[0]
  if (!newNote) throw new Error('something went wrong')
  return newNote.id
}

export async function getNotes() {
  const user = await auth()

  if (!user.userId) throw new Error('unauthorized')

  const results = await db
    .select()
    .from(notes)
    .leftJoin(drafts, eq(notes.id, drafts.noteId))
    .where(eq(notes.author, user.userId))
    .orderBy(desc(notes.updatedAt))

  return results.map(result => ({
    ...result.n4_note,
    hasPodcast: Boolean(result.draft),
  }))
}

export async function saveRelatedDraft({
  noteId,
  teams,
}: {
  noteId: number
  teams?: string[]
}) {
  const user = await auth()

  if (!user.userId) throw new Error('unauthorized')

  await db
    .insert(drafts)
    .values({
      noteId,
      teams: teams ?? [],
    })
    .onConflictDoUpdate({
      target: drafts.noteId,
      set: {
        teams: teams ?? [],
      },
    })
}

export async function getDraft(noteId: number) {
  const user = await auth()

  if (!user.userId) throw new Error('unauthorized')

  const note = await getNote(noteId)

  if (!note) throw new Error('note does not exist')

  const relatedDraft = await db.query.drafts.findFirst({
    where: (model, { eq }) => eq(model.noteId, noteId),
  })

  if (!relatedDraft) throw new Error('draft does not exist')

  const { teams } = relatedDraft
  const { title, body } = note

  const draft = {
    title,
    items: body.split('\n'),
    teams,
  }

  return draft
}

export async function saveDraft(draft: DraftFields & { noteId: number }) {
  const user = await auth()

  if (!user.userId) throw new Error('unauthorized')

  const { noteId, title, items, teams } = draft

  await saveRelatedDraft({ noteId, teams: teams.split('\n') })

  const updatedNote = {
    id: noteId,
    text: `${title}\n\n${items}`,
    title,
    body: items,
    list: [], // TODO
    tags: [], // TODO: updates unexpectedly
  }
  await saveNote(updatedNote)
}
