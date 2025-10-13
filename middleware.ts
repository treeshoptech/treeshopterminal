import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Only public route is homepage (which has modal login)
// All API webhooks should be public
const isPublicRoute = createRouteMatcher([
  '/',
  '/api/webhooks(.*)',
]);

export default clerkMiddleware(async (auth, request) => {
  // Homepage shows modal login overlay - don't protect it
  // Everything else requires authentication
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
