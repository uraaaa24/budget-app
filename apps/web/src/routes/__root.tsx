import { TanStackDevtools } from "@tanstack/react-devtools"
import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import { useAuth } from "@clerk/clerk-react"
import Header from "../components/Header"

import { MonthProvider } from "../contexts/month-context"
import ClerkProvider from "../integrations/clerk/provider"

import TanStackQueryProvider from "../integrations/tanstack-query/root-provider"

import TanStackQueryDevtools from "../integrations/tanstack-query/devtools"

import appCss from "../styles.css?url"

import type { QueryClient } from "@tanstack/react-query"

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Budget App",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="font-sans antialiased [overflow-wrap:anywhere] selection:bg-primary/25">
        <ClerkProvider>
          <TanStackQueryProvider>
            <MonthProvider>
              <ConditionalHeader />
              {children}
              {/*<Footer />*/}
              {import.meta.env.DEV && (
                <TanStackDevtools
                  config={{
                    position: "bottom-right",
                  }}
                  plugins={[
                    {
                      name: "Tanstack Router",
                      render: <TanStackRouterDevtoolsPanel />,
                    },
                    TanStackQueryDevtools,
                  ]}
                />
              )}
            </MonthProvider>
          </TanStackQueryProvider>
        </ClerkProvider>
        <Scripts />
      </body>
    </html>
  )
}

function ConditionalHeader() {
  const { isLoaded, isSignedIn } = useAuth()

  // Don't show header while auth is loading
  if (!isLoaded) {
    return null
  }

  // Only show header when signed in
  if (!isSignedIn) {
    return null
  }

  return <Header />
}
