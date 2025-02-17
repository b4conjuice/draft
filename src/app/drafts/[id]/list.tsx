import DragDropList from '@/components/dragDropList'

export default function List({
  items,
  setItems,
}: {
  items: string[]
  setItems: (str: string) => void
}) {
  return (
    <DragDropList
      items={items
        // .filter(item => item)
        .map((item, index) => ({ id: `${item}-${index}`, item }))}
      renderItem={({ item }: { item: string }, index: number) => (
        <div key={index} className='rounded-lg bg-cobalt p-3'>
          {index + 1}. {item}
        </div>
      )}
      setItems={(newItems: Array<{ item: string }>) => {
        setItems(newItems.map(({ item }) => item).join('\n'))
      }}
      listContainerClassName='space-y-3'
    />
  )
}
