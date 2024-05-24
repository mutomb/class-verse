import type { Teacher } from '../../interfaces/teacher'
import teacher1 from '../../public/images/teachers/christian-buehner-DItYlc26zVI-unsplash.jpg'
import teacher2 from '../../public/images/teachers/jonas-kakaroto-KIPqvvTOC1s-unsplash.jpg'
import teacher3 from '../../public/images/teachers/noah-buscher-8A7fD6Y5VF8-unsplash.jpg'
import teacher4 from '../../public/images/teachers/philip-martin-5aGUyCW_PJw-unsplash.jpg'
import logo1 from '../../public/images/companies/grab.png'
import logo2 from '../../public/images/companies/google.png'
import logo3 from '../../public/images/companies/airbnb.png'
import logo4 from '../../public/images/companies/microsoft.png'


export const data: Array<Teacher> = [
  {
    id: 1,
    photo: teacher1,
    name: 'Jhon Dwirian',
    category: 'UI/UX Design',
    experience:
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    company: {
      name: 'Grab',
      logo: logo1,
    },
  },
  {
    id: 2,
    photo: teacher2,
    name: 'Leon S Kennedy',
    category: 'Machine Learning',
    experience:
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    company: {
      name: 'Google',
      logo: logo2,
    },
  },
  {
    id: 3,
    photo: teacher3,
    name: 'Nguyễn Thuy',
    category: 'Android Development',
    experience:
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    company: {
      name: 'Airbnb',
      logo: logo3,
    },
  },
  {
    id: 4,
    photo: teacher4,
    name: 'Rizki Known',
    category: 'Fullstack Development',
    experience:
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    company: {
      name: 'Microsoft',
      logo: logo4,
    },
  },
]
