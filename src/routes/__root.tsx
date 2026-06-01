import {
  HeadContent,
  Link,
  Scripts,
  createRootRoute,
  useNavigate,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { ChartColumnBigIcon } from 'lucide-react'

import ClerkProvider from '../integrations/clerk/provider'

import appCss from '../styles.css?url'

import poppins100 from '@fontsource/poppins/100.css?url'
import poppins200 from '@fontsource/poppins/200.css?url'
import poppins300 from '@fontsource/poppins/300.css?url'
import poppins400 from '@fontsource/poppins/400.css?url'
import poppins500 from '@fontsource/poppins/500.css?url'
import poppins600 from '@fontsource/poppins/600.css?url'
import poppins700 from '@fontsource/poppins/700.css?url'
import poppins800 from '@fontsource/poppins/800.css?url'
import poppins900 from '@fontsource/poppins/900.css?url'
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/clerk-react'
import { Button } from '#/components/ui/button'
import { Toaster } from '#/components/ui/sonner'

export const Route = createRootRoute({
  notFoundComponent() {
    return (
      <div className="text-3xl text-center py-10 text-muted-foreground">
        Oops! Page not found
      </div>
    )
  },
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'stylesheet',
        href: poppins100,
      },
      {
        rel: 'stylesheet',
        href: poppins200,
      },
      {
        rel: 'stylesheet',
        href: poppins300,
      },
      {
        rel: 'stylesheet',
        href: poppins400,
      },
      {
        rel: 'stylesheet',
        href: poppins500,
      },
      {
        rel: 'stylesheet',
        href: poppins600,
      },
      {
        rel: 'stylesheet',
        href: poppins700,
      },
      {
        rel: 'stylesheet',
        href: poppins800,
      },
      {
        rel: 'stylesheet',
        href: poppins900,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <ClerkProvider>
          <nav className="bg-primary p-4 h-20 text-white flex items-center justify-between">
            <Link to="/" className="flex gap-1 items-center font-bold text-2xl">
              <ChartColumnBigIcon className="text-lime-500" />
              TanTracker
            </Link>
            <div>
              <SignedOut>
                <div className="text-white flex items-center">
                  <Button variant="link" asChild className="text-white">
                    <SignInButton />
                  </Button>
                  <div className="w-px h-8 bg-zinc-700" />
                  <Button variant="link" asChild className="text-white">
                    <SignUpButton />
                  </Button>
                </div>
              </SignedOut>
              <SignedIn>
                <UserButton
                  showName
                  appearance={{
                    elements: {
                      userButtonOuterIdentifier: {
                        color: 'white',
                      },
                    },
                  }}
                >
                  <UserButton.MenuItems>
                    <UserButton.Action
                      label="Dashboard"
                      labelIcon={<ChartColumnBigIcon size={16} />}
                      onClick={() => {
                        navigate({
                          to: '/dashboard',
                        })
                      }}
                    />
                  </UserButton.MenuItems>
                </UserButton>
              </SignedIn>
            </div>
          </nav>
          {children}
          <Toaster />
          <TanStackDevtools
            config={{
              position: 'bottom-right',
            }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
        </ClerkProvider>
        <Scripts />
      </body>
    </html>
  )
}
