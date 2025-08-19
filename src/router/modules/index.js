import { settings } from '@/config';
import { page } from './page'

const r = [];
const root = {
  path: '/',
  redirect: settings.defaultRouter,
}

r.push(
  root,
  ...page
)

const routes = r

export default routes
