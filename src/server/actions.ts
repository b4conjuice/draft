'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@clerk/nextjs/server'
import { and, desc, eq } from 'drizzle-orm'

import { db } from './db'
import { type DraftNote, type Note } from '@/lib/types'
import { drafts, notes } from './db/schema'

export async function getNote(noteId: number) {
  const note = await db.query.notes.findFirst({
    where: (model, { eq }) => and(eq(model.id, noteId)),
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
  return newNote
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
    hasDraft: Boolean(result.draft),
  }))
}

export async function saveRelatedDraft({
  noteId,
  teams,
  categories,
  options,
}: {
  noteId: number
  teams?: string[]
  categories?: string[]
  options?: string[]
}) {
  const user = await auth()

  if (!user.userId) throw new Error('unauthorized')

  await db
    .insert(drafts)
    .values({
      noteId,
      teams: teams ?? [],
      categories: categories ?? [],
      options: options ?? [],
    })
    .onConflictDoUpdate({
      target: drafts.noteId,
      set: {
        teams: teams ?? [],
        categories: categories ?? [],
        options: options ?? [],
      },
    })
}

export async function getDraft(noteId: number) {
  const note = await getNote(noteId)

  if (!note) throw new Error('note does not exist')

  const relatedDraft = await db.query.drafts.findFirst({
    where: (model, { eq }) => eq(model.noteId, noteId),
  })

  if (!relatedDraft) throw new Error('draft does not exist')

  const { teams, categories, options } = relatedDraft
  const { title, body } = note

  const draft: DraftNote = {
    ...note,
    title,
    items: body.split('\n'),
    teams,
    categories,
    options,
  }

  return draft
}

export async function saveDraft(draft: DraftNote) {
  const user = await auth()

  if (!user.userId) throw new Error('unauthorized')

  const { id, title, items, teams, categories, options } = draft

  await saveRelatedDraft({ noteId: id, teams, categories, options })

  const body = items.join('\n')
  const updatedNote = {
    ...draft,
    text: `${title}\n\n${body}`,
    title,
    body,
  }
  await saveNote(updatedNote)
  revalidatePath(`/drafts/${id}`)
}

export async function deleteDraft(id: number, currentPath = '/') {
  const user = await auth()

  if (!user.userId) throw new Error('unauthorized')

  await db.delete(drafts).where(and(eq(drafts.noteId, id)))

  await db
    .delete(notes)
    .where(and(eq(notes.id, id), eq(notes.author, user.userId)))

  console.log('deleted', id)
  revalidatePath(currentPath)
}
