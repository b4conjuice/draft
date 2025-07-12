import Link from 'next/link'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { PencilSquareIcon } from '@heroicons/react/20/solid'
import { auth } from '@clerk/nextjs/server'

import { Main } from '@/components/ui'
import TopNav from '../_components/topNav'
import { getNotes, saveRelatedDraft } from '@/server/actions'

export default async function DraftListPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const user = await auth()

  if (!user.userId) {
    redirect('/')
  }

  const filter = (await searchParams).filter
  const showAll = filter === 'all'

  const allNotes = await getNotes()
  const notes = showAll ? allNotes : allNotes.filter(note => note.hasDraft)
  return (
    <>
      <TopNav />
      <Main className='flex flex-col px-2'>
        <div className='flex flex-grow flex-col space-y-4'>
          <ul className='divide-y divide-cb-dusty-blue'>
            {notes.map(note => (
              <li key={note.id} className='group flex'>
                {note.hasDraft ? (
                  <Link
                    className='w-full py-4 text-cb-pink hover:text-cb-pink/75 group-first:pt-0'
                    href={`/drafts/${note.id}`}
                  >
                    <div>
                      <div>{note.title}</div>
                      {note.tags && note.tags.length > 0 && (
                        <div>{note.tags.join(' ')}</div>
                      )}
                    </div>
                  </Link>
                ) : (
                  <div className='flex w-full py-4 group-first:pt-0'>
                    <span className='flex grow items-center justify-between'>
                      <div>
                        <div>{note.title}</div>
                        {note.tags && note.tags.length > 0 && (
                          <div>{note.tags.join(' ')}</div>
                        )}
                      </div>
                    </span>
                    <div className='flex items-center space-x-2'>
                      <form
                        action={async () => {
                          'use server'
                          const newDraft = {
                            noteId: note.id,
                          }
                          await saveRelatedDraft(newDraft)
                          revalidatePath('/drafts')
                          redirect(`/drafts/${note.id}`)
                        }}
                      >
                        <button
                          type='submit'
                          tabIndex={-1}
                          className='text-cb-yellow hover:text-cb-yellow/75'
                        >
                          <PencilSquareIcon className='h-6 w-6' />
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </Main>
      <footer className='sticky bottom-0 flex items-center justify-between bg-cb-dusty-blue px-2 pb-6 pt-2'>
        <div className='flex space-x-4'>
          {showAll ? (
            <Link
              className='text-cb-yellow hover:text-cb-yellow/75'
              href='/drafts'
            >
              show only with drafts
            </Link>
          ) : (
            <Link
              className='text-cb-yellow hover:text-cb-yellow/75'
              href='/drafts?filter=all'
            >
              show all notes
            </Link>
          )}
        </div>
        <div className='flex space-x-4'>
          <Link
            className='text-cb-yellow hover:text-cb-yellow/75 disabled:pointer-events-none disabled:opacity-25'
            href='/'
          >
            <PencilSquareIcon className='h-6 w-6' />
          </Link>
        </div>
      </footer>
    </>
  )
}
