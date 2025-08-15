import { type DraftFields } from '@/lib/types'
import { type UseFormRegister } from 'react-hook-form'

export default function Settings({
  register,
}: {
  register: UseFormRegister<DraftFields>
}) {
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
      <label className='px-2'>options</label>
      <textarea
        className='w-full flex-grow border-cobalt bg-cobalt caret-cb-yellow focus:border-cb-light-blue focus:ring-0'
        placeholder='options'
        {...register('options')}
      />
    </>
  )
}
