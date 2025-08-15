import { type Dispatch, type SetStateAction, useState } from 'react'

import Button from '@/components/ui/button'
import Modal from '@/components/ui/modal'
import { api } from '@/trpc/react'
import { type Rank } from '@/lib/types'

export default function AddRankModal({
  isOpen,
  setIsOpen,
  addRank,
}: {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  addRank: (newRank: Rank) => void
}) {
  const { data: drafts } = api.draft.getAll.useQuery()

  const [selectedDraftIndex, setSelectedDraftIndex] = useState<
    number | undefined
  >(undefined)
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} title='add rank'>
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
              const selecteDraft = drafts?.[selectedDraftIndex]
              if (selecteDraft) {
                const newRank: Rank = {
                  title: selecteDraft.title,
                  items: selecteDraft.body.split('\n'),
                }
                addRank(newRank)
              }
              setIsOpen(false)
            }
          }}
        >
          add rank
        </Button>
      </div>
    </Modal>
  )
}
