import { auth } from '@clerk/nextjs/server'
import { ArrowRightStartOnRectangleIcon } from '@heroicons/react/20/solid'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'

import { getDraft } from '@/server/actions'
import DraftForm from './form'
import getUsername from '@/lib/getUsername'
import TopNavTitle from '@/app/_components/topNavTitle'
import Results from './results'

async function TopNav() {
  const username = await getUsername()
  return (
    <header className='flex items-center justify-between bg-cb-dark-blue px-2 pt-2'>
      <div className='flex space-x-4'>
        <TopNavTitle />
      </div>
      <div className='flex space-x-4'>
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
  const id = Number((await params).id)
  const draft = await getDraft(id)

  const user = await auth()
  if (!user.userId) {
    const { title, items, teams } = draft
    return (
      <>
        <TopNav />
        <h2 className='px-2'>{title}</h2>
        <Results items={items} teams={teams} />
      </>
    )
  }

  return (
    <>
      <TopNav />
      <DraftForm {...draft} />
    </>
  )
}
