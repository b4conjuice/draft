import Link from 'next/link'

import { Main } from '@/components/ui'
import TopNav from '../_components/topNav'
import { getNotes } from '@/server/actions'

export default async function DraftListPage() {
  const notes = await getNotes()
  return (
    <>
      <TopNav />
      <Main className='flex flex-col px-4'>
        <div className='flex flex-grow flex-col space-y-4'>
          <ul className='divide-y divide-cb-dusty-blue'>
            {notes.map(note => (
              <li key={note.id} className='flex py-4 first:pt-0 last:pb-0'>
                <Link
                  href={`/drafts/${note.id}`}
                  className='flex grow items-center justify-between text-cb-pink hover:text-cb-pink/75'
                >
                  <div>
                    <div>{note.title}</div>
                    {note.tags && note.tags.length > 0 && (
                      <div>{note.tags.join(' ')}</div>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Main>
    </>
  )
}
