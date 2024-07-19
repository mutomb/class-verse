import type { Testimonial } from '../../interfaces/testimonial'
import avatar1 from '../../public/images/avatars/1.jpg'
import avatar2 from '../../public/images/avatars/2.jpg'
import avatar3 from '../../public/images/avatars/3.jpg'
import avatar4 from '../../public/images/avatars/4.jpg'
import avatar5 from '../../public/images/avatars/5.jpg'

export const data: Array<Testimonial> = [
  {
    id: 1,
    title: 'Detailed learning materials',
    content:
      'Classes that provide very detailed material in term of making UI UX Design starting team making low and hight quality, system designs, using data layout and make prototypes and testing.',
    user: {
      id: 1,
      name: 'Luis Sera',
      professional: 'UI/UX Engineer',
      photo: avatar1,
    },
  },
  {
    id: 2,
    title: 'Best Quality Online Course!',
    content:
      'Courses have high quality videos, well structured, comprehensive and presented by eloquent specialists.',
    user: {
      id: 1,
      name: 'Riski',
      professional: 'Software Engineer',
      photo: avatar2,
    },
  },
  {
    id: 3,
    title: 'Very complete course',
    content:
      'Your advanced course left no stone unturned. It pleasantly began with rudementary topics sementing a strong foundation, then smoothly and coherently transitioned into the most advanced topics.',
    user: {
      id: 1,
      name: 'Nguyễn Văn',
      professional: 'FullStack Designer',
      photo: avatar3,
    },
  },
  {
    id: 4,
    title: 'Best Learning Experience!',
    content:
      'whilst videos are short, sweet and easy to follow, the specialist consulations was very helpful when I got stuck on a concept.',
    user: {
      id: 1,
      name: 'Diana Jordan',
      professional: 'SEO Expert',
      photo: avatar4,
    },
  },
  {
    id: 5,
    title: 'Epic Consultation',
    content:
      'Your specialist made my learning very easy. They answered all my questions throughout. Thank you.',
    user: {
      id: 1,
      name: 'Ashley Graham',
      professional: 'Back-End Developer',
      photo: avatar5,
    },
  },
]
