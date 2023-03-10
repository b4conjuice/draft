import { type NextPage } from 'next'
import { useRouter } from 'next/router'

import Page from '@/components/page'
import Main from '@/components/design/main'
import Button from '@/components/design/button'
import Loading from '@/components/loading'
import copyToClipboard from '@/lib/copyToClipboard'
import { api } from '@/lib/api'
import useForm from '@/lib/useForm'

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

const Draft: NextPage = () => {
  const {
    query: { id: initialId },
  } = useRouter()
  const id = (initialId as string) ?? ''
  const { data: draft, isLoading } = api.drafts.get.useQuery({
    id,
  })
  const utils = api.useContext()
  const updateDraft = api.drafts.update.useMutation({
    // https://create.t3.gg/en/usage/trpc#optimistic-updates
    async onMutate(newDraft) {
      // Cancel outgoing fetches (so they don't overwrite our optimistic update)
      await utils.drafts.get.cancel()

      // Get the data from the queryCache
      const prevData = utils.drafts.get.getData()

      // Optimistically update the data with our new post
      // utils.drafts.get.setData(undefined, old => [newDraft, ...old])
      // TODO
      // utils.drafts.get.setData({ id }, old => {
      //   return newDraft
      // })

      // Return the previous data so we can revert if something goes wrong
      return { prevData }
    },
    onError(err, newDraft, ctx) {
      // If the mutation fails, use the context-value from onMutate
      utils.drafts.get.setData({ id }, ctx?.prevData)
    },
    async onSettled() {
      // Sync with server once mutation has settled
      await utils.drafts.get.invalidate()
    },
  })

  const { values, handleChange, handleSubmit, isSubmitting, dirty } = useForm({
    initialValues: {
      title: draft?.title ?? 'untitled',
      items: draft?.items.join('\n') ?? '',
      teams: draft?.teams.join('\n') ?? '',
    },
    onSubmit: (
      { title, items: newItems, teams: newTeams },
      { setSubmitting }
    ) => {
      updateDraft.mutate({
        id,
        title: title as string,
        items: (newItems as string).split('\n'),
        teams: (newTeams as string).split('\n'),
      })
      setSubmitting(false)
    },
  })

  if (isLoading) {
    return (
      <Page>
        <Loading />
      </Page>
    )
  }

  const { title, items, teams } = values

  const itemsAsArray = (items as string).split('\n')
  const teamsAsArray = (teams as string).split('\n')
  return (
    <Page>
      <Main className='flex flex-col px-2'>
        <input
          className='bg-cobalt'
          type='text'
          name='title'
          value={title}
          onChange={handleChange}
        />
        <form>
          <h2>items</h2>
          <textarea
            className='w-full bg-cobalt'
            name='items'
            value={items}
            onChange={handleChange}
          />
          <details>
            <summary>
              <h2 className='inline'>teams</h2>
            </summary>
            <textarea
              className='w-full bg-cobalt'
              name='teams'
              value={teams}
              onChange={handleChange}
            />
          </details>
          <Button
            className='disabled:pointer-events-none disabled:opacity-25'
            type='submit'
            onClick={handleSubmit}
            disabled={!dirty || isSubmitting}
          >
            save
          </Button>
        </form>
        {itemsAsArray.length > 0 && (
          <>
            <h2>drafted</h2>
            <ol className='list-decimal pl-8'>
              {itemsAsArray.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ol>
            <Button
              onClick={() =>
                copyToClipboard(
                  itemsAsArray
                    .map((item, index) => `${index + 1} ${item}`)
                    .join('\n')
                )
              }
            >
              copy drafted
            </Button>
          </>
        )}
        {teamsAsArray.length > 0 && (
          <>
            <h2>league</h2>
            <League items={itemsAsArray} teams={teamsAsArray} />
          </>
        )}
      </Main>
    </Page>
  )
}

export default Draft
