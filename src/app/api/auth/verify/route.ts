import { NextRequest, NextResponse } from 'next/server'

async function createAuthToken(password: string) {
  const bytes = new TextEncoder().encode(`agentclaw:${password}`)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

export async function POST(request: NextRequest) {
  const { password } = await request.json()
  const expected = process.env.TOOLS_PASSWORD

  if (!expected) {
    return NextResponse.json(
      { error: 'Authentication is not configured' },
      { status: 503 },
    )
  }

  if (password === expected) {
    const response = NextResponse.json({ ok: true })
    response.cookies.set('tools_token', await createAuthToken(expected), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })
    return response
  }

  return NextResponse.json({ error: '密码错误' }, { status: 401 })
}
