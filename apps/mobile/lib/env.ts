type AppEnv = {
  EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY: string
}

const createEnv = (): AppEnv => {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY

  if (!publishableKey) {
    throw new Error(
      'Invalid mobile env provided. EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY is required.',
    )
  }

  return {
    EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY: publishableKey,
  }
}

export const env = createEnv()
