'use client'

import { Switch } from '@headlessui/react'
import { DocumentDuplicateIcon } from '@heroicons/react/20/solid'
import { useCopyToClipboard, useLocalStorage } from '@uidotdev/usehooks'
import classNames from 'classnames'
import { toast } from 'react-toastify'

function getLeague({
  teams,
  items,
  thirdRoundReversal = false,
}: {
  teams: string[]
  items: string[]
  thirdRoundReversal?: boolean
}) {
  const teamsCount = teams.length
  const league = items.reduce<string[][]>((finalItems, item, index) => {
    const round = Math.ceil((index + 1) / teamsCount)
    const pickInRound = index % teamsCount // 0-indexed pick within the current round
    let teamIndex: number

    if (thirdRoundReversal && round >= 3) {
      if (round === 1) {
        teamIndex = pickInRound // Standard
      } else if (round === 2 || round === 3) {
        teamIndex = teamsCount - 1 - pickInRound // Reverse
      } else {
        teamIndex =
          round % 2 === 0
            ? pickInRound // Even rounds (4, 6, 8...) are standard
            : teamsCount - 1 - pickInRound // Odd rounds (5, 7, 9...) are reverse
      }
    } else {
      // Standard snake draft logic for non-3RR or first 2 rounds of 3RR
      teamIndex =
        round % 2 === 1
          ? pickInRound // Odd rounds (1, 3, 5...) go in standard order
          : teamsCount - 1 - pickInRound // Even rounds (2, 4, 6...) go in reverse order
    }

    if (finalItems[teamIndex]) {
      finalItems[teamIndex]?.push(
        `${index + 1} ${item} (${round}-${pickInRound + 1})`
      )
    } else {
      finalItems[teamIndex] = [
        `${index + 1} ${item} (${round}-${pickInRound + 1})`,
      ]
    }
    return finalItems
  }, [])
  return league
}

export default function Results({
  items,
  teams,
}: {
  items: string[]
  teams: string[]
}) {
  const [thirdRoundReversal, setThirdRoundReversal] = useLocalStorage<boolean>(
    's4--draft-third-round-reversal',
    false
  )
  const [copiedText, copyToClipboard] = useCopyToClipboard()
  const league = getLeague({
    items,
    teams,
    thirdRoundReversal,
  })
  return (
    <div className='flex flex-grow flex-col'>
      <h2 className='px-2'>items</h2>
      <div className='relative'>
        <div className='absolute right-2 top-2'>
          <button
            className='flex w-full justify-center text-cb-yellow hover:text-cb-yellow/75 disabled:pointer-events-none disabled:opacity-25'
            type='submit'
            onClick={async () => {
              await copyToClipboard(
                items.map((item, index) => `${index + 1} ${item}`).join('\n')
              )
              toast.success('copied items to clipboard')
            }}
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
      <div className='flex space-x-4'>
        <h2 className='px-2'>teams</h2>
        <div
          className={classNames(
            'flex gap-2',
            !thirdRoundReversal && 'opacity-40'
          )}
        >
          <span>3rd round reversal</span>
          <Switch
            checked={!thirdRoundReversal}
            onChange={() => {
              setThirdRoundReversal(!thirdRoundReversal)
            }}
            className='group inline-flex h-6 w-11 items-center rounded-full bg-cb-blue transition'
          >
            <span className='size-4 translate-x-1 rounded-full bg-cb-yellow transition group-data-[checked]:translate-x-6' />
          </Switch>
        </div>
      </div>
      <div className='relative'>
        <div className='absolute right-2 top-2'>
          <button
            className='flex w-full justify-center text-cb-yellow hover:text-cb-yellow/75 disabled:pointer-events-none disabled:opacity-25'
            type='submit'
            onClick={async () => {
              await copyToClipboard(
                league
                  .map(
                    (team, index) => `${teams[index] ?? ''}\n${team.join('\n')}`
                  )
                  .join('\n')
              )
              toast.success('copied teams to clipboard')
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
    </div>
  )
}
