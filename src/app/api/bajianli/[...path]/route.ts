import { NextRequest, NextResponse } from 'next/server'

const BACKEND = 'http://122.51.220.35'

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) { return proxy(request, params.path) }
export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) { return proxy(request, params.path) }
export async function PUT(request: NextRequest, { params }: { params: { path: string[] } }) { return proxy(request, params.path) }
export async function DELETE(request: NextRequest, { params }: { params: { path: string[] } }) { return proxy(request, params.path) }
export async function PATCH(request: NextRequest, { params }: { params: { path: string[] } }) { return proxy(request, params.path) }

async function proxy(request: NextRequest, path: string[]) {
  try {
    const pathStr = path.join('/')
    const query = request.nextUrl.search
    const url = `${BACKEND}/api/bajianli/${pathStr}${query}`
    let body: BodyInit | null = null
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      body = await request.text()
    }
    const headers: Record<string, string> = {}
    const auth = request.headers.get('authorization')
    if (auth) headers['Authorization'] = auth
    const ct = request.headers.get('content-type')
    if (ct) headers['Content-Type'] = ct
    const res = await fetch(url, { method: request.method, headers, body })
    const resBody = await res.text()
    return new NextResponse(resBody, {
      status: res.status,
      headers: { 'Content-Type': res.headers.get('content-type') || 'application/json' },
    })
  } catch (err: any) {
    return NextResponse.json({ detail: `Proxy error: ${err.message}` }, { status: 502 })
  }
}
