export type Note = {
  id?: number
  text: string
  title: string
  body: string
  list: string[]
  tags: string[]
}

export type Draft = {
  id: number
  title: string
  items: string[]
  teams: string[]
  // categories?: string[]
}

export type DraftFields = {
  title: string
  items: string
  teams: string
}
