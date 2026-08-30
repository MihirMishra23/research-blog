import { siteConfig, sitePath } from '../config/site';

export function GET() {
  const manifest = {
    name: siteConfig.title,
    short_name: 'LLM Map',
    description: siteConfig.description,
    start_url: sitePath('/'),
    scope: sitePath('/'),
    display: 'standalone',
    background_color: '#181916',
    theme_color: '#181916',
    icons: [
      {
        src: sitePath('/icon-192.png'),
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: sitePath('/icon-512.png'),
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };

  return new Response(JSON.stringify(manifest, null, 2), {
    headers: {
      'Content-Type': 'application/manifest+json; charset=utf-8',
    },
  });
}
