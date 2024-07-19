import React, { FC } from 'react'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import { SocialLink } from '../../interfaces/social-link'
import InstagramIcon from '../../public/images/icons/instagram.svg'
import YoutubeIcon from '../../public/images/icons/youtube.svg'
import TwitterIcon from '../../public/images/icons/twitter.svg'
import GitHubIcon from '../../public/images/icons/github.svg'
import DribbbleIcon from '../../public/images/icons/dribbble.svg'

export const socialLinks: SocialLink[] = [
  {
    name: 'Instagram',
    link: 'https://instagram.com/gosquare',
    icon: InstagramIcon,
  },
  {
    name: 'YouTube',
    link: 'https://youtube.com/gosquare',
    icon: YoutubeIcon,
  },
  {
    name: 'Twitter',
    link: 'https://x.com/gosquare',
    icon: TwitterIcon,
  },
  {
    name: 'Dribbble',
    link: 'https://dribbble.com/shots/gosquare',
    icon: DribbbleIcon,
  },
  {
    name: 'Github',
    link: 'https://github.com/mutomb/gosquare',
    icon: GitHubIcon,
  },
]

interface SocialLinkItemProps {
  item: SocialLink
}

const SocialLinkItem: FC<SocialLinkItemProps> = ({ item }) => (
  <Box
    component="li"
    sx={{
      display: 'inline-block',
      color: 'primary.contrastText',
      mr: 0.5,
    }}
  >
    <Link
      target="_blank"
      sx={{
        lineHeight: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 36,
        height: 36,
        borderRadius: '50%',
        color: 'inherit',
        transform: 'unset',
        '&:hover': {
          backgroundColor: 'secondary.main',
          transform: 'scale(1.3) translateY(-3px))',
          transition: (theme)=>theme.transitions.create(['background-color', 'transform'], {duration: 500})
        },
        '& img': {
          fill: 'currentColor',
          width: 22,
          height: 'auto',
        },
      }}
      href={item.link}
    >
      {/* eslint-disable-next-line */}
      <img src={item.icon} alt={item.name + 'icon'} />
    </Link>
  </Box>
)

// default
const SocialLinks: FC = () => {
  return (
    <Box sx={{ ml: -1 }}>
      <Box
        component="ul"
        sx={{
          m: 0,
          p: 0,
          lineHeight: 0,
          borderRadius: 3,
          listStyle: 'none',
        }}
      >
        {socialLinks.map((item) => {
          return <SocialLinkItem key={item.name} item={item} />
        })}
      </Box>
    </Box>
  )
}

export default SocialLinks
