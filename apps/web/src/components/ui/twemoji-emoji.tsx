import { useMemo, useState } from "react"

type TwemojiEmojiProps = {
  emoji: string
  size?: number
  className?: string
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

export const TwemojiEmoji = ({
  emoji,
  size = 20,
  className = "",
}: TwemojiEmojiProps) => {
  const [hasError, setHasError] = useState(false)
  const uri = useMemo(() => {
    const codePoints = toCodePoints(emoji)
    return codePoints ? `${TWEMOJI_BASE_URL}/${codePoints}.png` : ""
  }, [emoji])

  if (!uri || hasError) {
    return <span style={{ fontSize: size }}>{emoji}</span>
  }

  return (
    <img
      src={uri}
      alt={emoji}
      width={size}
      height={size}
      className={className}
      style={{ display: "inline-block" }}
      onError={() => setHasError(true)}
    />
  )
}
