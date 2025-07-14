'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { type SubmitHandler, useForm } from 'react-hook-form'
import classNames from 'classnames'
import {
  ArrowDownOnSquareIcon,
  ChartBarIcon,
  ChevronLeftIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  ListBulletIcon,
  PencilSquareIcon,
  ShareIcon,
  TrashIcon,
} from '@heroicons/react/20/solid'
import { useCopyToClipboard } from '@uidotdev/usehooks'
import { toast } from 'react-toastify'

import { Main } from '@/components/ui'
import { deleteDraft, saveDraft } from '@/server/actions'
import { type DraftNote, type DraftFields } from '@/lib/types'
import Results from './results'
import List from './list'
import Button from '@/components/ui/button'
import Modal from '@/components/ui/modal'
import CommandPalette from '@/components/command-palette'

const TABS = ['default', 'settings', 'list', 'results', 'share'] as const

type Tab = (typeof TABS)[number]

export default function DraftForm(draft: DraftNote) {
  const [copiedText, copyToClipboard] = useCopyToClipboard()
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialTab = searchParams.get('tab') as Tab
  const [tab, setTab] = useState<Tab | null>(initialTab ?? 'default')
  useEffect(() => {
    if (tab !== 'default') {
      router.push(`/drafts/${draft.id}?tab=${tab}`)
    } else {
      router.push(`/drafts/${draft.id}`)
    }
  }, [tab])
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
  const { title, items: itemsAsString, teams: teamsAsString } = getValues()
  const items = itemsAsString.split('\n')
  const teams = teamsAsString.split('\n')

  const url = `${window.location.origin}${window.location.pathname}`
  return (
    <form className='flex flex-grow flex-col' onSubmit={handleSubmit(onSubmit)}>
      <Main className='flex flex-col'>
        {tab === 'share' ? (
          <>
            <h2 className='px-2'>{title}</h2>
            <button
              className='group flex w-full border-cobalt bg-cobalt px-2 py-3 text-left hover:cursor-pointer'
              onClick={async () => {
                await copyToClipboard(url)
                toast.success('copied to clipboard')
              }}
            >
              <div className='flex-grow'>{url}</div>
              <DocumentDuplicateIcon className='h-6 w-6 text-cb-yellow group-hover:text-cb-yellow/75' />
            </button>
          </>
        ) : tab === 'results' ? (
          <Results items={items} teams={teams} />
        ) : tab === 'list' ? (
          <>
            <h2 className='px-2'>{title}</h2>
            <List
              items={items}
              setItems={(newItems: string) => {
                setValue('items', newItems, { shouldDirty: true })
              }}
            />
          </>
        ) : tab === 'settings' ? (
          <div className={classNames('flex flex-grow flex-col')}>
            <label className='px-2'>title</label>
            <input
              type='text'
              className='w-full border-cobalt bg-cobalt focus:border-cb-light-blue focus:ring-0'
              placeholder='title'
              {...register('title', { required: true })}
            />
            <label className='px-2'>teams</label>
            <textarea
              className='w-full flex-grow border-cobalt bg-cobalt caret-cb-yellow focus:border-cb-light-blue focus:ring-0'
              placeholder='teams'
              {...register('teams')}
            />
            <label className='px-2'>categories</label>
            <textarea
              className='w-full flex-grow border-cobalt bg-cobalt caret-cb-yellow focus:border-cb-light-blue focus:ring-0'
              placeholder='categories'
              {...register('categories')}
            />
            <label className='px-2'>options</label>
            <textarea
              className='w-full flex-grow border-cobalt bg-cobalt caret-cb-yellow focus:border-cb-light-blue focus:ring-0'
              placeholder='options'
              {...register('options')}
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
        ) : (
          <div className={classNames('flex flex-grow flex-col')}>
            <h2 className='px-2'>{title}</h2>
            <textarea
              className='w-full flex-grow border-cobalt bg-cobalt caret-cb-yellow focus:border-cb-light-blue focus:ring-0'
              placeholder='items'
              {...register('items', { required: true })}
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
        </div>
        <div className='flex space-x-4'>
          <button
            className='text-cb-yellow hover:text-cb-yellow/75 disabled:pointer-events-none disabled:text-cb-light-blue'
            type='button'
            onClick={() => {
              setTab('share')
            }}
            disabled={tab === 'share'}
          >
            <ShareIcon className='h-6 w-6' />
          </button>
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
              setTab('list')
            }}
            disabled={tab === 'list'}
          >
            <ListBulletIcon className='h-6 w-6' />
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
          <button
            className='text-cb-yellow hover:text-cb-yellow/75 disabled:pointer-events-none disabled:text-cb-light-blue'
            type='button'
            onClick={() => {
              setTab('default')
            }}
            disabled={tab === 'default'}
          >
            <PencilSquareIcon className='h-6 w-6' />
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
      <CommandPalette
        commands={[
          {
            id: 'switch-tab-default',
            title: 'switch tab to default',
            action: () => {
              setTab('default')
            },
          },
          {
            id: 'switch-tab-settings',
            title: 'switch tab to settings',
            action: () => {
              setTab('settings')
            },
          },
          {
            id: 'switch-tab-list',
            title: 'switch tab to list',
            action: () => {
              setTab('list')
            },
          },
          {
            id: 'switch-tab-results',
            title: 'switch tab to results',
            action: () => {
              setTab('results')
            },
          },
          {
            id: 'switch-tab-share',
            title: 'switch tab to share',
            action: () => {
              setTab('share')
            },
          },
          {
            id: 'go-notes',
            title: 'go to notes',
            action: () => {
              router.push('/notes')
            },
          },
        ]}
      />
    </form>
  )
}
