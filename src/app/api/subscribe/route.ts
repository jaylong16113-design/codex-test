import { NextResponse } from 'next/server'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: '请输入有效的邮箱地址' }, { status: 400 })
    }

    // Store subscription in a local JSON file
    const dataDir = join(process.cwd(), 'data')
    const filePath = join(dataDir, 'subscribers.json')

    if (!existsSync(dataDir)) {
      mkdirSync(dataDir, { recursive: true })
    }

    let subscribers: { email: string; subscribed_at: string }[] = []
    if (existsSync(filePath)) {
      try {
        subscribers = JSON.parse(readFileSync(filePath, 'utf-8'))
      } catch {
        subscribers = []
      }
    }

    // Check for duplicate
    if (subscribers.some((s) => s.email === email)) {
      return NextResponse.json({ message: '该邮箱已订阅' }, { status: 200 })
    }

    subscribers.push({
      email,
      subscribed_at: new Date().toISOString(),
    })

    writeFileSync(filePath, JSON.stringify(subscribers, null, 2), 'utf-8')

    return NextResponse.json({ message: '订阅成功！感谢你的关注 🎉' }, { status: 200 })
  } catch (error) {
    console.error('Subscribe error:', error)
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 })
  }
}
