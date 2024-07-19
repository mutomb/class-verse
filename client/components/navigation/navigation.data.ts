import type { Navigation } from '../../interfaces/navigation'

const courseMenu: Navigation[] = [
  {
    label: 'Popular',
    path: '#',
  },
  {
    label: 'Mobile Development',
    path: '#',
  },
  {
    label: 'ML/AI',
    path: '#',
  },
]

const companyMenu: Navigation[] = [
  { label: 'Contact Us', path: 'contact' },
  { label: 'Our Team', path: 'team' },
  { label: 'FAQ', path: 'faq' },
  { label: 'Privacy & Policy', path: 'privacy-policy' },
  { label: 'Terms & Conditions', path: "terms-conditions" },
]

const navigations: Navigation[] = [
  {
    label: 'Courses',
    path: 'courses', // '/#courses',
    // subpaths: courseMenu
  },
  {
    label: 'Specialists',
    path: 'specialists', // '/#specialists',
  },
  {
    label: 'Pricing',
    path: 'pricing', // '/#testimonial',
  },
  {
    label: 'About',
    path: 'about', // '/about',
    subpaths: companyMenu
  },
]

export{ navigations, companyMenu, courseMenu}