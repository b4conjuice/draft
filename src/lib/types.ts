export type Note = {
  id?: number
  text: string
  title: string
  body: string
  list: string[]
  tags: string[]
}

export type Draft = {
  title: string
  items: string[]
  teams: string[]
  // categories?: string[]
}

export type DraftNote = Note & Draft & { id: number }

export type DraftFields = {
  title: string
  items: string
  teams: string
}
