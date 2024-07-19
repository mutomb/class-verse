import { ReactNode } from "react"
export interface Navigation {
  label: string
  path: string
  icon?: ReactNode
  auth?: boolean,
  subpaths?: Navigation[]
}
