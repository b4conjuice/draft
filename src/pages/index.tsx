import { type NextPage } from 'next'
import { useRouter } from 'next/router'

import Page from '@/components/page'
import Main from '@/components/design/main'
import Button from '@/components/design/button'
import copyToClipboard from '@/lib/copyToClipboard'
import useLocalStorage from '@/lib/useLocalStorage'
import { api } from '@/lib/api'
import Loading from '@/components/loading'
import Link from 'next/link'

const League = ({ items, teams }: { items: string[]; teams: string[] }) => {
  const teamsCount = teams.length
  const league = items.reduce<string[][]>((finalItems, item, index) => {
    const round = Math.ceil((index + 1) / teamsCount)
    const teamIndex =
      round % 2 === 1
        ? index % teamsCount
        : teamsCount - 1 - (index % teamsCount)
    if (finalItems[teamIndex]) {
      finalItems[teamIndex]?.push(
        `${index + 1} ${item} (${round}-${(index % teamsCount) + 1})`
      )
    } else {
      finalItems[teamIndex] = [
        `${index + 1} ${item} (${round}-${(index % teamsCount) + 1})`,
      ]
    }
    return finalItems
  }, [])
  return (
    <>
      <ul className='grid grid-cols-2 gap-4 md:grid-cols-3'>
        {league.map((team, index) => (
          <li key={index}>
            <h2>{teams[index]}</h2>
            <ul>
              {team.map((item, itemIndex) => (
                <li key={itemIndex}>{item}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <Button
        onClick={() =>
          copyToClipboard(
            league
              .map((team, index) => `${teams[index] ?? ''}\n${team.join('\n')}`)
              .join('\n')
          )
        }
      >
        copy league
      </Button>
    </>
  )
}

const Home: NextPage = () => {
  const { push } = useRouter()
  const [itemsText, setItemsText] = useLocalStorage('items', '')
  const [teamsText, setTeamsText] = useLocalStorage('teams', '')

  const items = itemsText ? itemsText.split('\n').filter(item => item) : []
  const teams = teamsText ? teamsText.split('\n').filter(item => item) : []

  const { data: drafts, isLoading } = api.drafts.getAll.useQuery()
  const updateDraft = api.drafts.update.useMutation()

  if (isLoading) {
    return (
      <Page>
        <Loading />
      </Page>
    )
  }

  if (updateDraft.isSuccess) {
    const id = updateDraft.data?.id ?? ''
    push(`/drafts/${id}`).catch(err => console.log(err))
  }
  return (
    <Page>
      <Main className='flex flex-col px-2'>
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
        <h2>new draft</h2>
        <form
          className='space-y-3'
          onSubmit={e => {
            e.preventDefault()
            updateDraft.mutate({
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
                  items.map((item, index) => `${index + 1} ${item}`).join('\n')
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
      </Main>
    </Page>
  )
}

export default Home
