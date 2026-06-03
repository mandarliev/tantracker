import { createFileRoute, Link } from '@tanstack/react-router'
import cover from '../assets/cover.webp'
import { ChartColumnBigIcon } from 'lucide-react'
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
} from '@clerk/clerk-react'
import { Button } from '#/components/ui/button'

// Change this from '/' to '/_authenticated/'
export const Route = createFileRoute('/')({
  component: Home,
  // Your loader and other configs stay here
})

function Home() {
  return (
    <div className="min-h-100 h-[calc[100vh-80px]] flex items-center justify-center relative">
      <img
        src={cover}
        alt="background"
        className="absolute top-0 left-0 object-cover object-center opacity-50"
      />
      <div className="flex gap-4 flex-col text-center relative z-10">
        <h1 className="text-5xl font-bold flex gap-1 items-center">
          <ChartColumnBigIcon size={60} className="text-lime-500" /> TanTracker
        </h1>
        <p className="text-2xl">Track your finances with ease</p>
        <SignedIn>
          <Button asChild size="lg">
            <Link to="/dashboard">Go To Your Dashboard</Link>
          </Button>
        </SignedIn>
        <SignedOut>
          <div className="flex gap-2 items-center justify-center">
            <Button asChild size="lg" className="bg-lime-600 hover:bg-lime-700">
              <SignInButton />
            </Button>
            <Button asChild size="lg">
              <SignUpButton />
            </Button>
          </div>
        </SignedOut>
      </div>
    </div>
  )
}
