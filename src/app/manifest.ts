import { MetadataRoute } from 'next'

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'first-pwa',
    short_name: 'first-pwa',
    description: 'This is a first pwa app.',
    start_url: '/first-pwa',
    scope: "/",
    display: 'standalone',
    background_color: '#0F172A', // From design guidelines
    theme_color: '#0F172A', // From design guidelines
    icons: [
      {
        src: '/first-pwa/favicon.ico', // This exists
        sizes: 'any',
        type: 'image/x-icon',
      },
      // Add more placeholder icons for different sizes
      {
        src: '/icon-192.png',
        type: 'image/png',
        sizes: '192x192',
      },
      {
        src: '/icon-512.png',
        type: 'image/png',
        sizes: '512x512',
      },
    ],
  }
}
