import { type Dispatch, type SetStateAction, useState } from 'react'

import Button from '@/components/ui/button'
import Modal from '@/components/ui/modal'
import { api } from '@/trpc/react'
import { type NoteWithDraft } from '@/lib/types'

export default function SelectDraftModal({
  isOpen,
  setIsOpen,
  onSelectDraft,
}: {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  onSelectDraft: (draft: NoteWithDraft) => void
}) {
  const { data: drafts } = api.draft.getAll.useQuery()

  const [selectedDraftIndex, setSelectedDraftIndex] = useState<
    number | undefined
  >(undefined)
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} title='select draft'>
      <div className='flex flex-col space-y-4'>
        <select
          className='w-full bg-cb-blue p-2'
          value={selectedDraftIndex}
          onChange={e => {
            setSelectedDraftIndex(Number(e.target.value))
          }}
        >
          <option>select draft</option>
          {drafts?.map((draft, index) => (
            <option key={draft.id} value={index}>
              {draft.title}
            </option>
          ))}
        </select>
        <Button
          onClick={() => {
            if (selectedDraftIndex !== undefined) {
              const selectedDraft = drafts?.[selectedDraftIndex]
              if (selectedDraft) {
                onSelectDraft(selectedDraft)
              }
              setIsOpen(false)
            }
          }}
        >
          select draft
        </Button>
      </div>
    </Modal>
  )
}
