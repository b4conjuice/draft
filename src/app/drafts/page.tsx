import Link from 'next/link'
import { redirect } from 'next/navigation'
import { PencilSquareIcon } from '@heroicons/react/20/solid'
import { revalidatePath } from 'next/cache'

import { Main } from '@/components/ui'
import TopNav from '../_components/topNav'
import { getNotes, saveRelatedDraft } from '@/server/actions'

export default async function DraftListPage() {
  const notes = await getNotes()
  return (
    <>
      <TopNav />
      <Main className='flex flex-col px-2'>
        <div className='flex flex-grow flex-col space-y-4'>
          <ul className='divide-y divide-cb-dusty-blue'>
            {notes.map(note => (
              <li key={note.id} className='flex py-4 first:pt-0 last:pb-0'>
                <span className='flex grow items-center justify-between'>
                  <div>
                    <div>{note.title}</div>
                    {note.tags && note.tags.length > 0 && (
                      <div>{note.tags.join(' ')}</div>
                    )}
                  </div>
                </span>
                <div className='flex items-center space-x-2'>
                  {note.hasPodcast ? (
                    <Link
                      className='text-cb-yellow hover:text-cb-yellow/75'
                      href={`/drafts/${note.id}`}
                    >
                      {' '}
                      <PencilSquareIcon className='h-6 w-6' />
                    </Link>
                  ) : (
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
                        className='text-cb-orange hover:text-cb-orange/75'
                      >
                        <PencilSquareIcon className='h-6 w-6' />
                      </button>
                    </form>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Main>
    </>
  )
}
