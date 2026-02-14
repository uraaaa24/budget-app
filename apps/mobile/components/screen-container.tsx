import { ReactNode } from "react"
import { View } from "react-native"

type ScreenContainerProps = {
  children: ReactNode
}

export const ScreenContainer = ({ children }: ScreenContainerProps) => {
  return <View className="flex-1 bg-slate-50 px-5 pt-16">{children}</View>
}
