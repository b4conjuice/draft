import { useState } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'

import Button from '@/components/design/button'
import { api } from '@/lib/api'

export default function Messages() {
  const { data: session } = useSession()
  const [message, setMessage] = useState('')

  const utils = api.useContext()

  const { data: messages, isLoading } = api.guestbook.getAll.useQuery()
  const postMessage = api.guestbook.postMessage.useMutation({
    // https://create.t3.gg/en/usage/trpc#optimistic-updates
    async onMutate(newPost) {
      // Cancel outgoing fetches (so they don't overwrite our optimistic update)
      await utils.guestbook.getAll.cancel()

      // Get the data from the queryCache
      const prevData = utils.guestbook.getAll.getData()

      // Optimistically update the data with our new post
      utils.guestbook.getAll.setData(undefined, old => [newPost, ...old])

      // Return the previous data so we can revert if something goes wrong
      return { prevData }
    },
    onError(err, newPost, ctx) {
      // If the mutation fails, use the context-value from onMutate
      utils.guestbook.getAll.setData(undefined, ctx?.prevData)
    },
    async onSettled() {
      // Sync with server once mutation has settled
      await utils.guestbook.getAll.invalidate()
    },
  })
  return (
    <div>
      {session ? (
        <>
          <p>hi {session.user?.name}</p>

          <Button onClick={() => signOut()}>logout</Button>
          <form
            className='space-y-4'
            onSubmit={e => {
              e.preventDefault()
              postMessage.mutate({
                name: session.user?.name,
                message,
              })

              setMessage('')
            }}
          >
            <input
              type='text'
              value={message}
              placeholder='Your message...'
              maxLength={100}
              onChange={event => setMessage(event.target.value)}
              className='block w-full'
            />
            <Button type='submit'>submit</Button>
          </form>
        </>
      ) : (
        <Button onClick={() => signIn('discord')}>login with discord</Button>
      )}
      <div className='bg-cobalt'>
        <h2>messages</h2>
        <ul className='space-y-4'>
          {messages?.map((msg, index) => {
            return (
              <li key={index}>
                <p>{msg.message}</p>
                <span>- {msg.name}</span>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
