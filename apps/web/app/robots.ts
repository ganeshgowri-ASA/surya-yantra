import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/api/auth/'],
      },
    ],
    sitemap: 'https://surya-yantra.vercel.app/sitemap.xml',
    host: 'https://surya-yantra.vercel.app',
  };
}
