import { useState } from 'react'
import { PlusCircleIcon, TrashIcon } from '@heroicons/react/20/solid'
import classNames from 'classnames'
import { useLocalStorage } from '@uidotdev/usehooks'

import DragDropList from '@/components/dragDropList'
import DraftListItem from './board-list-item'
import ConfirmModal from '@/components/confirm-modal'
import EditItemModal from './edit-item-modal'
import AddRankModal from './add-rank-modal'
import { type Rank } from '@/lib/types'
import CommandPalette from '@/components/command-palette'

const NORMALIZE_ITEM_MAP: Record<string, string> = {
  'Nikola Jokić': 'Nikola Jokic',
  'Luka Dončić': 'Luka Doncic',
  'Kristaps Porziņģis': 'Kristaps Porzingis',
}

const normalizeItem = (item: string) => NORMALIZE_ITEM_MAP[item] ?? item

export default function Board({
  drafted,
  setDrafted,
  settings,
}: {
  drafted: string[]
  setDrafted: (newDraft: string[]) => void
  settings: { teams: string[]; options: string[] }
}) {
  const [queue, setQueue] = useLocalStorage<string[]>('s4-live-draft-queue', [])
  const [ranks, setRanks] = useLocalStorage<Rank[]>('s4-live-draft-ranks', [])
  const [isEmptyDraftedModalOpen, setIsEmptyDraftedModalOpen] = useState(false)
  const [isEmptyQueueModalOpen, setIsEmptyQueueModalOpen] = useState(false)
  const [isEditItemModalOpen, setIsEditItemModalOpen] = useState(false)
  const [isAddRankModalOpen, setIsAddRankModalOpen] = useState(false)
  const [itemIndex, setItemIndex] = useState<number | null>(null)
  const editItem =
    typeof itemIndex === 'number' ? (drafted[itemIndex] ?? '') : ''

  const addToQueue = (item: string) => {
    const newQueue = [...queue, item]
    setQueue(newQueue)
  }
  const unqueue = (item: string) => {
    const newQueue = queue.filter(p => p !== item)
    setQueue(newQueue)
  }
  const draft = (item: string) => {
    const newDrafted = [item, ...drafted]
    setDrafted(newDrafted)
    unqueue(item)
    // setFilter('')
  }
  const undraft = (index: number) => {
    const newDrafted = [...drafted]
    newDrafted.splice(index, 1)
    setDrafted(newDrafted)
  }
  const compareRank = (rank: Rank) => {
    const newRanks = [...ranks]
    const selectedRankIndex = newRanks.findIndex(r => r.title === rank.title)
    const selectedRank = newRanks.splice(selectedRankIndex, 1)[0]
    if (selectedRank) newRanks.unshift(selectedRank)
    setRanks(newRanks)
  }

  const { teams, options } = settings
  const teamsCount = teams.length
  const projections = { title: 'default', items: options }
  const columns = [projections, ...ranks]

  const available = options.filter(
    option => !drafted?.some(item => item === option)
  )
  const commands = [
    ...available.map(option => {
      return {
        id: `draft-${option}`,
        title: `Draft ${option}`,
        name: option,
        action: () => {
          draft(option)
        },
      }
    }),
    ...available.map(option => {
      return {
        id: `queue-${option}`,
        title: `Queue ${option}`,
        name: option,
        action: () => {
          addToQueue(option)
        },
      }
    }),
    // {
    //   id: `Toggle Hide Drafted`,
    //   title: `${hideDrafted ? 'Show' : 'Hide'} Drafted`,
    //   action: () => setHideDrafted(!hideDrafted),
    // },
  ]
  return (
    <>
      <div className='flex flex-col divide-x divide-cb-dusty-blue overflow-x-auto md:flex-row'>
        <div className='h-[50vh] overflow-y-auto bg-cb-dark-blue md:sticky md:left-0 md:h-auto md:w-[350px]'>
          <h2 className='flex justify-between space-x-4 p-2'>
            <span>queue</span>
            <button
              type='button'
              onClick={() => {
                setIsEmptyQueueModalOpen(true)
              }}
              disabled={queue?.length === 0}
              className='disabled:pointer-events-none disabled:opacity-25'
            >
              <TrashIcon className='h-6 w-6 text-cb-yellow' />
            </button>
          </h2>
          {queue?.length > 0 && (
            <DragDropList
              items={queue.map((item, index) => ({
                id: `${item}-${index}`,
                item,
              }))}
              renderItem={({ item }: { item: string }, index: number) => (
                <button
                  key={index}
                  type='button'
                  onClick={() => {
                    draft(item)
                  }}
                  className='flex-grow truncate'
                >
                  {item}
                </button>
              )}
              setItems={(newItems: Array<{ item: string }>) => {
                setQueue(newItems.map(({ item }) => item))
              }}
              itemContainerClassName='flex items-center space-x-4 p-2 odd:bg-cb-blue text-cb-orange'
            />
          )}
          <h2 className='flex justify-between space-x-4 border-t-4 border-cb-dusty-blue p-2'>
            <span>draft</span>
            <div className='flex space-x-2'>
              <button
                type='button'
                onClick={() => {
                  draft('placeholder')
                }}
              >
                <PlusCircleIcon className='h-6 w-6 text-cb-yellow' />
              </button>
              <button
                type='button'
                onClick={() => {
                  setIsEmptyDraftedModalOpen(true)
                }}
                disabled={drafted?.length === 0}
                className='disabled:pointer-events-none disabled:opacity-25'
              >
                <TrashIcon className='h-6 w-6 text-cb-yellow' />
              </button>
            </div>
          </h2>
          <DragDropList
            items={(drafted ?? []).map((item, index) => ({
              id: `${item}-${index}`,
              item,
            }))}
            renderItem={({ item }: { item: string }, index: number) => (
              <DraftListItem
                item={item}
                index={index}
                itemsLength={drafted.length}
                editItem={(index: number) => {
                  setIsEditItemModalOpen(true)
                  setItemIndex(index)
                }}
                deleteItem={undraft}
                teams={teamsCount}
              />
            )}
            setItems={(newItems: Array<{ item: string }>) => {
              setDrafted(newItems.map(({ item }) => item))
            }}
            itemContainerClassName='flex items-center space-x-4 p-2 odd:bg-cb-blue'
          />
        </div>
        <div className='flex h-[50vh] divide-x divide-cb-dusty-blue overflow-x-auto overflow-y-auto md:h-auto'>
          {columns.map((rank, rankIndex) => {
            const isProjection = rankIndex === 0
            const isRank = rankIndex > 0
            const isSelectedRank = rankIndex === 1
            const isUnselectedRank = rankIndex > 1
            return (
              <div
                key={rank.title}
                className={classNames(
                  'w-[50vw] bg-cb-dark-blue md:w-[350px]',
                  isUnselectedRank && 'hidden md:block'
                )}
              >
                <table className='w-[50vw] md:w-full'>
                  <thead>
                    <tr>
                      <td className='p-2 text-center'>#</td>
                      <td className='flex items-center justify-between truncate p-2'>
                        {isUnselectedRank ? (
                          <button
                            type='button'
                            className='block w-full rounded bg-cb-yellow px-2 text-cb-dark-blue'
                            onClick={() => {
                              compareRank(rank)
                            }}
                          >
                            {rank.title}
                          </button>
                        ) : (
                          rank.title
                        )}
                        {isProjection ? (
                          <button
                            type='button'
                            onClick={() => {
                              setIsAddRankModalOpen(true)
                            }}
                          >
                            <PlusCircleIcon className='h-6 w-6 text-cb-yellow' />
                          </button>
                        ) : (
                          <button
                            type='button'
                            onClick={() => {
                              const newRanks = [...ranks]
                              newRanks.splice(rankIndex - 1, 1)
                              console.log(newRanks)
                              setRanks(newRanks)
                            }}
                          >
                            <TrashIcon className='h-6 w-6 text-red-700' />
                          </button>
                        )}
                      </td>
                      {/* <td className='p-2 text-center'>+/-</td> */}
                    </tr>
                  </thead>
                  <tbody>
                    {projections.items.map((item, index) => {
                      const originalItem = rank.items[index] ?? ''
                      const normalizedItemName = isRank
                        ? normalizeItem(originalItem)
                        : originalItem
                      return (
                        <tr
                          key={item}
                          // className={classNames(
                          //   `border-b border-cb-dusty-blue`,
                          //   (drafted?.some(p => p === rank.items[index]?.name) &&
                          //     hideDrafted) ||
                          //     (filter &&
                          //       !rank.items[index]?.name
                          //         .toLowerCase()
                          //         .includes(filter.toLowerCase()))
                          //     ? 'hidden'
                          //     : ''
                          // )}
                          className={classNames(
                            `border-b border-cb-dusty-blue`
                          )}
                        >
                          <td className='p-2 text-center'>{index + 1}</td>
                          <td
                            className={classNames(
                              'truncate p-2',
                              drafted.some(p => p === normalizedItemName)
                                ? 'opacity-25'
                                : queue.some(p => p === normalizedItemName)
                                  ? 'text-cb-orange'
                                  : ''
                            )}
                          >
                            <button
                              type='button'
                              className={classNames(
                                'truncate hover:text-cb-yellow disabled:pointer-events-none',
                                projections.items.findIndex(
                                  p => p === normalizedItemName
                                ) === -1
                                  ? 'font-bold text-red-700'
                                  : ''
                              )}
                              onClick={() => {
                                const item = normalizedItemName
                                if (item) {
                                  if (rank.title === projections.title) {
                                    draft(item)
                                  } else {
                                    setQueue([...queue, item])
                                  }
                                }
                              }}
                              disabled={
                                drafted?.some(p => p === normalizedItemName) ||
                                (rank.title !== projections.title &&
                                  queue?.some(p => p === normalizedItemName))
                              }
                            >
                              {normalizedItemName}
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )
          })}
        </div>
      </div>
      <ConfirmModal
        isOpen={isEmptyDraftedModalOpen}
        setIsOpen={setIsEmptyDraftedModalOpen}
        title='are you sure you want to clear the drafted list?'
        confirmAction={() => {
          setDrafted([])
        }}
      />
      <ConfirmModal
        isOpen={isEmptyQueueModalOpen}
        setIsOpen={setIsEmptyQueueModalOpen}
        title='are you sure you want to clear the queue?'
        confirmAction={() => {
          setQueue([])
        }}
      />
      <EditItemModal
        isOpen={isEditItemModalOpen}
        setIsOpen={setIsEditItemModalOpen}
        item={editItem}
        updateItem={newItem => {
          if (typeof itemIndex === 'number') {
            const newDrafted = [...drafted]
            newDrafted[itemIndex] = newItem
            setDrafted(newDrafted)
          }
        }}
      />
      <AddRankModal
        isOpen={isAddRankModalOpen}
        setIsOpen={setIsAddRankModalOpen}
        addRank={newRank => {
          setRanks([...ranks, newRank])
        }}
      />
      <CommandPalette commands={commands} />
    </>
  )
}
