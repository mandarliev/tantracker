import { createFileRoute } from '@tanstack/react-router'

// Change this from '/' to '/_authenticated/'
export const Route = createFileRoute('/')({
  component: Home,
  // Your loader and other configs stay here
})

function Home() {
  return <div></div>
}
