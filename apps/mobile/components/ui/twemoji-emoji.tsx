import { useMemo, useState } from "react"
import { Image, Text } from "react-native"

type TwemojiEmojiProps = {
  emoji: string
  size?: number
}

const TWEMOJI_BASE_URL =
  "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72"

const toCodePoints = (emoji: string) =>
  Array.from(emoji)
    .map((char) => char.codePointAt(0))
    .filter((codePoint): codePoint is number => codePoint !== undefined)
    .filter((codePoint) => codePoint !== 0xfe0f)
    .map((codePoint) => codePoint.toString(16))
    .join("-")

export const TwemojiEmoji = ({ emoji, size = 20 }: TwemojiEmojiProps) => {
  const [hasError, setHasError] = useState(false)
  const uri = useMemo(() => {
    const codePoints = toCodePoints(emoji)
    return codePoints ? `${TWEMOJI_BASE_URL}/${codePoints}.png` : ""
  }, [emoji])

  if (!uri || hasError) return <Text style={{ fontSize: size }}>{emoji}</Text>

  return (
    <Image
      source={{ uri }}
      style={{ width: size, height: size }}
      resizeMode="contain"
      onError={() => setHasError(true)}
    />
  )
}
