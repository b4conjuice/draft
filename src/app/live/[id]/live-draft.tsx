'use client'

import { useEffect, useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  ArrowDownOnSquareIcon,
  ChartBarIcon,
  ChevronLeftIcon,
  Cog6ToothIcon,
  HandRaisedIcon,
  PencilSquareIcon,
  TableCellsIcon,
} from '@heroicons/react/20/solid'

import { Main } from '@/components/ui'
import { saveDraft } from '@/server/actions'
import { type DraftNote, type DraftFields } from '@/lib/types'
import Settings from './settings'
import Board from './board'
import Results from '@/app/drafts/[id]/results'
// import Pass from './pass'

const TABS = ['default', 'settings', 'results', 'pass'] as const

type Tab = (typeof TABS)[number]

export default function LiveDraft(draft: DraftNote) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialTab = searchParams.get('tab') as Tab
  const [tab, setTab] = useState<Tab | null>(initialTab ?? 'default')
  useEffect(() => {
    if (tab !== 'default') {
      router.push(`/live/${draft.id}?tab=${tab}`)
    } else {
      router.push(`/live/${draft.id}`)
    }
  }, [tab])

  const {
    register,
    handleSubmit,
    formState: { isDirty, isSubmitSuccessful },
    reset,
    getValues,
    setValue,
    watch,
  } = useForm<DraftFields>({
    defaultValues: {
      title: draft.title,
      teams: draft.teams.join('\n'),
      items: draft.items.join('\n'),
      categories: draft.categories.join('\n'),
      options: draft.options.join('\n'),
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
      categories: data.categories.split('\n'),
      options: data.options.split('\n'),
    })
  }
  const items = watch('items').split('\n')
  const setItems = (newItems: string) => {
    setValue('items', newItems, { shouldDirty: true })
  }
  const teams = watch('teams').split('\n')
  const options = watch('options').split('\n')
  const settings = {
    teams,
    options,
  }
  return (
    <form className='flex flex-grow flex-col' onSubmit={handleSubmit(onSubmit)}>
      <Main className='flex flex-col'>
        {tab === 'results' ? (
          <div className='flex flex-grow flex-col'>
            <Results items={items} teams={teams} />
          </div>
        ) : tab === 'settings' ? (
          <div className='flex flex-grow flex-col'>
            <Settings register={register} />
          </div>
        ) : tab === 'pass' ? (
          <div className='flex flex-grow flex-col'>
            {/* <Pass
              drafted={items}
              setDrafted={(newItems: string[]) => {
                setItems(newItems.join('\n'))
              }}
              settings={settings}
            /> */}
          </div>
        ) : (
          <div className='flex flex-grow flex-col'>
            <Board
              drafted={[...items.filter(Boolean)].reverse()} // reversed because drafted items are displayed first at bottom
              setDrafted={(newDraft: string[]) => {
                const newItems = [...newDraft].reverse().join('\n')
                setItems(newItems)
              }}
              settings={settings}
            />
          </div>
        )}
      </Main>
      <footer className='sticky bottom-0 flex items-center justify-between bg-cb-dusty-blue px-2 pb-6 pt-2'>
        <div className='flex space-x-4'>
          <Link
            href='/drafts'
            className='text-cb-yellow hover:text-cb-yellow/75'
          >
            <ChevronLeftIcon className='h-6 w-6' />
          </Link>
          <Link
            className='text-cb-yellow hover:text-cb-yellow/75 disabled:pointer-events-none disabled:opacity-25'
            href={`/drafts/${draft.id}`}
          >
            <PencilSquareIcon className='h-6 w-6' />
          </Link>
        </div>
        <div className='flex space-x-4'>
          <button
            className='text-cb-yellow hover:text-cb-yellow/75 disabled:pointer-events-none disabled:text-cb-light-blue'
            type='button'
            onClick={() => {
              setTab('results')
            }}
            disabled={tab === 'results'}
          >
            <ChartBarIcon className='h-6 w-6' />
          </button>
          <button
            className='text-cb-yellow hover:text-cb-yellow/75 disabled:pointer-events-none disabled:text-cb-light-blue'
            type='button'
            onClick={() => {
              setTab('settings')
            }}
            disabled={tab === 'settings'}
          >
            <Cog6ToothIcon className='h-6 w-6' />
          </button>
          {/* TODO: add pass tab */}
          {/* <button
            className='text-cb-yellow hover:text-cb-yellow/75 disabled:pointer-events-none disabled:text-cb-light-blue'
            type='button'
            onClick={() => {
              setTab('pass')
            }}
            disabled={tab === 'pass'}
          >
            <HandRaisedIcon className='h-6 w-6' />
          </button> */}
          <button
            className='text-cb-yellow hover:text-cb-yellow/75 disabled:pointer-events-none disabled:text-cb-light-blue'
            type='button'
            onClick={() => {
              setTab('default')
            }}
            disabled={tab === 'default'}
          >
            <TableCellsIcon className='h-6 w-6' />
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
    </form>
  )
}
