import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { auth } from '@clerk/tanstack-react-start/server'

// 1. Define a secure server function to evaluate the authentication state
const checkAuthFn = createServerFn({ method: 'GET' }).handler(async () => {
  const { isAuthenticated } = await auth()
  return { isAuthenticated }
})

export const Route = createFileRoute('/_authenticated')({
  // 2. Safely call the server function during the beforeLoad lifecycle hook
  beforeLoad: async ({ location }) => {
    const { isAuthenticated } = await checkAuthFn()

    if (!isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }
  },
  component: () => <Outlet />,
})
