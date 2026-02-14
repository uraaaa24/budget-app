import { useState } from 'react'
import { Pressable, Text, TextInput, View } from 'react-native'
import { useSignIn } from '@clerk/clerk-expo'

export function SignInForm() {
  const { isLoaded, signIn, setActive } = useSignIn()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submit = async () => {
    if (!isLoaded) {
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const result = await signIn.create({
        identifier: email.trim(),
        password,
      })

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        return
      }

      setError('Sign in is not complete. Check Clerk dashboard settings.')
    } catch {
      setError('Failed to sign in. Check your email/password and Clerk configuration.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <View className="rounded-2xl border border-slate-200 bg-white p-4">
      <Text className="mb-4 text-lg font-semibold text-slate-900">Sign In</Text>

      <Text className="mb-1 text-slate-700">Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="you@example.com"
        className="mb-3 rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900"
      />

      <Text className="mb-1 text-slate-700">Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="••••••••"
        className="mb-3 rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900"
      />

      {error ? <Text className="mb-3 text-rose-600">{error}</Text> : null}

      <Pressable
        onPress={submit}
        disabled={!isLoaded || isSubmitting}
        className="rounded-xl bg-slate-900 px-4 py-3">
        <Text className="text-center font-semibold text-white">
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </Text>
      </Pressable>
    </View>
  )
}
