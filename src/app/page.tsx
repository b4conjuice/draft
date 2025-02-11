import { Main } from '@/components/ui'

export default function Home() {
  return (
    <Main className='flex flex-col'>
      <div className='flex flex-grow flex-col space-y-4'>
        <textarea className='h-full w-full flex-grow border-none bg-cobalt caret-cb-yellow focus:ring-0' />
      </div>
    </Main>
  )
}
