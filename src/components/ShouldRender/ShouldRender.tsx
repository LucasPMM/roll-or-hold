import type { ComponentChildren } from 'preact'

export type ShouldRenderProps = Readonly<{
  if: boolean
  children: ComponentChildren
}>

export const ShouldRender = ({ if: condition, children }: ShouldRenderProps) => {
  if (!condition) {
    return null
  }

  return <>{children}</>
}
