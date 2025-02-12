'use client'

import { useRouter } from 'next/navigation'
import { ArrowDownOnSquareIcon } from '@heroicons/react/20/solid'
import { SignedIn } from '@clerk/nextjs'

import { Footer, FooterListItem, Main } from '@/components/ui'
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
          <textarea
            className='h-full w-full flex-grow border-cobalt bg-cobalt caret-cb-yellow focus:border-cb-mint focus:ring-0'
            value={text}
            onChange={e => {
              setText(e.target.value)
            }}
          />
        </div>
      </Main>
      <SignedIn>
        <Footer>
          <FooterListItem
            onClick={async () => {
              const [title, ...body] = text.split('\n\n')
              const newNote = {
                text,
                title: title ?? '',
                body: body.join('\n\n'),
                list: [],
                tags: [],
              }
              const noteId = await saveNote(newNote)
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
          </FooterListItem>
        </Footer>
      </SignedIn>
    </>
  )
}
