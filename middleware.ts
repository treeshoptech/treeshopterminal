import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Mock Middleware - Replace with Clerk later
 */

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protected routes
  const protectedRoutes = [
    '/dashboard',
    '/projects',
    '/customers',
    '/equipment',
    '/loadouts',
    '/team',
    '/time',
    '/invoices',
    '/work-orders',
    '/calculators',
    '/analytics',
    '/settings',
    '/map',
  ];

  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtected) {
    // Mock: Always allow (in real Clerk, check auth here)
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
