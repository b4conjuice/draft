import { Main } from '@/components/ui'
import { getDraft } from '@/server/actions'
import { auth } from '@clerk/nextjs/server'
import DraftForm from './form'

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
  return <DraftForm {...draftForm} />
}
