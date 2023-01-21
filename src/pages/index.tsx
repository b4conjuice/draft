import { type NextPage } from 'next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { signIn, signOut, useSession } from 'next-auth/react'

import Page from '@/components/page'
import Main from '@/components/design/main'
import Button from '@/components/design/button'
import Loading from '@/components/loading'
import League from '@/components/league'
import copyToClipboard from '@/lib/copyToClipboard'
import useLocalStorage from '@/lib/useLocalStorage'
import { api } from '@/lib/api'

const Home: NextPage = () => {
  const { push } = useRouter()
  const { data: session } = useSession()

  const [itemsText, setItemsText] = useLocalStorage('items', '')
  const [teamsText, setTeamsText] = useLocalStorage('teams', '')

  const items = itemsText ? itemsText.split('\n').filter(item => item) : []
  const teams = teamsText ? teamsText.split('\n').filter(item => item) : []

  const { data: drafts, isLoading } = api.drafts.getAll.useQuery()
  const saveDraft = api.drafts.save.useMutation()

  if (isLoading) {
    return (
      <Page>
        <Loading />
      </Page>
    )
  }

  if (saveDraft.isSuccess) {
    const id = saveDraft.data?.id ?? ''
    push(`/drafts/${id}`).catch(err => console.log(err))
  }
  return (
    <Page>
      <Main className='flex flex-col px-2'>
        {session ? (
          <details>
            <summary>
              <h2 className='inline'>{session.user?.name}</h2>
            </summary>
            <Button
              onClick={() => {
                signOut().catch(err => console.log(err))
              }}
            >
              logout
            </Button>
          </details>
        ) : (
          <details>
            <summary>
              <h2 className='inline'>login with discord</h2>
            </summary>
            <Button
              onClick={() => {
                signIn('discord').catch(err => console.log(err))
              }}
            >
              login with discord
            </Button>
          </details>
        )}

        <h2>all drafts</h2>
        <ul>
          {drafts?.map(draft => (
            <li key={draft.id}>
              <Link className='text-cb-pink' href={`/drafts/${draft.id}`}>
                {draft.title}
              </Link>
            </li>
          ))}
        </ul>
        {session && (
          <div className='space-y-4'>
            <h2>new draft</h2>
            <form
              className='space-y-2'
              onSubmit={e => {
                e.preventDefault()
                saveDraft.mutate({
                  items,
                  teams,
                })
              }}
            >
              <h2>items</h2>
              <textarea
                className='w-full bg-cobalt'
                value={itemsText}
                onChange={e => setItemsText(e.target.value)}
              />
              <details>
                <summary>
                  <h2 className='inline'>teams</h2>
                </summary>
                <textarea
                  className='w-full bg-cobalt'
                  value={teamsText}
                  onChange={e => setTeamsText(e.target.value)}
                />
              </details>
              <Button type='submit'>save</Button>
            </form>
            {items.length > 0 && (
              <>
                <h2>drafted</h2>
                <ol className='list-decimal pl-8'>
                  {items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ol>
                <Button
                  onClick={() =>
                    copyToClipboard(
                      items
                        .map((item, index) => `${index + 1} ${item}`)
                        .join('\n')
                    )
                  }
                >
                  copy drafted
                </Button>
              </>
            )}
            {teams.length > 0 && (
              <>
                <h2>league</h2>
                <League items={items} teams={teams} />
              </>
            )}
          </div>
        )}
      </Main>
    </Page>
  )
}

export default Home
