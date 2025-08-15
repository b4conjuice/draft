import { SignedIn, SignedOut } from '@clerk/nextjs'

import TopNav from '@/app/_components/topNav'
import Form from '@/app/live/form'

export default function LivePage() {
  return (
    <>
      <TopNav title='live' />
      <SignedOut>
        <p className='px-2'>sign in to live draft</p>
      </SignedOut>
      <SignedIn>
        <Form />
      </SignedIn>
    </>
  )
}
