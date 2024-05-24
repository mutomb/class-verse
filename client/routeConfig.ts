import {PlayMedia} from './components/media'
import { read } from './components/media/api-media'

const routes = [
  {
    path: '/media/:mediaId',
    component: PlayMedia,
    loadData: (params) => read(params, undefined)
  }

]
export default routes
