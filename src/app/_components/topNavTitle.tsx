'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

import { Title } from '@/components/ui'

export default function TopNavTitle({ title }: { title: string }) {
  const pathname = usePathname()
  if (pathname === '/') {
    return <Title>{title}</Title>
  }
  return (
    <Link href='/' className='hover:text-cb-pink'>
      <Title>{title}</Title>
    </Link>
  )
}
