'use client'

import copyToClipboard from '@/lib/copyToClipboard'
import { DocumentDuplicateIcon } from '@heroicons/react/20/solid'

export default function Results({
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
      <h2 className='px-2'>items</h2>
      <div className='relative'>
        <div className='absolute right-2 top-2'>
          <button
            className='flex w-full justify-center text-cb-yellow hover:text-cb-yellow/75 disabled:pointer-events-none disabled:opacity-25'
            type='submit'
            onClick={() =>
              copyToClipboard(
                items.map((item, index) => `${index + 1} ${item}`).join('\n')
              )
            }
          >
            <DocumentDuplicateIcon className='h-6 w-6' />
          </button>
        </div>
        <ol className='list-decimal bg-cobalt p-2 pl-8'>
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ol>
      </div>
      <h2 className='px-2'>teams</h2>
      <div className='relative'>
        <div className='absolute right-2 top-2'>
          <button
            className='flex w-full justify-center text-cb-yellow hover:text-cb-yellow/75 disabled:pointer-events-none disabled:opacity-25'
            type='submit'
            onClick={() => {
              copyToClipboard(
                league
                  .map(
                    (team, index) => `${teams[index] ?? ''}\n${team.join('\n')}`
                  )
                  .join('\n')
              )
            }}
          >
            <DocumentDuplicateIcon className='h-6 w-6' />
          </button>
        </div>
        <ul className='grid grid-cols-2 gap-4 bg-cobalt p-2 md:grid-cols-3'>
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
      </div>
    </>
  )
}
