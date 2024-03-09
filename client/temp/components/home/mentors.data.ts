import type { Mentor } from '../../interfaces/mentor'
import mentor1 from '../../../public/images/mentors/christian-buehner-DItYlc26zVI-unsplash.jpg'
import mentor2 from '../../../public/images/mentors/jonas-kakaroto-KIPqvvTOC1s-unsplash.jpg'
import mentor3 from '../../../public/images/mentors/noah-buscher-8A7fD6Y5VF8-unsplash.jpg'
import mentor4 from '../../../public/images/mentors/philip-martin-5aGUyCW_PJw-unsplash.jpg'
import logo1 from '../../../public/images/companies/grab.png'
import logo2 from '../../../public/images/companies/google.png'
import logo3 from '../../../public/images/companies/airbnb.png'
import logo4 from '../../../public/images/companies/microsoft.png'


export const data: Array<Mentor> = [
  {
    id: 1,
    photo: mentor1,
    name: 'Jhon Dwirian',
    category: 'UI/UX Design',
    description:
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    company: {
      name: 'Grab',
      logo: logo1,
    },
  },
  {
    id: 2,
    photo: mentor2,
    name: 'Leon S Kennedy',
    category: 'Machine Learning',
    description:
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    company: {
      name: 'Google',
      logo: logo2,
    },
  },
  {
    id: 3,
    photo: mentor3,
    name: 'Nguyễn Thuy',
    category: 'Android Development',
    description:
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    company: {
      name: 'Airbnb',
      logo: logo3,
    },
  },
  {
    id: 4,
    photo: mentor4,
    name: 'Rizki Known',
    category: 'Fullstack Development',
    description:
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    company: {
      name: 'Microsoft',
      logo: logo4,
    },
  },
]
