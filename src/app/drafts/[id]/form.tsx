'use client'

import { useState } from 'react'
import Link from 'next/link'
import { type SubmitHandler, useForm } from 'react-hook-form'
import classNames from 'classnames'
import {
  ArrowDownOnSquareIcon,
  ChevronLeftIcon,
  Cog6ToothIcon,
  ListBulletIcon,
} from '@heroicons/react/20/solid'

import { Main } from '@/components/ui'
import { saveDraft } from '@/server/actions'
import { type DraftNote, type DraftFields } from '@/lib/types'

export default function DraftForm(draft: DraftNote) {
  const { title, teams, items } = draft
  const [showItems, setShowItems] = useState(true)
  const {
    register,
    handleSubmit,
    formState: { isDirty },
  } = useForm<DraftFields>({
    defaultValues: {
      title,
      teams: teams.join('\n'),
      items: items.join('\n'),
    },
  })
  const onSubmit: SubmitHandler<DraftFields> = async data => {
    await saveDraft({
      ...draft,
      title: data.title,
      teams: data.teams.split('\n'),
      items: data.items.split('\n'),
    })
  }
  return (
    <form className='flex flex-grow flex-col' onSubmit={handleSubmit(onSubmit)}>
      <Main className='flex flex-col'>
        <div
          className={classNames(
            'flex flex-grow flex-col',
            showItems ? '' : 'hidden'
          )}
        >
          <h2 className='px-2'>{title}</h2>
          <textarea
            className='w-full flex-grow border-cobalt bg-cobalt caret-cb-yellow focus:border-cb-mint focus:ring-0'
            placeholder='title'
            {...register('items', { required: true })}
          />
        </div>
        <div
          className={classNames(
            'flex flex-grow flex-col',
            showItems ? 'hidden' : ''
          )}
        >
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
        </div>
      </Main>
      <footer className='flex items-center justify-between bg-cb-dark-blue px-2 py-1'>
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
              setShowItems(!showItems)
            }}
          >
            {showItems ? (
              <Cog6ToothIcon className='h-6 w-6' />
            ) : (
              <ListBulletIcon className='h-6 w-6' />
            )}
          </button>
          <button
            className='flex w-full justify-center py-2 text-cb-yellow hover:text-cb-yellow disabled:pointer-events-none disabled:opacity-25'
            type='submit'
            disabled={!isDirty}
          >
            <ArrowDownOnSquareIcon className='h-6 w-6' />
          </button>
        </div>
      </footer>
    </form>
  )
}
