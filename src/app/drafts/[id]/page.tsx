import { auth } from '@clerk/nextjs/server'
import {
  ArrowRightStartOnRectangleIcon,
  ChevronLeftIcon,
} from '@heroicons/react/20/solid'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import Link from 'next/link'

import { Main } from '@/components/ui'
import { getDraft } from '@/server/actions'
import DraftForm from './form'
import getUsername from '@/lib/getUsername'

async function TopNav() {
  const username = await getUsername()
  return (
    <header className='flex items-center justify-between bg-cb-dark-blue px-2 pt-2'>
      <div className='flex space-x-3'>
        <Link href='/drafts' className='text-cb-yellow hover:text-cb-yellow/75'>
          <ChevronLeftIcon className='h-6 w-6' />
        </Link>
      </div>
      <div className='flex space-x-3'>
        <SignedOut>
          <SignInButton>
            <ArrowRightStartOnRectangleIcon className='h-6 w-6 hover:cursor-pointer' />
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <div className='flex space-x-2 text-cb-white'>
            {username && <span>{username}</span>}
            <UserButton />
          </div>
        </SignedIn>
      </div>
    </header>
  )
}

export default async function DraftPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await auth()
  if (!user.userId) {
    return (
      <Main className='container mx-auto flex max-w-screen-md flex-col px-4 md:px-0'>
        <p>you must be logged in to view this draft</p>
      </Main>
    )
  }

  const id = Number((await params).id)
  const draft = await getDraft(id)

  const draftForm = {
    ...draft,
    id,
  }
  return (
    <>
      <TopNav />
      <DraftForm {...draftForm} />
    </>
  )
}
