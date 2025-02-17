'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { type SubmitHandler, useForm } from 'react-hook-form'
import classNames from 'classnames'
import {
  ArrowDownOnSquareIcon,
  ChartBarIcon,
  ChevronLeftIcon,
  Cog6ToothIcon,
  ListBulletIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/20/solid'

import { Main } from '@/components/ui'
import { deleteDraft, saveDraft } from '@/server/actions'
import { type DraftNote, type DraftFields } from '@/lib/types'
import Results from './results'
import List from './list'
import Button from '@/components/ui/button'
import Modal from '@/components/ui/modal'

export default function DraftForm(draft: DraftNote) {
  const router = useRouter()
  const [showItems, setShowItems] = useState(true)
  const [showResults, setShowResults] = useState(false)
  const [showList, setShowList] = useState(false)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { isDirty, isSubmitSuccessful },
    reset,
    getValues,
    setValue,
  } = useForm<DraftFields>({
    defaultValues: {
      title: draft.title,
      teams: draft.teams.join('\n'),
      items: draft.items.join('\n'),
    },
  })
  useEffect(() => {
    if (isSubmitSuccessful) {
      reset(getValues())
    }
  }, [isSubmitSuccessful, reset])
  const onSubmit: SubmitHandler<DraftFields> = async data => {
    await saveDraft({
      ...draft,
      title: data.title,
      teams: data.teams.split('\n'),
      items: data.items.split('\n'),
    })
  }
  const { title, items: itemsAsString, teams: teamsAsString } = getValues()
  const items = itemsAsString.split('\n')
  const teams = teamsAsString.split('\n')
  return (
    <form className='flex flex-grow flex-col' onSubmit={handleSubmit(onSubmit)}>
      <Main className='flex flex-col'>
        {showResults ? (
          <Results items={items} teams={teams} />
        ) : showList ? (
          <>
            <h2 className='px-2'>{title}</h2>
            <List
              items={items}
              setItems={(newItems: string) => {
                setValue('items', newItems, { shouldDirty: true })
              }}
            />
          </>
        ) : showItems ? (
          <div className={classNames('flex flex-grow flex-col')}>
            <h2 className='px-2'>{title}</h2>
            <textarea
              className='w-full flex-grow border-cobalt bg-cobalt caret-cb-yellow focus:border-cb-mint focus:ring-0'
              placeholder='items'
              {...register('items', { required: true })}
            />
          </div>
        ) : (
          <div className={classNames('flex flex-grow flex-col')}>
            <label className='px-2'>title</label>
            <input
              type='text'
              className='w-full border-cobalt bg-cobalt focus:border-cb-mint focus:ring-0'
              placeholder='title'
              {...register('title', { required: true })}
            />
            <label className='px-2'>teams</label>
            <textarea
              className='w-full flex-grow border-cobalt bg-cobalt caret-cb-yellow focus:border-cb-mint focus:ring-0'
              placeholder='teams'
              {...register('teams')}
            />
            <Button
              backgroundColorClassName='bg-red-700'
              displayClassName='flex justify-center'
              onClick={() => {
                setIsConfirmModalOpen(true)
              }}
            >
              <TrashIcon className='h-6 w-6' />
            </Button>
          </div>
        )}
      </Main>
      <footer className='sticky bottom-0 flex items-center justify-between bg-cb-dark-blue px-2 pb-4 pt-2'>
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
            className='text-cb-yellow hover:text-cb-yellow/75 disabled:pointer-events-none disabled:opacity-25'
            type='button'
            onClick={() => {
              setShowResults(!showResults)
            }}
          >
            {showResults ? (
              <XMarkIcon className='h-6 w-6' />
            ) : (
              <ChartBarIcon className='h-6 w-6' />
            )}
          </button>
          <button
            className='text-cb-yellow hover:text-cb-yellow/75 disabled:pointer-events-none disabled:opacity-25'
            type='button'
            onClick={() => {
              setShowList(!showList)
            }}
          >
            {showList ? (
              <XMarkIcon className='h-6 w-6' />
            ) : (
              <ListBulletIcon className='h-6 w-6' />
            )}
          </button>
          <button
            className='text-cb-yellow hover:text-cb-yellow/75 disabled:pointer-events-none disabled:opacity-25'
            type='button'
            onClick={() => {
              setShowItems(!showItems)
            }}
          >
            {showItems ? (
              <Cog6ToothIcon className='h-6 w-6' />
            ) : (
              <PencilSquareIcon className='h-6 w-6' />
            )}
          </button>
          <button
            className='flex w-full justify-center text-cb-yellow hover:text-cb-yellow/75 disabled:pointer-events-none disabled:opacity-25'
            type='submit'
            disabled={!isDirty}
          >
            <ArrowDownOnSquareIcon className='h-6 w-6' />
          </button>
        </div>
      </footer>
      <Modal
        isOpen={isConfirmModalOpen}
        setIsOpen={setIsConfirmModalOpen}
        title='are you sure you want to delete?'
      >
        <div className='flex space-x-4'>
          <Button
            onClick={async () => {
              await deleteDraft(draft.id, '/drafts')
              setIsConfirmModalOpen(false)
              router.push('/drafts')
            }}
          >
            yes
          </Button>
          <Button
            onClick={() => {
              setIsConfirmModalOpen(false)
            }}
          >
            no
          </Button>
        </div>
      </Modal>
    </form>
  )
}
