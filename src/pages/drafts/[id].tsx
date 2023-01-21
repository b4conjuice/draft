import { type NextPage } from 'next'
import { useRouter } from 'next/router'
import type { Draft as DraftType } from '@prisma/client'

import Page from '@/components/page'
import Main from '@/components/design/main'
import Loading from '@/components/loading'
import Draft from '@/components/draft'
import { api } from '@/lib/api'

const DraftPage: NextPage = () => {
  const {
    query: { id: initialId },
  } = useRouter()
  const id = (initialId as string) ?? ''
  const { data: draft, isLoading } = api.drafts.get.useQuery({
    id,
  })

  if (isLoading) {
    return (
      <Page>
        <Loading />
      </Page>
    )
  }

  return (
    <Page>
      <Main className='flex flex-col px-2'>
        <Draft draft={draft as DraftType} />
      </Main>
    </Page>
  )
}

export default DraftPage
