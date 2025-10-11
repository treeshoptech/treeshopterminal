import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Homepage redirect logic
  if (pathname === '/') {
    // Check if user has auth cookie/header (can't check localStorage in middleware)
    // For now, always redirect to login from homepage
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/equipment',
    '/employees',
    '/loadouts',
    '/projects',
    '/settings',
  ],
};
