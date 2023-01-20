import Button from '@/components/design/button'
import copyToClipboard from '@/lib/copyToClipboard'

export default function League({
  items,
  teams,
}: {
  items: string[]
  teams: string[]
}) {
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
