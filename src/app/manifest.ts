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
    background_color: '#0b111f', // From design guidelines
    theme_color: '#0b111f', // From design guidelines
    icons: [
      {
        src: '/icon128.png',
        type: 'image/png',
        sizes: '128x128',
      },
      {
        src: '/icon256.png',
        type: 'image/png',
        sizes: '256x256',
      },
      {
        src: '/icon512.png',
        type: 'image/png',
        sizes: '512x512',
      },
      {
        src: '/icon1024.png',
        type: 'image/png',
        sizes: '1024x1024',
      },
    ],
  }
}
