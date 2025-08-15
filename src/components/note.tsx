'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowDownOnSquareIcon,
  ChevronLeftIcon,
} from '@heroicons/react/20/solid'
import { SignedIn, SignedOut } from '@clerk/nextjs'

import { Main } from '@/components/ui'
import useLocalStorage from '@/lib/useLocalStorage'
import { saveRelatedDraft, saveNote } from '@/server/actions'

export default function Note() {
  const router = useRouter()
  const [text, setText] = useLocalStorage('homepage-items', '')
  const hasChanges = text !== ''
  const canSave = !(!hasChanges || text === '')
  return (
    <>
      <Main className='flex flex-col'>
        <div className='flex flex-grow flex-col space-y-4'>
          <SignedOut>
            <p className='px-2'>sign in to save notes</p>
          </SignedOut>
          <textarea
            className='h-full w-full flex-grow border-cobalt bg-cobalt caret-cb-yellow focus:border-cb-light-blue focus:ring-0'
            value={text}
            onChange={e => {
              setText(e.target.value)
            }}
          />
        </div>
      </Main>
      <SignedIn>
        <footer className='sticky bottom-0 flex items-center justify-between bg-cb-dusty-blue px-2 pb-6 pt-2'>
          <div className='flex space-x-4'>
            <Link
              href='/drafts'
              className='text-cb-yellow hover:text-cb-yellow/75'
            >
              <ChevronLeftIcon className='h-6 w-6' />
            </Link>
          </div>
          <div className='flex space-x-4'>
            <button
              className='flex w-full justify-center text-cb-yellow hover:text-cb-yellow disabled:pointer-events-none disabled:opacity-25'
              type='button'
              onClick={async () => {
                const [title, ...body] = text.split('\n\n')
                const newNote = {
                  text,
                  title: title ?? '',
                  body: body.join('\n\n'),
                  list: [],
                  tags: [],
                }
                const note = await saveNote(newNote)
                const noteId = note.id
                const newDraft = {
                  noteId,
                }
                await saveRelatedDraft(newDraft)
                setText('')
                router.push(`/drafts/${noteId}`)
              }}
              disabled={!canSave}
            >
              <ArrowDownOnSquareIcon className='h-6 w-6' />
            </button>
          </div>
        </footer>
      </SignedIn>
    </>
  )
}
