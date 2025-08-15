import {
  TrashIcon,
  PencilSquareIcon,
  EllipsisVerticalIcon,
} from '@heroicons/react/24/solid'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'

const DraftListItem = ({
  item,
  index,
  itemsLength,
  editItem,
  deleteItem,
  teams,
}: {
  item: string
  index: number
  itemsLength: number
  editItem: (index: number) => void
  deleteItem: (index: number) => void
  teams: number
}) => {
  const pickNumber = Math.abs(itemsLength - index)
  const round = Math.ceil(pickNumber / teams)
  const pick = pickNumber % teams === 0 ? teams : pickNumber % teams
  return (
    <>
      <div>
        <div className='text-center'>{pickNumber}</div>
        <div className='text-center'>({`${round}-${pick}`})</div>
      </div>
      <div className='flex-grow truncate'>{item}</div>
      <Menu as='div' className='relative'>
        <MenuButton>
          <EllipsisVerticalIcon className='h-6 w-6 text-cb-yellow' />
        </MenuButton>
        <MenuItems className='absolute right-0 z-10 mt-2 flex w-56 origin-top-right space-x-4 bg-cb-dusty-blue p-2'>
          <MenuItem>
            <button type='button' onClick={() => editItem(index)}>
              <PencilSquareIcon className='h-6 w-6 text-cb-yellow' />
            </button>
          </MenuItem>
          <MenuItem>
            <button type='button' onClick={() => deleteItem(index)}>
              <TrashIcon className='h-6 w-6 text-cb-yellow' />
            </button>
          </MenuItem>
        </MenuItems>
      </Menu>
    </>
  )
}

export default DraftListItem
