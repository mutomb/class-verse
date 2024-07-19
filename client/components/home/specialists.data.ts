import type { Specialist } from '../../interfaces/specialist'
import specialist1 from '../../public/images/specialists/christian-buehner-DItYlc26zVI-unsplash.jpg'
import specialist2 from '../../public/images/specialists/jonas-kakaroto-KIPqvvTOC1s-unsplash.jpg'
import specialist3 from '../../public/images/specialists/noah-buscher-8A7fD6Y5VF8-unsplash.jpg'
import specialist4 from '../../public/images/specialists/philip-martin-5aGUyCW_PJw-unsplash.jpg'
import logo1 from '../../public/images/companies/grab.png'
import logo2 from '../../public/images/companies/google.png'
import logo3 from '../../public/images/companies/airbnb.png'
import logo4 from '../../public/images/companies/microsoft.png'


export const data: Array<Specialist> = [
  {
    id: 1,
    photo: specialist1,
    name: 'Jhon Dwirian',
    category: 'UI/UX Design',
    experience: 'An international artist, designer, and animator, presently working out of London, England. American born, he started his career after university making small websites and advertising media. He loves to help others get to grips with powerful FOSS in the name of creative freedom.',
    company: {
      name: 'Grab',
      logo: logo1,
    },
    rating: undefined,
    email: ''
  },
  {
    id: 2,
    photo: specialist2,
    name: 'Leon S Kennedy',
    category: 'Machine Learning',
    experience: 'Expert in conversational systems. He has published over 50 articles and papers in online chatbot magazines, journals.',
    company: {
      name: 'Google',
      logo: logo2,
    },
    rating: undefined,
    email: ''
  },
  {
    id: 3,
    photo: specialist3,
    name: 'Nguyễn Thuy',
    category: 'Android Development',
    experience: 'From Java programming to full-stack development with JavaScript, the applications she has worked on include national Olympiad registration websites, universally accessible widgets, video conferencing apps, and 3D medical reconstruction software.',
    company: {
      name: 'Airbnb',
      logo: logo3,
    },
    rating: undefined,
    email: ''
  },
  {
    id: 4,
    photo: specialist4,
    name: 'Rizki Known',
    category: 'Fullstack Development',
    experience: 'A React Native Champion, he has taught multiple classes and workshops on web- and Javacript-related technologies and has presented at international conferences.',
    company: {
      name: 'Microsoft',
      logo: logo4,
    },
    rating: undefined,
    email: ''
  },
]
