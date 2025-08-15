import { type Dispatch, type SetStateAction } from 'react'

import Modal from './ui/modal'
import Button from './ui/button'

export default function ConfirmModal({
  isOpen,
  setIsOpen,
  confirmAction,
  title = 'are you sure?',
}: {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  confirmAction: () => void
  title?: string
}) {
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} title={title}>
      <div className='flex space-x-4'>
        <Button
          onClick={() => {
            confirmAction()
            setIsOpen(false)
          }}
        >
          yes
        </Button>
        <Button
          onClick={() => {
            setIsOpen(false)
          }}
        >
          no
        </Button>
      </div>
    </Modal>
  )
}
