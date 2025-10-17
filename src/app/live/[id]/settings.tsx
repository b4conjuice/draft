import { useState } from 'react'
import { DocumentArrowDownIcon } from '@heroicons/react/20/solid'
import { type UseFormSetValue, type UseFormRegister } from 'react-hook-form'

import { type DraftFields } from '@/lib/types'
import SelectDraftModal from '@/components/select-draft-modal'

export default function Settings({
  register,
  setValue,
}: {
  register: UseFormRegister<DraftFields>
  setValue: UseFormSetValue<DraftFields>
}) {
  const [isSetOptionsModalOpen, setIsSetOptionsModalOpen] = useState(false)
  return (
    <>
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
