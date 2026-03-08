import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Website middleware: adds security headers and request tracing to every response.
 * These headers supplement the ones in next.config.mjs and fire on all requests
 * including soft navigations.
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Generate a unique request ID for tracing / debugging
  const requestId = crypto.randomUUID();
  response.headers.set('X-Request-Id', requestId);

  // Security headers (belt-and-suspenders with next.config)
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images/).*)'],
};
