import type { Metadata } from 'next'
import { auth } from '@clerk/nextjs/server'

import { getDraft } from '@/server/actions'
import Results from '@/app/drafts/[id]/results'
import TopNav from '@/app/_components/topNav'
import LiveDraft from './live-draft'

export async function generateMetadata({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> {
  const draft = await getDraft(Number(params.id))
  const { title } = draft

  return {
    title,
  }
}

export default async function DraftPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = Number((await params).id)
  const draft = await getDraft(id)
  const { title, items, teams } = draft

  const user = await auth()
  if (!user.userId) {
    return (
      <>
        <TopNav title={title} />
        <h2 className='px-2'>{title}</h2>
        <Results items={items} teams={teams} />
      </>
    )
  }

  return (
    <>
      <TopNav title={title} />
      <LiveDraft {...draft} />
    </>
  )
}
