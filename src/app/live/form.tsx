'use client'

import { useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ChevronLeftIcon,
  DocumentArrowDownIcon,
} from '@heroicons/react/20/solid'

import { Main } from '@/components/ui'
import { saveNote, saveRelatedDraft } from '@/server/actions'
import { type DraftFields } from '@/lib/types'
import SelectDraftModal from '@/components/select-draft-modal'

export default function Form() {
  const router = useRouter()
  const [isSetOptionsModalOpen, setIsSetOptionsModalOpen] = useState(false)
  const draft = {
    title: '',
    teams: [],
    items: [],
    categories: [],
    options: [],
  }
  const {
    register,
    handleSubmit,
    formState: { isDirty },
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
  const onSubmit: SubmitHandler<DraftFields> = async data => {
    const newNote = {
      text: '',
      title: data.title ?? '',
      body: '',
      list: [],
      tags: [],
    }
    const note = await saveNote(newNote)
    const noteId = note.id
    const newDraft = {
      noteId,
      teams: data.teams.split('\n'),
      items: data.items.split('\n'),
      categories: data.categories.split('\n'),
      options: data.options.split('\n'),
    }
    await saveRelatedDraft(newDraft)
    router.push(`/live/${noteId}`)
  }
  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-grow flex-col'
      >
        <Main className='flex flex-col'>
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
          <div className='flex space-x-4'>
            <label className='px-2'>options</label>
            <button
              className='text-cb-yellow hover:text-cb-yellow/75 disabled:pointer-events-none disabled:text-cb-light-blue'
              type='button'
              onClick={() => {
                setIsSetOptionsModalOpen(true)
              }}
            >
              <DocumentArrowDownIcon className='h-6 w-6' />
            </button>
          </div>
          <textarea
            className='w-full flex-grow border-cobalt bg-cobalt caret-cb-yellow focus:border-cb-light-blue focus:ring-0'
            placeholder='options'
            {...register('options')}
          />
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
              className='flex w-full justify-center text-cb-yellow hover:text-cb-yellow/75 disabled:pointer-events-none disabled:opacity-25'
              type='submit'
              disabled={!isDirty}
            >
              begin live draft
            </button>
          </div>
        </footer>
      </form>
      <SelectDraftModal
        isOpen={isSetOptionsModalOpen}
        setIsOpen={setIsSetOptionsModalOpen}
        onSelectDraft={selectedDraft => {
          setValue('options', selectedDraft.body, { shouldDirty: true })
        }}
      />
    </>
  )
}
