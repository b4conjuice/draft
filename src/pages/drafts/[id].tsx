import { type NextPage } from 'next'
import { useRouter } from 'next/router'
import type { Draft as DraftType } from '@prisma/client'

import Page from '@/components/page'
import Main from '@/components/design/main'
import Loading from '@/components/loading'
import Draft from '@/components/draft'
import { api } from '@/lib/api'
import Footer, { FooterListItem } from '@/components/design/footer'
import { TrashIcon } from '@heroicons/react/24/solid'

const DraftPage: NextPage = () => {
  const {
    query: { id: initialId },
    push,
  } = useRouter()
  const id = (initialId as string) ?? ''
  const { data: draft, isLoading } = api.drafts.get.useQuery({
    id,
  })
  const utils = api.useContext()
  const { mutate: deleteDraft } = api.drafts.delete.useMutation({
    async onSettled() {
      // Sync with server once mutation has settled
      await utils.drafts.getAll.invalidate()
    },
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
      <Main className='flex flex-col px-4'>
        <Draft draft={draft as DraftType} />
      </Main>
      <Footer>
        <FooterListItem
          onClick={() => {
            deleteDraft({ id })
            push('/').catch(err => console.log(err))
          }}
        >
          <TrashIcon className='h-6 w-6' />
        </FooterListItem>
      </Footer>
    </Page>
  )
}

export default DraftPage
