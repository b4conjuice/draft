import Button from '@/components/design/button'
import copyToClipboard from '@/lib/copyToClipboard'
import { api } from '@/lib/api'

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
        onClick={copyToClipboard(
          league.map((item, index) => `${index + 1} ${item}`).join('\n')
        )}
      >
        copy league
      </Button>
    </>
  )
}

export default function Draft({
  items,
  teams,
  setItems,
  setTeams,
}: {
  items: string | string[]
  teams: string | string[]
}) {
  // const itemsAsText = typeof items === 'string' ? items : items.join('\n')
  // const itemsAsArray = typeof items === 'string' ? items.split('\n') : items
  // const teamsAsText = typeof teams === 'string' ? teams : teams.join('\n')
  // const teamsAsArray = typeof teams === 'string' ? teams.split('\n') : teams

  const saveDraft = api.drafts.save.useMutation()
  return (
    <>
      <form
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
            onClick={copyToClipboard(
              items.map((item, index) => `${index + 1} ${item}`).join('\n')
            )}
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
    </>
  )
}
