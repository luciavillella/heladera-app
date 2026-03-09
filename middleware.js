import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhook-premium(.*)',
  '/api/favoritos(.*)',
  '/privacy(.*)',
  '/terms(.*)',
  '/offline(.*)',
  '/manifest.json',
  '/sw.js',
  '/icon-192-naranja.png',
  '/icon-512-naranja.png',
  '/logo.portal.png',
  '/.well-known(.*)',
])

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
