import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  const robots = `User-agent: *
Allow: /

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Block specific paths
Disallow: /api/
Disallow: /_next/
Disallow: /admin/
Disallow: /dashboard/
Disallow: /auth/

# Allow images and static assets
Allow: /images/
Allow: /icons/
Allow: /*.css$
Allow: /*.js$
Allow: /*.jpg$
Allow: /*.jpeg$
Allow: /*.png$
Allow: /*.gif$
Allow: /*.svg$
Allow: /*.webp$

# Crawl delay
Crawl-delay: 1`;

  return new NextResponse(robots, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400'
    }
  });
}