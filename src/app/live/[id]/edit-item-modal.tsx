import { type Dispatch, type SetStateAction, useEffect, useState } from 'react'

import Button from '@/components/ui/button'
import Modal from '@/components/ui/modal'

export default function EditItemModal({
  isOpen,
  setIsOpen,
  item: initialItem,
  updateItem,
}: {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  item: string
  updateItem: (newItem: string) => void
}) {
  const [item, setItem] = useState(initialItem)
  useEffect(() => {
    setItem(initialItem)
  }, [initialItem])
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} title='edit item'>
      <div className='flex space-x-4'>
        <input
          value={item}
          onChange={e => {
            setItem(e.target.value)
          }}
          className='w-full bg-cb-blue p-2'
        />
        <Button
          onClick={() => {
            updateItem(item)
            setIsOpen(false)
          }}
        >
          save
        </Button>
      </div>
    </Modal>
  )
}
