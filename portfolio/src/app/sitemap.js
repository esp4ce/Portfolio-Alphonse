export default async function sitemap() {
  const baseUrl = 'https://alphonse.pro'

  const routes = [
    '', 
    'website',
    'other-projects',
    'flappy-bird',
  ]

  const now = new Date().toISOString()

  return routes.map((path) => ({
    url: `${baseUrl}/${path}`.replace(/\/$\//, '/'),
    lastModified: now,
    changeFrequency: 'weekly',
    priority: path === '' ? 1.0 : 0.7,
  }))
}


