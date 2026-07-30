import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PRIVATE_PATHS = [
  '/axiom',
  '/worker',
  '/nebula',
  '/forge',
  '/blaze',
  '/hunter',
  '/mist',
  '/lens',
  '/pulse',
  '/growth',
  '/cascade',
  '/compass',
  '/study',
  '/burberry-video',
  '/dashboard',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isPrivatePage = PRIVATE_PATHS.some(
    (path) => pathname === path || pathname.startsWith(path + '/'),
  )

  if (!isPrivatePage) return NextResponse.next()

  const token = request.cookies.get('tools_token')?.value
  const password = process.env.TOOLS_PASSWORD

  if (!password || token !== password) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  const response = NextResponse.next()
  response.cookies.set('tools_token', password, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
  return response
}

export const config = {
  matcher: [
    '/axiom/:path*',
    '/worker/:path*',
    '/nebula/:path*',
    '/forge/:path*',
    '/blaze/:path*',
    '/hunter/:path*',
    '/mist/:path*',
    '/lens/:path*',
    '/pulse/:path*',
    '/growth/:path*',
    '/cascade/:path*',
    '/compass/:path*',
    '/study/:path*',
    '/burberry-video/:path*',
    '/dashboard/:path*',
  ],
}
