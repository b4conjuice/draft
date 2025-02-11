'use client'

import { ArrowDownOnSquareIcon } from '@heroicons/react/20/solid'
import { SignedIn } from '@clerk/nextjs'

import { Footer, FooterListItem, Main } from '@/components/ui'
import useLocalStorage from '@/lib/useLocalStorage'

export default function Note() {
  const [text, setText] = useLocalStorage('homepage-items', '')
  const hasChanges = text !== ''
  const canSave = !(!hasChanges || text === '')
  return (
    <>
      <Main className='flex flex-col'>
        <div className='flex flex-grow flex-col space-y-4'>
          <textarea
            className='h-full w-full flex-grow border-none bg-cobalt caret-cb-yellow focus:ring-0'
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
              // const noteId = await saveNote(newNote)
              // const newDraft = {
              //   noteId,
              // }
              // await saveDraft(newDraft)
              setText('')
              // router.push(`/draft/${noteId}`)
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
