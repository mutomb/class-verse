import type { User } from './user'

export interface Specialist extends Omit<User, 'specialist'> {
  rating: any
  experience?: string
  category: string
  company?: {
    name: string
    logo: string
  }
}
