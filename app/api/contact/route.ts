import { NextRequest } from 'next/server'

// ─── Rate limiter ────────────────────────────────────────────────────────────

const RATE_LIMIT = 3
const RATE_WINDOW_MS = 60 * 60 * 1000 // 1 hour

const ipMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = ipMap.get(ip)

  if (!entry || now >= entry.resetAt) {
    ipMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return true
  }

  if (entry.count >= RATE_LIMIT) return false

  entry.count++
  return true
}

// ─── Labels ──────────────────────────────────────────────────────────────────

const PROJECT_TYPE_LABELS: Record<string, string> = {
  landing: 'Лендинг (от 15 000 ₽)',
  site: 'Сайт-визитка (от 40 000 ₽)',
  app: 'Веб-приложение (от 100 000 ₽)',
  other: 'Другое / пока не знаю',
}

const BUDGET_LABELS: Record<string, string> = {
  '10-20': '10 000 — 20 000 ₽',
  '20-50': '20 000 — 50 000 ₽',
  '50-100': '50 000 — 100 000 ₽',
  '100+': 'от 100 000 ₽',
}

// ─── Handler ─────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  // 405 — explicit guard (Next.js also enforces this via named exports)
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', {
      status: 405,
      headers: { Allow: 'POST' },
    })
  }

  // Rate limiting
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'

  if (!checkRateLimit(ip)) {
    return Response.json(
      { error: 'Слишком много заявок, попробуйте позже' },
      { status: 429 }
    )
  }

  // Parse body
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Неверный формат запроса' }, { status: 400 })
  }

  const { name, phone, projectType, budget, description } = body as Record<string, string>

  // Field validation
  if (!name || String(name).trim().length < 2) {
    return Response.json({ error: 'Имя должно содержать не менее 2 символов' }, { status: 400 })
  }
  if (!phone || String(phone).trim().length < 7) {
    return Response.json({ error: 'Телефон должен содержать не менее 7 символов' }, { status: 400 })
  }
  if (description && String(description).length > 1000) {
    return Response.json({ error: 'Описание не должно превышать 1000 символов' }, { status: 400 })
  }

  // Telegram
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!token || !chatId) {
    return Response.json({ error: 'Telegram не настроен' }, { status: 500 })
  }

  const text = [
    '🔔 *Новая заявка с сайта WebScaleKv*',
    '',
    `👤 *Имя:* ${String(name).trim()}`,
    `📞 *Телефон:* ${String(phone).trim()}`,
    `📋 *Тип проекта:* ${(PROJECT_TYPE_LABELS[projectType] ?? projectType) || 'Не указан'}`,
    `💰 *Бюджет:* ${(BUDGET_LABELS[budget] ?? budget) || 'Не указан'}`,
    `📝 *Описание:* ${description || 'Не указано'}`,
  ].join('\n')

  const tgResponse = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
    }
  )

  if (!tgResponse.ok) {
    const error = await tgResponse.text()
    console.error('Telegram API error:', error)
    return Response.json({ error: 'Не удалось отправить сообщение' }, { status: 502 })
  }

  return Response.json({ ok: true })
}
