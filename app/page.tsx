'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView as useInViewFM } from 'framer-motion'
import { Drawer } from 'vaul'
import { toast } from 'sonner'

// ─── Data ─────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { href: '#services', label: 'Услуги' },
  { href: '#cases', label: 'Кейсы' },
  { href: '#process', label: 'Процесс' },
  { href: '#contact', label: 'Контакт' },
]

const MARQUEE_ITEMS = [
  'Барбершопы', 'Автосервисы', 'Рестораны', 'Косметология', 'Эксперты',
  'Telegram-бизнесы', 'Локальные компании', 'Студии красоты', 'Клиники',
  'Репетиторы', 'Фотографы', 'Юристы',
]

const HERO_LINE1 = 'Сайты которые'
const HERO_LINE2_PLAIN = 'работают '
const HERO_LINE2_ACCENT = 'с AI.'

const SERVICES = [
  {
    badge: 'Start', icon: '🚀', title: 'Лендинг',
    price: 'от 15 000 ₽', duration: '3–5 дней', highlight: false,
    desc: 'Один убедительный экран, который превращает посетителей в клиентов. Идеально для старта.',
    features: ['Индивидуальный дизайн', 'Адаптив для всех устройств', 'Форма заявок с уведомлением', 'Деплой на Vercel', 'Подключение домена'],
  },
  {
    badge: 'Pro', icon: '⭐', title: 'Сайт-визитка',
    price: 'от 40 000 ₽', duration: '7–10 дней', highlight: true,
    desc: 'Полноценное присутствие в интернете: несколько страниц, SEO и возможность редактировать контент самостоятельно.',
    features: ['Всё из Start', 'До 5 страниц', 'CMS для редактирования', 'SEO-оптимизация', 'Подключение аналитики', '1 месяц поддержки'],
  },
]

const PROCESS_STEPS = [
  { num: '01', icon: '📞', title: 'Звонок', duration: '15 минут', desc: 'Обсуждаем задачу, аудиторию и цели. Без обязательств.' },
  { num: '02', icon: '📋', title: 'Предложение', duration: '24 часа', desc: 'Готовим детальный план, референсы и финальную цену.' },
  { num: '03', icon: '⚡', title: 'Разработка', duration: '1–2 недели', desc: 'AI-ускоренный процесс: дизайн, код, настройка.' },
  { num: '04', icon: '✏️', title: 'Правки', duration: '3 дня', desc: 'Доводим результат до идеала по вашим комментариям.' },
  { num: '05', icon: '🎯', title: 'Запуск', duration: 'День X', desc: 'Деплой, домен, передача всех доступов. Вы — владелец.' },
]

const WHY_AI = [
  { icon: '⚡', title: 'В 3× быстрее', desc: 'Традиционная разработка занимает месяцы. Мы — недели, иногда дни.' },
  { icon: '🏗️', title: 'Современный код', desc: 'Никакого технического долга. Чистая архитектура с первого дня.' },
  { icon: '✅', title: 'Автопроверки', desc: 'Качество контролируется автоматически на каждом шаге разработки.' },
  { icon: '🔄', title: 'Быстрые правки', desc: 'Итерации занимают часы, а не дни. Вы видите результат сразу.' },
  { icon: '💰', title: 'Честная цена', desc: 'Меньше ручного труда — ниже стоимость при том же качестве.' },
  { icon: '🔮', title: 'Актуальный стек', desc: 'Используем инструменты 2025 года, а не легаси 2010-го.' },
]

const CASES = [
  {
    image: '/aterra.png',
    title: 'Aterra Agency',
    category: 'Лендинг · Start',
    url: 'https://aterraagency.com',
    result: 'AI маркетинговое агентство',
    price: 'Start · 20 000 ₽',
    desc: 'Лендинг для нишевого агентства под solar installers. Тёмный tech-стиль, анимированный hero, секции услуг и roadmap клиента.',
    tags: ['Next.js', 'Анимации', 'Лендинг'],
    color: '#22c55e',
  },
  {
    image: '/helperpatch.png',
    title: 'Helperpatch',
    category: 'Интернет-магазин · Pro',
    url: 'https://helperpatch.com',
    result: 'E-commerce магазин',
    price: 'Pro · 50 000 ₽',
    desc: 'Интернет-магазин wellness патчей с каталогом продуктов, корзиной и оформлением заказа.',
    tags: ['E-commerce', 'Продукт', 'Магазин'],
    color: '#10b981',
  },
  {
    image: null,
    title: 'Ваш проект',
    category: 'Любой формат',
    url: '#contact',
    result: 'Следующий кейс',
    price: null,
    desc: 'Ваш бизнес может стать следующим. Обсудим задачу и запустим сайт который работает на вас 24/7.',
    tags: ['Лендинг', 'Магазин', 'Приложение'],
    color: '#6366f1',
  },
]

const WITHOUT_SITE = [
  '73% людей ищут услуги в интернете перед покупкой',
  'Клиент не нашёл вас — ушёл к конкуренту за 8 секунд',
  'Instagram и Telegram — арендованные платформы. Заблокируют — потеряете всё',
  'Без сайта вы не существуете для Google и Яндекс',
  'Нет сайта = нет доверия для клиентов 35+',
]

const WITH_SITE = [
  'Клиенты находят вас 24/7 даже пока вы спите',
  'Первое впечатление за 0.05 секунды — современный дизайн закрывает сделку',
  'Ваша платформа, ваши правила, ваши данные',
  'SEO приводит бесплатный трафик месяцами',
  'Сайт работает как лучший менеджер по продажам',
]

const FUNNEL_STEPS = [
  { icon: '🔍', label: 'ТРАФИК', desc: '1000 человек нашли вас в поиске', num: 1000, pct: 100 },
  { icon: '👀', label: 'ВНИМАНИЕ', desc: '850 заинтересовались — дизайн держит на сайте', num: 850, pct: 85 },
  { icon: '🤔', label: 'ДОВЕРИЕ', desc: '600 изучили услуги, кейсы, цены', num: 600, pct: 60 },
  { icon: '📞', label: 'ДЕЙСТВИЕ', desc: '350 нажали кнопку или заполнили форму', num: 350, pct: 35 },
  { icon: '💰', label: 'КЛИЕНТ', desc: '200 стали реальными клиентами', num: 200, pct: 20 },
]

const GUARANTEES = [
  'Фиксированная цена — никаких скрытых доплат',
  'Сроки в договоре — опоздали = скидка 10%',
  '30 дней поддержки после запуска бесплатно',
  'Правки до результата — не бросаем на полпути',
  'Все исходники и доступы — ваша собственность',
]

const TRANSPARENCY = [
  { step: '01', text: 'Договор и предоплата 50%', sub: 'начинаем работу' },
  { step: '02', text: 'Макет за 3 дня', sub: 'согласовываем вместе' },
  { step: '03', text: 'Разработка', sub: 'ежедневные апдейты в Telegram' },
  { step: '04', text: 'Сдача + остаток оплаты', sub: 'все доступы переходят вам' },
]

const FAQ_ITEMS = [
  { q: 'Я не разбираюсь в технологиях — это проблема?', a: 'Нет. Мы берём на себя всё техническое. Вам нужно только рассказать о бизнесе и принимать решения по дизайну.' },
  { q: 'Что если мне не понравится результат?', a: 'Делаем правки до тех пор пока вы не скажете "да". Это включено в стоимость.' },
  { q: 'Буду ли я владельцем сайта?', a: 'Да. Домен, хостинг, код — всё переходит вам после оплаты.' },
  { q: 'Как быстро окупится сайт?', a: 'В среднем за 1–3 месяца, если у бизнеса уже есть поток клиентов.' },
  { q: 'Можно ли потом добавить новые функции?', a: 'Да. Мы строим на современном стеке — расширить можно всегда.' },
]

const FIRST_CALL_POINTS = [
  { icon: '📋', text: 'Обсудим задачу и цели вашего сайта' },
  { icon: '🎯', text: 'Определим целевую аудиторию' },
  { icon: '💡', text: 'Предложим лучшее техническое решение' },
  { icon: '📅', text: 'Назовём точные сроки и стоимость' },
  { icon: '🚀', text: 'Ответим на все вопросы без обязательств' },
]

const TERMINAL_LINES = [
  '> Инициализация WebScaleKv v2.0...',
  '> Загрузка AI-модулей............. ✓',
  '> Подключение к серверам.......... ✓',
  '> Активация дизайн-системы........ ✓',
  '> Добро пожаловать.',
]

// ─── Animation constants ───────────────────────────────────────────────────────

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const fadeUp = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6, ease: EASE },
}

const clipReveal = {
  initial: { clipPath: 'inset(0 0 100% 0)' },
  whileInView: { clipPath: 'inset(0 0 0% 0)' } as const,
  viewport: { once: true },
  transition: { duration: 0.7, ease: EASE },
}

// ─── Shared components ─────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="flex justify-center mb-5"
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      <span className="px-3 py-1 rounded-full border border-[#6366f1]/30 bg-[#6366f1]/10 text-[#6366f1] text-xs font-semibold uppercase tracking-widest">
        {children}
      </span>
    </motion.div>
  )
}

function SliderField({ label, value, min, max, step, onChange, fmt }: {
  label: string; value: number; min: number; max: number; step: number
  onChange: (v: number) => void; fmt: (v: number) => string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between">
        <span className="text-xs text-zinc-500">{label}</span>
        <span className="text-sm font-semibold text-[#818cf8]">{fmt(value)}</span>
      </div>
      <div className="flex items-center min-h-[44px]">
        <input type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="w-full" />
      </div>
    </div>
  )
}

// ─── ParticleField ────────────────────────────────────────────────────────────

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const COUNT = 80
    const MAX_DIST = 120

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const pts = Array.from({ length: COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      r: Math.random() * 1.5 + 0.8,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of pts) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(99,102,241,0.55)'
        ctx.fill()
      }
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x
          const dy = pts[i].y - pts[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < MAX_DIST) {
            ctx.beginPath()
            ctx.moveTo(pts[i].x, pts[i].y)
            ctx.lineTo(pts[j].x, pts[j].y)
            ctx.strokeStyle = `rgba(99,102,241,${(1 - dist / MAX_DIST) * 0.25})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }
      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animId)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} />
}

// ─── Main component ─────────────────────────────────────────────────────────────

export default function Home() {
  // Terminal boot
  const [showTerminal, setShowTerminal] = useState(true)
  const [termLines, setTermLines] = useState<string[]>([])
  const [termFading, setTermFading] = useState(false)
  const [showHero, setShowHero] = useState(false)

  // Custom cursor
  const [cursor, setCursor] = useState({ x: -200, y: -200 })
  const [cursorBig, setCursorBig] = useState(false)
  const targetXY = useRef({ x: -200, y: -200 })
  const rafRef = useRef<number>(0)

  // UI state
  const [navScrolled, setNavScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [faqOpen, setFaqOpen] = useState<number | null>(null)

  // Case card tilts
  const [tilts, setTilts] = useState([{ rx: 0, ry: 0 }, { rx: 0, ry: 0 }, { rx: 0, ry: 0 }])

  // ROI calculator
  const [visitors, setVisitors] = useState(1000)
  const [avgCheck, setAvgCheck] = useState(5000)
  const [conv, setConv] = useState(3)
  const revenue = Math.floor(visitors * (conv / 100) * avgCheck)
  const daysROI = revenue > 0 ? Math.ceil((30000 / revenue) * 30) : 0

  // Process line
  const processRef = useRef<HTMLDivElement>(null)
  const processInView = useInViewFM(processRef, { once: true, margin: '-100px' })

  // Form state
  const [form, setForm] = useState({ name: '', phone: '', projectType: '', budget: '', description: '' })
  const [submitting, setSubmitting] = useState(false)

  // Effects
  useEffect(() => {
    const onMove = (e: MouseEvent) => { targetXY.current = { x: e.clientX, y: e.clientY } }
    const onOver = (e: MouseEvent) => {
      setCursorBig(!!(e.target as HTMLElement).closest('a,button,input,textarea,select'))
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseover', onOver)
    const loop = () => {
      setCursor(p => ({ x: p.x + (targetXY.current.x - p.x) * 0.13, y: p.y + (targetXY.current.y - p.y) * 0.13 }))
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  useEffect(() => {
    const fn = () => setNavScrolled(window.scrollY > 50)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    TERMINAL_LINES.forEach((line, i) => {
      timers.push(setTimeout(() => setTermLines(p => [...p, line]), 300 + i * 420))
    })
    const fadeDelay = 300 + TERMINAL_LINES.length * 420 + 600
    timers.push(setTimeout(() => { setTermFading(true); setShowHero(true) }, fadeDelay))
    timers.push(setTimeout(() => setShowTerminal(false), fadeDelay + 700))
    return () => timers.forEach(clearTimeout)
  }, [])

  // Handlers
  function tilt(i: number, e: React.MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect()
    setTilts(p => p.map((t, idx) => idx !== i ? t : {
      rx: ((e.clientY - r.top) / r.height - 0.5) * -10,
      ry: ((e.clientX - r.left) / r.width - 0.5) * 10,
    }))
  }
  function resetTilt(i: number) {
    setTilts(p => p.map((t, idx) => idx !== i ? t : { rx: 0, ry: 0 }))
  }
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
  }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (!res.ok) throw new Error()
      setForm({ name: '', phone: '', projectType: '', budget: '', description: '' })
      toast.success('Заявка отправлена!', { description: 'Свяжемся с вами в течение рабочего дня.', duration: 5000 })
    } catch {
      toast.error('Не удалось отправить заявку', { description: 'Попробуйте ещё раз или напишите нам напрямую.' })
    } finally { setSubmitting(false) }
  }

  const grad = { background: 'linear-gradient(135deg,#6366f1,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }
  const inputCls = 'w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-[#6366f1]/60 transition-colors duration-200'

  return (
    <div className="scanlines min-h-screen bg-[#050505] text-white overflow-x-hidden">

      <ParticleField />

      {/* ── Terminal boot ─────────────────────────────────────────────────── */}
      {showTerminal && (
        <div
          className="fixed inset-0 z-[9990] bg-[#050505] flex items-center justify-center pointer-events-none transition-opacity duration-500"
          style={{ opacity: termFading ? 0 : 1 }}
        >
          <div className="font-mono text-green-400 text-sm max-w-md w-full px-8">
            {termLines.map((line, i) => (
              <div key={i} className="mb-2 animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>{line}</div>
            ))}
            {termLines.length > 0 && termLines.length < TERMINAL_LINES.length && (
              <span className="inline-block w-2 h-4 bg-green-400 animate-pulse-slow align-middle" />
            )}
          </div>
        </div>
      )}

      {/* ── Custom cursor ─────────────────────────────────────────────────── */}
      <div className="hidden md:block fixed z-[9999] pointer-events-none rounded-full border border-[#6366f1]/70 transition-[width,height,background] duration-200"
        style={{ left: cursor.x, top: cursor.y, width: cursorBig ? 52 : 22, height: cursorBig ? 52 : 22, transform: 'translate(-50%,-50%)', background: cursorBig ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.2)' }} />

      {/* ── Navbar ────────────────────────────────────────────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navScrolled ? 'border-b border-white/10 bg-[#050505]/90 backdrop-blur-md' : 'bg-transparent'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14 sm:h-16">
          <span className="glitch text-xl font-bold tracking-tight select-none shrink-0">
            <span className="text-[#6366f1]">Web</span>ScaleKv
          </span>
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(l => (
              <a key={l.href} href={l.href} className="text-sm text-zinc-400 hover:text-white transition-colors duration-200">{l.label}</a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <a href="#contact" className="hidden md:inline-flex px-5 py-2 rounded-full bg-[#6366f1] text-white text-sm font-medium hover:bg-[#4f46e5] transition-all duration-200 hover:shadow-lg hover:shadow-[#6366f1]/30">
              Получить предложение
            </a>
            {/* Mobile menu — Vaul drawer */}
            <Drawer.Root open={mobileOpen} onOpenChange={setMobileOpen}>
              <Drawer.Trigger asChild>
                <button className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-white/10 text-zinc-400 hover:text-white transition-colors duration-200" aria-label="Меню">
                  ☰
                </button>
              </Drawer.Trigger>
              <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]" />
                <Drawer.Content className="fixed bottom-0 left-0 right-0 z-[70] flex flex-col bg-[#0d0d0d] rounded-t-[16px] border-t border-white/10 outline-none">
                  <div className="mx-auto mt-3 mb-1 w-12 h-1.5 rounded-full bg-white/20 shrink-0" />
                  <div className="px-6 pb-10 pt-4 flex flex-col gap-3">
                    <span className="text-xl font-bold select-none mb-1">
                      <span className="text-[#6366f1]">Web</span>ScaleKv
                    </span>
                    <div className="h-px bg-white/8 mb-1" />
                    {NAV_LINKS.map(l => (
                      <a
                        key={l.href}
                        href={l.href}
                        onClick={() => setMobileOpen(false)}
                        className="text-zinc-300 hover:text-white py-2.5 text-base transition-colors duration-200 border-b border-white/5 last:border-0"
                      >
                        {l.label}
                      </a>
                    ))}
                    <a
                      href="#contact"
                      onClick={() => setMobileOpen(false)}
                      className="mt-3 py-3.5 rounded-full bg-[#6366f1] text-white text-sm font-semibold text-center hover:bg-[#4f46e5] transition-colors duration-200"
                    >
                      Получить предложение
                    </a>
                  </div>
                </Drawer.Content>
              </Drawer.Portal>
            </Drawer.Root>
          </div>
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-14 sm:pt-16 overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-50 pointer-events-none" />
        <div className="absolute -top-20 -left-40 w-[700px] h-[700px] bg-[#6366f1]/10 rounded-full blur-[150px] pointer-events-none animate-float-slow" />
        <div className="absolute bottom-0 -right-40 w-[600px] h-[600px] bg-[#a78bfa]/8 rounded-full blur-[130px] pointer-events-none animate-float-alt" />

        {/* Floating cards — xl+ only */}
        <div className="hidden xl:block absolute left-10 top-[35%] glass rounded-2xl px-4 py-3 text-sm font-medium shadow-2xl animate-float" style={{ animationDuration: '7s' }}>
          <span className="text-yellow-400 mr-2">⚡</span>Сайт готов за 4 дня
        </div>
        <div className="hidden xl:block absolute right-10 top-[30%] glass rounded-2xl px-4 py-3 text-sm font-medium shadow-2xl animate-float-alt" style={{ animationDuration: '9s' }}>
          <span className="text-green-400 mr-2">🚀</span>+40% конверсия
        </div>
        <div className="hidden xl:block absolute right-16 bottom-[30%] glass rounded-2xl px-4 py-3 text-sm font-medium shadow-2xl animate-float-slow" style={{ animationDuration: '11s' }}>
          <span className="text-blue-400 mr-2">✓</span>Клиент доволен
        </div>

        <div className="relative flex flex-col items-center w-full">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#6366f1]/30 bg-[#6366f1]/10 text-[#6366f1] text-sm font-medium mb-8 sm:mb-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#6366f1] animate-pulse-slow" />
            AI-first веб-агентство для малого бизнеса
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold tracking-tight leading-[1.05] mb-6 max-w-5xl" style={{ perspective: '800px' }}>
            <div className="mb-1">
              {HERO_LINE1.split('').map((ch, i) => (
                <span key={i} className="hero-char" style={{ animationDelay: `${0.3 + i * 0.028}s` }}>
                  {ch === ' ' ? ' ' : ch}
                </span>
              ))}
            </div>
            <div>
              {HERO_LINE2_PLAIN.split('').map((ch, i) => (
                <span key={i} className="hero-char" style={{ animationDelay: `${0.3 + (HERO_LINE1.length + i) * 0.028}s` }}>
                  {ch === ' ' ? ' ' : ch}
                </span>
              ))}
              <span style={grad}>
                {HERO_LINE2_ACCENT.split('').map((ch, i) => (
                  <span key={i} className="hero-char" style={{ animationDelay: `${0.3 + (HERO_LINE1.length + HERO_LINE2_PLAIN.length + i) * 0.028}s` }}>
                    {ch === ' ' ? ' ' : ch}
                  </span>
                ))}
              </span>
            </div>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-xl leading-relaxed mb-8 sm:mb-10 animate-fade-in-up" style={{ animationDelay: '1.3s' }}>
            Разрабатываем сайты и веб-приложения для малого бизнеса.
            AI-инструменты дают скорость в 3× при той же стоимости.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto mb-10 sm:mb-14 animate-fade-in-up" style={{ animationDelay: '1.5s' }}>
            <a href="#contact" className="btn-glow w-full sm:w-auto text-center px-8 py-4 rounded-full bg-[#6366f1] text-white font-semibold hover:bg-[#4f46e5] transition-colors duration-200 text-base sm:text-lg">
              Обсудить проект →
            </a>
            <a href="#cases" className="w-full sm:w-auto text-center px-8 py-4 rounded-full border border-white/15 text-white font-semibold hover:border-white/30 hover:bg-white/5 transition-all duration-200 text-base sm:text-lg">
              Смотреть кейсы
            </a>
          </div>

          {/* Bento stats */}
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-lg sm:max-w-none mb-10 sm:mb-14 animate-fade-in-up" style={{ animationDelay: '1.7s' }}>
            {[{ v: '14 дней', l: 'среднее время запуска' }, { v: '3×', l: 'быстрее конкурентов' }, { v: '100%', l: 'клиентов рекомендуют' }].map(s => (
              <div key={s.v} className="glass rounded-2xl px-5 py-4 text-center flex-1">
                <div className="text-xl sm:text-2xl font-bold" style={grad}>{s.v}</div>
                <div className="text-xs text-zinc-500 mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative w-screen overflow-hidden border-t border-b border-white/6 py-4 bg-white/[0.01]">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
              <span key={i} className="inline-flex items-center gap-3 text-zinc-500 text-sm font-medium px-5">
                <span className="text-[#6366f1] text-xs">◆</span>{item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ─────────────────────────────────────────────────────── */}
      <section id="services" className="py-16 sm:py-28 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <SectionLabel>Услуги</SectionLabel>
          <motion.h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4" {...clipReveal}>
            Выберите свой формат
          </motion.h2>
          <motion.p className="text-zinc-400 text-center mb-10 sm:mb-16 max-w-lg mx-auto" {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
            Два пакета под разные задачи и бюджеты. Оба включают дизайн, разработку и запуск.
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {SERVICES.map((s, i) => (
              <motion.div
                key={s.badge}
                className="h-full"
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, ease: EASE, delay: i * 0.08 }}
                whileHover={{ y: -6, transition: { duration: 0.2, ease: 'easeOut' } }}
              >
                <div className={`relative group rounded-2xl p-6 sm:p-8 border flex flex-col gap-5 h-full ${s.highlight ? 'border-[#6366f1]/60 bg-[#6366f1]/8 shadow-2xl shadow-[#6366f1]/10' : 'border-white/10 bg-white/[0.02] hover:border-[#6366f1]/40 hover:bg-[#6366f1]/5'} transition-colors duration-200`}>
                  {s.highlight && <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#6366f1] text-white text-xs font-semibold shadow-lg shadow-[#6366f1]/40">Популярный выбор</div>}
                  <div className="flex items-center justify-between">
                    <span className="text-4xl">{s.icon}</span>
                    <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${s.highlight ? 'border-[#6366f1]/40 bg-[#6366f1]/20 text-[#818cf8]' : 'border-white/10 bg-white/5 text-zinc-500'}`}>{s.badge}</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{s.title}</h3>
                    <p className="text-zinc-500 text-sm leading-relaxed">{s.desc}</p>
                  </div>
                  <div className="flex items-baseline gap-2 py-3 border-y border-white/6">
                    <span className="text-2xl font-bold text-[#6366f1]">{s.price}</span>
                    <span className="text-zinc-600 text-sm">· {s.duration}</span>
                  </div>
                  <ul className="flex flex-col gap-2.5 flex-1">
                    {s.features.map(f => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-zinc-300">
                        <span className="text-[#6366f1] shrink-0 mt-0.5 font-bold">✓</span>{f}
                      </li>
                    ))}
                  </ul>
                  <a href="#contact" className={`mt-2 py-3.5 rounded-full text-center text-sm font-semibold transition-colors duration-200 ${s.highlight ? 'bg-[#6366f1] text-white hover:bg-[#4f46e5] shadow-lg shadow-[#6366f1]/30' : 'border border-white/15 text-white hover:border-[#6366f1]/50 hover:text-[#818cf8]'}`}>
                    Заказать {s.title}
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process ──────────────────────────────────────────────────────── */}
      <section id="process" className="py-16 sm:py-28 px-4 sm:px-6 border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-6xl mx-auto">
          <SectionLabel>Процесс</SectionLabel>
          <motion.h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4" {...clipReveal}>
            Как мы работаем
          </motion.h2>
          <motion.p className="text-zinc-400 text-center mb-10 sm:mb-12 max-w-md mx-auto" {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
            Прозрачный процесс от первого звонка до финального запуска
          </motion.p>
          <div ref={processRef} className="hidden lg:block relative h-px bg-white/5 mb-2 mx-8">
            <div className={`process-line ${processInView ? 'active' : ''}`} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {PROCESS_STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                className="h-full"
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, ease: EASE, delay: i * 0.08 }}
                whileHover={{ y: -4, transition: { duration: 0.2, ease: 'easeOut' } }}
              >
                <div className="flex flex-col items-center text-center gap-3 p-6 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-[#6366f1]/30 hover:bg-[#6366f1]/5 transition-colors duration-200 group h-full">
                  <div className="w-12 h-12 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-2xl group-hover:border-[#6366f1]/40 transition-colors duration-200">{step.icon}</div>
                  <div className="text-xs font-bold text-[#6366f1] tracking-widest">{step.num}</div>
                  <div>
                    <h3 className="font-bold text-base mb-0.5">{step.title}</h3>
                    <div className="text-xs text-zinc-600 mb-2">{step.duration}</div>
                    <p className="text-xs text-zinc-400 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why AI ───────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-28 px-4 sm:px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <SectionLabel>Преимущества</SectionLabel>
          <motion.h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4" {...clipReveal}>
            Почему <span style={grad}>AI-разработка</span>
          </motion.h2>
          <motion.p className="text-zinc-400 text-center mb-10 sm:mb-16 max-w-lg mx-auto" {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
            AI меняет скорость и стоимость разработки. Вы получаете качественный продукт за время, которое раньше занимало согласование ТЗ.
          </motion.p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {WHY_AI.map((c, i) => (
              <motion.div
                key={c.title}
                className="h-full"
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, ease: EASE, delay: i * 0.08 }}
                whileHover={{ y: -6, transition: { duration: 0.2, ease: 'easeOut' } }}
              >
                <div className="group p-6 sm:p-7 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-[#6366f1]/40 hover:bg-[#6366f1]/5 transition-colors duration-200 flex gap-5 h-full">
                  <span className="text-3xl shrink-0 mt-0.5">{c.icon}</span>
                  <div>
                    <h3 className="font-bold text-lg mb-1.5 group-hover:text-[#818cf8] transition-colors duration-200">{c.title}</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">{c.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cases ────────────────────────────────────────────────────────── */}
      <section id="cases" className="py-16 sm:py-28 px-4 sm:px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <SectionLabel>Кейсы</SectionLabel>
          <motion.h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4" {...clipReveal}>
            Реальные проекты
          </motion.h2>
          <motion.p className="text-zinc-400 text-center mb-10 sm:mb-16 max-w-md mx-auto" {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
            Результаты, которые говорят сами за себя
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CASES.map((c, i) => (
              <motion.div
                key={c.title}
                className="h-full"
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, ease: EASE, delay: i * 0.08 }}
                whileHover={{ y: -6, transition: { duration: 0.2, ease: 'easeOut' } }}
              >
                <div
                  className="group rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden flex flex-col h-full"
                  style={{
                    transform: `perspective(900px) rotateX(${tilts[i].rx}deg) rotateY(${tilts[i].ry}deg)`,
                    transition: tilts[i].rx === 0 && tilts[i].ry === 0 ? 'transform 0.4s cubic-bezier(0.22,1,0.36,1)' : 'transform 0.08s ease',
                  }}
                  onMouseMove={e => tilt(i, e)}
                  onMouseLeave={() => resetTilt(i)}
                >
                  <div className="relative h-[180px] sm:h-[220px] overflow-hidden shrink-0">
                    {c.image ? (
                      <>
                        <img src={c.image} alt={c.title} className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      </>
                    ) : (
                      <div className="w-full h-full bg-[#0d0d0d] border-b border-dashed border-[#6366f1]/30 flex flex-col items-center justify-center gap-2">
                        <span className="text-4xl text-[#6366f1]/40">+</span>
                        <span className="text-xs text-zinc-600">Ваш проект</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5 sm:p-6 flex flex-col flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs border border-white/10 px-2 py-0.5 rounded-full text-zinc-500">{c.category}</span>
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: c.color }} />
                    </div>
                    <h3 className="font-bold text-lg mt-3 mb-0.5">{c.title}</h3>
                    <p className="text-sm text-zinc-500 mb-2">{c.result}</p>
                    {c.price && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#6366f1]/10 border border-[#6366f1]/20 text-[#6366f1] mb-3">
                        ₽ {c.price}
                      </span>
                    )}
                    <p className="text-sm text-zinc-400 leading-relaxed mb-4 flex-1">{c.desc}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {c.tags.map(tag => (
                        <span key={tag} className="text-xs px-2.5 py-1 rounded-full border border-white/10 text-zinc-500">{tag}</span>
                      ))}
                    </div>
                    {c.image ? (
                      <a
                        href={c.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 rounded-full border border-white/10 text-zinc-400 text-sm font-medium text-center transition-all duration-200"
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = c.color; (e.currentTarget as HTMLElement).style.color = '#fff' }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = ''; (e.currentTarget as HTMLElement).style.color = '' }}
                      >
                        Посмотреть сайт →
                      </a>
                    ) : (
                      <a href="#contact" className="w-full py-2.5 rounded-full border border-[#6366f1]/40 text-[#6366f1] text-sm font-medium text-center transition-colors duration-200 hover:bg-[#6366f1] hover:text-white">
                        Обсудить проект →
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why site ─────────────────────────────────────────────────────── */}
      <section id="why-site" className="py-16 sm:py-28 px-4 sm:px-6 border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-6xl mx-auto">
          <SectionLabel>Зачем сайт</SectionLabel>
          <motion.h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-3" {...clipReveal}>
            Без сайта вы теряете клиентов<br /><span style={grad}>прямо сейчас</span>
          </motion.h2>
          <motion.p className="text-zinc-400 text-center mb-10 sm:mb-16 max-w-lg mx-auto" {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
            73% людей ищут услуги в интернете перед покупкой. Вопрос лишь в том — найдут ли они вас.
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 sm:mb-14">
            <motion.div className="h-full" {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.05 }}>
              <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 sm:p-8 h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 font-bold text-sm">✗</div>
                  <h3 className="font-bold text-lg text-red-400">Без сайта</h3>
                </div>
                <ul className="flex flex-col gap-4">
                  {WITHOUT_SITE.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-zinc-400">
                      <span className="text-red-500 shrink-0 mt-0.5">✗</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
            <motion.div className="h-full" {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.13 }}>
              <div className="rounded-2xl border border-[#6366f1]/30 bg-[#6366f1]/8 p-6 sm:p-8 h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-[#6366f1]/20 flex items-center justify-center text-[#6366f1] font-bold text-sm">✓</div>
                  <h3 className="font-bold text-lg text-[#818cf8]">С сайтом WebScaleKv</h3>
                </div>
                <ul className="flex flex-col gap-4">
                  {WITH_SITE.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-zinc-300">
                      <span className="text-[#6366f1] shrink-0 mt-0.5 font-bold">✓</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
          <motion.blockquote className="border-l-4 border-[#6366f1] pl-6 max-w-3xl mx-auto" {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.15 }}>
            <p className="text-lg sm:text-xl md:text-2xl font-medium text-zinc-300 leading-relaxed italic">
              "Сайт — это единственный менеджер по продажам который работает 24/7, никогда не болеет и не просит зарплату."
            </p>
          </motion.blockquote>
        </div>
      </section>

      {/* ── Conversion / Funnel ──────────────────────────────────────────── */}
      <section id="conversion" className="py-16 sm:py-28 px-4 sm:px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <SectionLabel>Конверсия</SectionLabel>
          <motion.h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-3" {...clipReveal}>
            Как работает конверсия
          </motion.h2>
          <motion.p className="text-zinc-400 text-center mb-10 sm:mb-16 max-w-lg mx-auto" {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
            От незнакомца до клиента — за одно посещение
          </motion.p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 items-start">
            <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.05 }}>
              <div className="flex flex-col gap-2">
                {FUNNEL_STEPS.map((step, i) => (
                  <div
                    key={i}
                    className="funnel-bar transition-all duration-200 hover:brightness-110"
                    style={{ ['--fw' as string]: `${step.pct}%` }}
                  >
                    <div className="rounded-xl p-4 border" style={{ background: `rgba(99,102,241,${0.06 + i * 0.03})`, borderColor: `rgba(99,102,241,${0.15 + i * 0.08})` }}>
                      <div className="flex items-center gap-3">
                        <span className="text-xl shrink-0">{step.icon}</span>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold text-[#6366f1] tracking-widest mb-0.5">{step.label}</div>
                          <div className="text-sm text-zinc-300 truncate">{step.desc}</div>
                        </div>
                        <div className="text-lg font-bold text-white shrink-0">{step.num.toLocaleString('ru')}</div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="mt-4 p-4 rounded-xl border border-[#6366f1]/20 bg-[#6366f1]/5">
                  <p className="text-sm text-zinc-300 font-medium">200 клиентов × 5 000₽ = <span className="text-[#6366f1] font-bold">1 000 000₽/мес</span> с одного канала</p>
                  <p className="text-xs text-zinc-500 mt-1">Это реальные цифры бизнесов с качественным сайтом</p>
                </div>
              </div>
            </motion.div>
            <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.13 }}>
              <div className="glass rounded-2xl p-6 sm:p-8">
                <h3 className="font-bold text-xl mb-7">Калькулятор ROI</h3>
                <div className="flex flex-col gap-6">
                  <SliderField label="Посетителей в месяц" value={visitors} min={100} max={10000} step={100} onChange={setVisitors} fmt={v => v.toLocaleString('ru')} />
                  <SliderField label="Средний чек" value={avgCheck} min={1000} max={50000} step={1000} onChange={setAvgCheck} fmt={v => `${v.toLocaleString('ru')} ₽`} />
                  <SliderField label="Конверсия сайта" value={conv} min={1} max={15} step={0.5} onChange={setConv} fmt={v => `${v}%`} />
                </div>
                <div className="mt-8 p-5 rounded-xl bg-[#6366f1]/10 border border-[#6366f1]/20">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-zinc-400">Выручка с сайта:</span>
                    <span className="text-xl sm:text-2xl font-bold" style={grad}>{revenue.toLocaleString('ru')} ₽/мес</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-zinc-400">Окупаемость сайта:</span>
                    <span className="text-lg font-bold text-white">за {daysROI} дней</span>
                  </div>
                  <div className="mt-3 text-xs text-zinc-600">*При стоимости сайта 30 000 ₽</div>
                </div>
                <a href="#contact" className="mt-5 block py-3 rounded-full bg-[#6366f1] text-white text-sm font-semibold text-center hover:bg-[#4f46e5] transition-colors duration-200">
                  Хочу такой сайт →
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Trust ────────────────────────────────────────────────────────── */}
      <section id="trust" className="py-16 sm:py-28 px-4 sm:px-6 border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-6xl mx-auto">
          <SectionLabel>Доверие</SectionLabel>
          <motion.h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4" {...clipReveal}>
            Нам доверяют потому что<br /><span style={grad}>мы прозрачны</span>
          </motion.h2>
          <motion.p className="text-zinc-400 text-center mb-10 sm:mb-16 max-w-md mx-auto" {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
            Никаких сюрпризов. Всё зафиксировано заранее.
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div className="h-full" {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.05 }}>
              <div className="glass rounded-2xl p-6 sm:p-8 h-full">
                <h3 className="font-bold text-xl mb-6 text-[#818cf8]">Наши гарантии</h3>
                <ul className="flex flex-col gap-4">
                  {GUARANTEES.map((g, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-zinc-300">
                      <span className="text-[#6366f1] shrink-0 mt-0.5 font-bold">✓</span>{g}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
            <motion.div className="h-full" {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
              <div className="glass rounded-2xl p-6 sm:p-8 h-full">
                <h3 className="font-bold text-xl mb-6 text-[#818cf8]">Как проходит работа</h3>
                <div className="flex flex-col gap-5">
                  {TRANSPARENCY.map((t, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-7 h-7 rounded-full border border-[#6366f1]/50 bg-[#6366f1]/10 flex items-center justify-center text-xs font-bold text-[#6366f1] shrink-0">{t.step}</div>
                        {i < TRANSPARENCY.length - 1 && <div className="w-px flex-1 bg-white/5 mt-2 mb-0" />}
                      </div>
                      <div className="pb-4">
                        <div className="font-semibold text-sm text-white">{t.text}</div>
                        <div className="text-xs text-zinc-500 mt-0.5">{t.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
            <motion.div className="h-full" {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.15 }}>
              <div className="glass rounded-2xl p-6 sm:p-8 h-full">
                <h3 className="font-bold text-xl mb-6 text-[#818cf8]">Частые вопросы</h3>
                <div className="flex flex-col gap-2">
                  {FAQ_ITEMS.map((item, i) => (
                    <div key={i} className="border border-white/8 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                        className="w-full flex items-center justify-between gap-3 p-4 text-left text-sm hover:bg-white/5 transition-colors duration-200"
                      >
                        <span className="text-zinc-200 font-medium">{item.q}</span>
                        <span className={`text-[#6366f1] shrink-0 text-xl font-light transition-transform duration-200 ${faqOpen === i ? 'rotate-45' : ''}`}>+</span>
                      </button>
                      <div className={`overflow-hidden transition-[max-height] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${faqOpen === i ? 'max-h-40' : 'max-h-0'}`}>
                        <p className="px-4 pb-4 text-sm text-zinc-400 leading-relaxed">{item.a}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Contact ──────────────────────────────────────────────────────── */}
      <section id="contact" className="py-16 sm:py-28 px-4 sm:px-6 border-t border-white/5 bg-white/[0.01] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#6366f1]/6 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-5xl mx-auto relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-start">
            <motion.div {...fadeUp}>
              <SectionLabel>Контакт</SectionLabel>
              <motion.h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5" {...clipReveal}>
                Обсудим<br /><span style={grad}>ваш проект</span>
              </motion.h2>
              <p className="text-zinc-400 mb-8 sm:mb-10 leading-relaxed">Оставьте заявку — свяжемся в течение дня и назначим бесплатный звонок на 15 минут.</p>
              <div className="mb-3 text-sm font-semibold text-zinc-300">На первом звонке:</div>
              <div className="flex flex-col gap-3.5">
                {FIRST_CALL_POINTS.map(p => (
                  <div key={p.text} className="flex items-start gap-3">
                    <span className="w-8 h-8 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-sm shrink-0">{p.icon}</span>
                    <span className="text-sm text-zinc-400 leading-relaxed mt-1">{p.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.12 }}>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-zinc-500 font-medium">Имя *</label>
                      <input name="name" value={form.name} onChange={handleChange} required placeholder="Иван Иванов" className={inputCls} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-zinc-500 font-medium">Телефон *</label>
                      <input name="phone" value={form.phone} onChange={handleChange} required type="tel" placeholder="+7 (999) 000-00-00" className={inputCls} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-zinc-500 font-medium">Тип проекта</label>
                    <select name="projectType" value={form.projectType} onChange={handleChange} className={inputCls}>
                      <option value="" className="bg-[#050505]">Выберите тип...</option>
                      <option value="landing" className="bg-[#050505]">Лендинг (от 15 000 ₽)</option>
                      <option value="site" className="bg-[#050505]">Сайт-визитка (от 40 000 ₽)</option>
                      <option value="other" className="bg-[#050505]">Другое / пока не знаю</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-zinc-500 font-medium">Бюджет</label>
                    <select name="budget" value={form.budget} onChange={handleChange} className={inputCls}>
                      <option value="" className="bg-[#050505]">Выберите бюджет...</option>
                      <option value="10-20" className="bg-[#050505]">10 000 — 20 000 ₽</option>
                      <option value="20-50" className="bg-[#050505]">20 000 — 50 000 ₽</option>
                      <option value="50-100" className="bg-[#050505]">50 000 — 100 000 ₽</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-zinc-500 font-medium">О проекте</label>
                    <textarea name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Расскажите о вашем бизнесе и задаче..." className={inputCls + ' resize-none'} />
                  </div>
                  <button type="submit" disabled={submitting}
                    className="py-4 rounded-full bg-[#6366f1] text-white font-semibold hover:bg-[#4f46e5] transition-colors duration-200 hover:shadow-xl hover:shadow-[#6366f1]/30 text-base disabled:opacity-60 disabled:cursor-not-allowed">
                    {submitting ? 'Отправляем...' : 'Отправить заявку →'}
                  </button>
                  <p className="text-center text-xs text-zinc-700">Нажимая кнопку, вы соглашаетесь с обработкой персональных данных</p>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="py-12 px-4 sm:px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="text-xl font-bold select-none"><span className="text-[#6366f1]">Web</span>ScaleKv</span>
            <p className="text-xs text-zinc-600 max-w-xs leading-relaxed">AI-first веб-агентство. Современные сайты для малого бизнеса — быстро, красиво, по делу.</p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-2">
            <a href="mailto:lifescalekv@gmail.com" className="text-sm text-zinc-400 hover:text-[#6366f1] transition-colors duration-200">lifescalekv@gmail.com</a>
            <p className="text-xs text-zinc-700">© 2026 WebScaleKv. Все права защищены.</p>
          </div>
        </div>
      </footer>

    </div>
  )
}
