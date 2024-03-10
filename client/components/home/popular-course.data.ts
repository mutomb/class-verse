import type { Course } from '../../interfaces/course'
import course1photo from '../../public/images/courses/a9e7b27a0c5e986a22416d79e2e9dba9.jpg'
import course2photo from '../../public/images/courses/alvaro-reyes-qWwpHwip31M-unsplash.jpg'
import course3photo from '../../public/images/courses/christopher-gower-m_HRfLhgABo-unsplash.jpg'
import course4photo from '../../public/images/courses/true-agency-o4UhdLv5jbQ-unsplash.jpg'
import course5photo from '../../public/images/courses/stillness-inmotion-Jh6aQX-25Uo-unsplash.jpg'
import course6photo from '../../public/images/courses/stillness-inmotion-YSCCnRGrD-4-unsplash.jpg'
import course7photo from '../../public/images/courses/grovemade-RvPDe41lYBA-unsplash.jpg'

export const data: Array<Course> = [
  {
    id: 1,
    cover: course1photo,
    title: 'Android Development from Zeo to Hero',
    rating: 5,
    ratingCount: 8,
    price: 25,
    category: 'Beginner',
  },
  {
    id: 2,
    cover: course2photo,
    title: 'UI/UX Complete Guide',
    rating: 5,
    ratingCount: 15,
    price: 20,
    category: 'Intermediate',
  },
  {
    id: 3,
    cover: course3photo,
    title: 'Mastering Data Modeling Fundamentals',
    rating: 4,
    ratingCount: 7,
    price: 30,
    category: 'Beginner',
  },
  {
    id: 4,
    cover: course4photo,
    title: 'The Complete Guide Docker and Kubernetes',
    rating: 4,
    ratingCount: 12,
    price: 30,
    category: 'Intermediate',
  },
  {
    id: 5,
    cover: course5photo,
    title: 'Modern React with MUI & Redux',
    rating: 4,
    ratingCount: 32,
    price: 35,
    category: 'Intermediate',
  },
  {
    id: 6,
    cover: course6photo,
    title: 'Ethical Hacking Bootcamp Zero to Mastery',
    rating: 5,
    ratingCount: 14,
    price: 35,
    category: 'Beginner',
  },
  {
    id: 7,
    cover: course7photo,
    title: 'Adobe Lightroom For Beginners: Complete Photo Editing',
    rating: 4,
    ratingCount: 6,
    price: 25,
    category: 'Beginner',
  },
]
