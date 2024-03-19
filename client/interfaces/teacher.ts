import type { User } from './user'

export interface Teacher extends Omit<User, 'teacher'> {
  experience?: string
  category: string
  company?: {
    name: string
    logo: string
  }
}
