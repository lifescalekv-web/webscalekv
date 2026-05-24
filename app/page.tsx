'use client'

import Image from 'next/image'
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

const SERVICES = [
  {
    badge: 'Start', title: 'Лендинг',
    price: 'от 15 000 ₽', duration: '3–5 дней', highlight: false,
    desc: 'Один убедительный экран, который превращает посетителей в клиентов. Идеально для старта.',
    features: ['Индивидуальный дизайн', 'Адаптив для всех устройств', 'Форма заявок с уведомлением', 'Деплой на Vercel', 'Подключение домена'],
  },
  {
    badge: 'Pro', title: 'Сайт-визитка',
    price: 'от 40 000 ₽', duration: '7–10 дней', highlight: true,
    desc: 'Полноценное присутствие в интернете: несколько страниц, SEO и возможность редактировать контент самостоятельно.',
    features: ['Всё из Start', 'До 5 страниц', 'CMS для редактирования', 'SEO-оптимизация', 'Подключение аналитики', '1 месяц поддержки'],
  },
]

const PROCESS_STEPS = [
  { num: '01', title: 'Звонок', duration: '15 минут', desc: 'Обсуждаем задачу, аудиторию и цели. Без обязательств.' },
  { num: '02', title: 'Предложение', duration: '24 часа', desc: 'Готовим детальный план, референсы и финальную цену.' },
  { num: '03', title: 'Разработка', duration: '1–2 недели', desc: 'AI-ускоренный процесс: дизайн, код, настройка.' },
  { num: '04', title: 'Правки', duration: '3 дня', desc: 'Доводим результат до идеала по вашим комментариям.' },
  { num: '05', title: 'Запуск', duration: 'День X', desc: 'Деплой, домен, передача всех доступов. Вы — владелец.' },
]

const WHY_AI = [
  { title: 'В 3× быстрее', desc: 'Традиционная разработка занимает месяцы. Мы — недели, иногда дни.' },
  { title: 'Современный код', desc: 'Никакого технического долга. Чистая архитектура с первого дня.' },
  { title: 'Автопроверки', desc: 'Качество контролируется автоматически на каждом шаге разработки.' },
  { title: 'Быстрые правки', desc: 'Итерации занимают часы, а не дни. Вы видите результат сразу.' },
  { title: 'Честная цена', desc: 'Меньше ручного труда — ниже стоимость при том же качестве.' },
  { title: 'Актуальный стек', desc: 'Используем инструменты 2025 года, а не легаси 2010-го.' },
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
    color: '#c9852a',
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
    color: '#e8a84a',
  },
  {
    title: 'Ваш проект',
    desc: 'Ваш бизнес может стать следующим. Обсудим задачу и запустим сайт который работает на вас 24/7.',
    tags: ['Лендинг', 'Магазин', 'Приложение'],
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
  { label: 'ТРАФИК',   desc: '1000 человек нашли вас в поиске',                      num: 1000, pct: 100 },
  { label: 'ВНИМАНИЕ', desc: '850 заинтересовались — дизайн держит на сайте',         num: 850,  pct: 85  },
  { label: 'ДОВЕРИЕ',  desc: '600 изучили услуги, кейсы, цены',                       num: 600,  pct: 60  },
  { label: 'ДЕЙСТВИЕ', desc: '350 нажали кнопку или заполнили форму',                 num: 350,  pct: 35  },
  { label: 'КЛИЕНТ',   desc: '200 стали реальными клиентами',                         num: 200,  pct: 20  },
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
  'Обсудим задачу и цели вашего сайта',
  'Определим целевую аудиторию',
  'Предложим лучшее техническое решение',
  'Назовём точные сроки и стоимость',
  'Ответим на все вопросы без обязательств',
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
      className="flex justify-center mb-6"
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
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
        <span className="text-sm font-semibold text-[var(--accent-muted)]">{fmt(value)}</span>
      </div>
      <div className="flex items-center min-h-[44px]">
        <input type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="w-full" />
      </div>
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function Home() {
  const [navScrolled, setNavScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [faqOpen, setFaqOpen] = useState<number | null>(null)
  const [tilts, setTilts] = useState([{ rx: 0, ry: 0 }, { rx: 0, ry: 0 }])

  const [visitors, setVisitors] = useState(1000)
  const [avgCheck, setAvgCheck] = useState(5000)
  const [conv, setConv] = useState(3)
  const revenue = Math.floor(visitors * (conv / 100) * avgCheck)
  const daysROI = revenue > 0 ? Math.ceil((30000 / revenue) * 30) : 0

  const processRef = useRef<HTMLDivElement>(null)
  const processInView = useInViewFM(processRef, { once: true, margin: '-100px' })

  const [form, setForm] = useState({ name: '', phone: '', projectType: '', budget: '', description: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fn = () => setNavScrolled(window.scrollY > 50)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

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

  const inputCls = 'w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-[var(--surface-border)] text-[var(--foreground)] placeholder-zinc-600 text-sm focus:outline-none focus:border-[var(--accent)]/60 focus-visible:ring-2 focus-visible:ring-[var(--accent)]/50 focus-visible:ring-offset-1 focus-visible:ring-offset-[#0b0907] transition-colors duration-200'

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] overflow-x-hidden">

      {/* ── Navbar ────────────────────────────────────────────────────────── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navScrolled ? 'border-b border-white/[0.06] bg-[#0b0907]/90 backdrop-blur-md' : 'bg-transparent'}`}
        role="navigation"
        aria-label="Основная навигация"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14 sm:h-16">
          <span className="font-display text-xl font-bold tracking-tight select-none shrink-0">
            <span className="text-[var(--accent)]">Web</span>ScaleKv
          </span>
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(l => (
              <a key={l.href} href={l.href} className="text-sm text-zinc-400 hover:text-[var(--foreground)] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0907] rounded-sm">{l.label}</a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <a
              href="#contact"
              className="hidden md:inline-flex px-5 py-2 rounded-full bg-[var(--accent)] text-[#0b0907] text-sm font-semibold hover:bg-[var(--accent-hover)] active:scale-[0.98] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0907]"
            >
              Получить предложение
            </a>
            <Drawer.Root open={mobileOpen} onOpenChange={setMobileOpen}>
              <Drawer.Trigger asChild>
                <button
                  className="md:hidden w-11 h-11 flex items-center justify-center rounded-lg border border-white/[0.08] text-zinc-400 hover:text-[var(--foreground)] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0907]"
                  aria-label="Меню"
                >
                  <div className="flex flex-col gap-[5px] w-5">
                    <span className="block w-full h-px bg-current" />
                    <span className="block w-full h-px bg-current" />
                    <span className="block w-3 h-px bg-current" />
                  </div>
                </button>
              </Drawer.Trigger>
              <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]" />
                <Drawer.Content className="fixed bottom-0 left-0 right-0 z-[70] flex flex-col bg-[#100e0a] rounded-t-[20px] border-t border-white/[0.08] outline-none">
                  <div className="mx-auto mt-3 mb-1 w-12 h-1.5 rounded-full bg-white/20 shrink-0" />
                  <div className="px-6 pb-10 pt-4 flex flex-col gap-3">
                    <span className="font-display text-xl font-bold select-none mb-1">
                      <span className="text-[var(--accent)]">Web</span>ScaleKv
                    </span>
                    <div className="h-px bg-white/[0.06] mb-1" />
                    {NAV_LINKS.map(l => (
                      <a
                        key={l.href}
                        href={l.href}
                        onClick={() => setMobileOpen(false)}
                        className="text-zinc-300 hover:text-white py-2.5 text-base transition-colors duration-200 border-b border-white/[0.05] last:border-0"
                      >
                        {l.label}
                      </a>
                    ))}
                    <a
                      href="#contact"
                      onClick={() => setMobileOpen(false)}
                      className="mt-3 py-3.5 rounded-full bg-[var(--accent)] text-[#0b0907] text-sm font-semibold text-center hover:bg-[var(--accent-hover)] transition-colors duration-200"
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

      <main id="main-content">

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <section className="relative min-h-[100dvh] flex flex-col px-4 sm:px-6 pt-14 sm:pt-16 overflow-hidden">
          <div
            className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full blur-[200px] pointer-events-none"
            style={{ background: 'rgba(201,133,42,0.07)' }}
            aria-hidden="true"
          />
          <div
            className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full blur-[160px] pointer-events-none"
            style={{ background: 'rgba(201,133,42,0.04)' }}
            aria-hidden="true"
          />

          <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col justify-center py-16 sm:py-24">
            <div className="max-w-5xl">
              {/* Eyebrow */}
              <motion.div
                className="flex items-center gap-3 mb-10 sm:mb-14"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: EASE }}
              >
                <span className="block w-8 h-px bg-[var(--accent)]" aria-hidden="true" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--accent)]">
                  AI-first веб-агентство
                </span>
                <span className="text-[10px] text-zinc-700 tracking-widest">2026</span>
              </motion.div>

              {/* Heading — mask reveal per line */}
              <h1
                className="font-display font-black leading-[0.9] tracking-tight mb-10 sm:mb-14"
                style={{ fontSize: 'clamp(3rem, 9vw, 8.5rem)' }}
              >
                <div className="overflow-hidden">
                  <motion.span
                    className="block"
                    initial={{ y: '110%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
                  >
                    Сайты,
                  </motion.span>
                </div>
                <div className="overflow-hidden">
                  <motion.span
                    className="block"
                    initial={{ y: '110%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.9, ease: EASE, delay: 0.25 }}
                  >
                    которые
                  </motion.span>
                </div>
                <div className="overflow-hidden">
                  <motion.span
                    className="block"
                    initial={{ y: '110%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}
                  >
                    работают{' '}
                    <span style={{ color: 'var(--accent-muted)' }}>с AI.</span>
                  </motion.span>
                </div>
              </h1>

              {/* Description + CTA + Stats */}
              <div className="flex flex-col lg:flex-row lg:items-end gap-8 lg:gap-20">
                <motion.div
                  className="flex-1"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: EASE, delay: 0.7 }}
                >
                  <p className="text-base sm:text-lg text-zinc-400 max-w-md leading-relaxed mb-8">
                    Разрабатываем сайты и веб-приложения для малого бизнеса.
                    AI-инструменты дают скорость в 3× при той же стоимости.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href="#contact"
                      className="w-full sm:w-auto text-center px-8 py-3.5 rounded-full bg-[var(--accent)] text-[#0b0907] font-semibold hover:bg-[var(--accent-hover)] active:scale-[0.98] transition-all duration-300 text-base"
                    >
                      Обсудить проект
                    </a>
                    <a
                      href="#cases"
                      className="w-full sm:w-auto text-center px-8 py-3.5 rounded-full border border-white/[0.1] text-[var(--foreground)] font-semibold hover:border-[var(--accent)]/40 hover:bg-[var(--accent)]/[0.06] active:scale-[0.98] transition-all duration-300 text-base"
                    >
                      Смотреть кейсы
                    </a>
                  </div>
                </motion.div>

                <motion.div
                  className="flex flex-row lg:flex-col gap-8 lg:gap-5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 1 }}
                  aria-label="Ключевые показатели"
                >
                  {[{ v: '14 дней', l: 'до запуска' }, { v: '3×', l: 'быстрее' }, { v: '100%', l: 'довольны' }].map(s => (
                    <div key={s.v} className="lg:text-right">
                      <div className="font-display text-xl font-bold" style={{ color: 'var(--accent-muted)' }}>{s.v}</div>
                      <div className="text-xs text-zinc-600">{s.l}</div>
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>

          {/* Marquee strip */}
          <div className="relative w-screen -mx-4 sm:-mx-6 overflow-hidden border-t border-white/[0.05] py-4">
            <div className="flex animate-marquee whitespace-nowrap">
              {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
                <span key={i} className="inline-flex items-center gap-3 text-zinc-500 text-sm font-medium px-5">
                  <span className="text-[var(--accent)] text-xs">◆</span>{item}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Services ─────────────────────────────────────────────────────── */}
        <section id="services" className="py-20 sm:py-32 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <SectionLabel>Услуги</SectionLabel>
            <motion.h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4" {...clipReveal}>
              Выберите свой формат
            </motion.h2>
            <motion.p className="text-zinc-400 text-center mb-12 sm:mb-20 max-w-lg mx-auto" {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
              Два пакета под разные задачи и бюджеты. Оба включают дизайн, разработку и запуск.
            </motion.p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto">
              {SERVICES.map((s, i) => (
                <motion.div
                  key={s.badge}
                  className="relative"
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.6, ease: EASE, delay: i * 0.1 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  {/* Double-bezel outer shell */}
                  <div className={`rounded-[1.75rem] p-1.5 border ${s.highlight ? 'border-[var(--accent)]/50 bg-[var(--accent)]/[0.06]' : 'border-white/[0.06] bg-white/[0.02]'}`}>
                    {/* Inner core */}
                    <div className={`rounded-[calc(1.75rem-6px)] p-6 sm:p-8 flex flex-col gap-5 h-full ${s.highlight ? 'bg-[#110e08]' : 'bg-[var(--background)]'} shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]`}>
                      {s.highlight && (
                        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[var(--accent)] text-[#0b0907] text-xs font-bold z-10 whitespace-nowrap">
                          Популярный выбор
                        </div>
                      )}
                      <div className="flex items-start justify-between">
                        <span className={`text-[10px] font-bold uppercase tracking-[0.2em] px-2.5 py-1 rounded-full border ${s.highlight ? 'border-[var(--accent)]/30 bg-[var(--accent)]/[0.12] text-[var(--accent-muted)]' : 'border-white/[0.08] bg-white/[0.04] text-zinc-500'}`}>
                          {s.badge}
                        </span>
                        <span
                          className="font-display text-5xl font-black leading-none select-none"
                          style={{ color: s.highlight ? 'rgba(201,133,42,0.15)' : 'rgba(255,255,255,0.05)' }}
                        >
                          {s.badge[0]}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-display text-2xl font-bold mb-2">{s.title}</h3>
                        <p className="text-zinc-500 text-sm leading-relaxed">{s.desc}</p>
                      </div>
                      <div className="flex items-baseline gap-2 py-3 border-y border-white/[0.05]">
                        <span className="font-display text-2xl font-bold text-[var(--accent)]">{s.price}</span>
                        <span className="text-zinc-500 text-sm">· {s.duration}</span>
                      </div>
                      <ul className="flex flex-col gap-2.5 flex-1">
                        {s.features.map(f => (
                          <li key={f} className="flex items-start gap-2.5 text-sm text-zinc-300">
                            <span className="text-[var(--accent)] shrink-0 mt-0.5 text-xs font-bold leading-relaxed">—</span>{f}
                          </li>
                        ))}
                      </ul>
                      <a
                        href="#contact"
                        className={`mt-2 py-3.5 rounded-full text-center text-sm font-semibold transition-all duration-300 active:scale-[0.98] ${s.highlight ? 'bg-[var(--accent)] text-[#0b0907] hover:bg-[var(--accent-hover)]' : 'border border-white/[0.12] text-[var(--foreground)] hover:border-[var(--accent)]/40 hover:text-[var(--accent-muted)]'}`}
                      >
                        Заказать {s.title}
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Process ──────────────────────────────────────────────────────── */}
        <section id="process" className="py-20 sm:py-32 px-4 sm:px-6 border-t border-white/[0.05]">
          <div className="max-w-6xl mx-auto">
            <SectionLabel>Процесс</SectionLabel>
            <motion.h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4" {...clipReveal}>
              Как мы работаем
            </motion.h2>
            <motion.p className="text-zinc-400 text-center mb-12 sm:mb-16 max-w-md mx-auto" {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
              Прозрачный процесс от первого звонка до финального запуска
            </motion.p>
            <div ref={processRef} className="hidden lg:block relative h-px bg-white/[0.05] mb-2 mx-8">
              <div className={`process-line ${processInView ? 'active' : ''}`} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px bg-white/[0.04] rounded-2xl overflow-hidden border border-white/[0.04]">
              {PROCESS_STEPS.map((step, i) => (
                <motion.div
                  key={step.num}
                  className="bg-[var(--background)] hover:bg-white/[0.015] transition-colors duration-300"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.6, ease: EASE, delay: i * 0.07 }}
                >
                  <div className="flex flex-col gap-3 p-6 pt-7 h-full">
                    <div
                      className="font-display text-5xl font-black leading-none select-none"
                      style={{ color: 'rgba(201,133,42,0.13)' }}
                    >
                      {step.num}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm mb-0.5">{step.title}</h3>
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
        <section className="py-20 sm:py-32 px-4 sm:px-6 border-t border-white/[0.05]">
          <div className="max-w-6xl mx-auto">
            <SectionLabel>Преимущества</SectionLabel>
            <motion.h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4" {...clipReveal}>
              Почему{' '}
              <span style={{ color: 'var(--accent-muted)' }}>AI-разработка</span>
            </motion.h2>
            <motion.p className="text-zinc-400 text-center mb-12 sm:mb-16 max-w-lg mx-auto" {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
              AI меняет скорость и стоимость разработки. Вы получаете качественный продукт за время, которое раньше занимало согласование ТЗ.
            </motion.p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.04] rounded-2xl overflow-hidden border border-white/[0.04]">
              {WHY_AI.map((c, i) => (
                <motion.div
                  key={c.title}
                  className={`bg-[var(--background)] hover:bg-white/[0.015] transition-colors duration-300 ${i === 0 ? 'sm:col-span-2 lg:col-span-2' : ''}`}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.6, ease: EASE, delay: i * 0.07 }}
                >
                  {i === 0 ? (
                    <div className="flex flex-col sm:flex-row gap-6 items-start p-7 sm:p-9 h-full">
                      <div className="shrink-0">
                        <div className="font-display text-6xl font-black text-[var(--accent)] leading-none">3×</div>
                        <div className="text-[10px] text-zinc-600 mt-1.5 uppercase tracking-[0.15em]">быстрее</div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-xl mb-2">{c.title}</h3>
                        <p className="text-sm text-zinc-400 leading-relaxed">{c.desc}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3 p-7 sm:p-8 h-full">
                      <span
                        className="font-display text-[10px] font-bold tracking-[0.2em]"
                        style={{ color: 'var(--accent)', opacity: 0.5 }}
                      >
                        {String(i).padStart(2, '0')}
                      </span>
                      <h3 className="font-bold text-base">{c.title}</h3>
                      <p className="text-sm text-zinc-400 leading-relaxed">{c.desc}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Cases ────────────────────────────────────────────────────────── */}
        <section id="cases" className="py-20 sm:py-32 px-4 sm:px-6 border-t border-white/[0.05]">
          <div className="max-w-6xl mx-auto">
            <SectionLabel>Кейсы</SectionLabel>
            <motion.h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4" {...clipReveal}>
              Реальные проекты
            </motion.h2>
            <motion.p className="text-zinc-400 text-center mb-12 sm:mb-16 max-w-md mx-auto" {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
              Результаты, которые говорят сами за себя
            </motion.p>
            <div className="space-y-5">
              {/* Featured + secondary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {CASES.slice(0, 2).map((c, i) => (
                  <motion.div
                    key={c.title}
                    className={i === 0 ? 'md:col-span-2' : ''}
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.6, ease: EASE, delay: i * 0.1 }}
                  >
                    <div
                      className="group rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden flex flex-col h-full"
                      style={{
                        transform: `perspective(900px) rotateX(${tilts[i].rx}deg) rotateY(${tilts[i].ry}deg)`,
                        transition: tilts[i].rx === 0 && tilts[i].ry === 0 ? 'transform 0.4s cubic-bezier(0.22,1,0.36,1)' : 'transform 0.08s ease',
                      }}
                      onMouseMove={e => tilt(i, e)}
                      onMouseLeave={() => resetTilt(i)}
                    >
                      <div className={`relative overflow-hidden shrink-0 ${i === 0 ? 'h-[200px] sm:h-[280px]' : 'h-[180px] sm:h-[220px]'}`}>
                        {c.image && (
                          <>
                            <Image
                              src={c.image}
                              alt={c.title}
                              fill
                              sizes={i === 0 ? '(max-width: 768px) 100vw, 67vw' : '(max-width: 768px) 100vw, 33vw'}
                              className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" aria-hidden="true" />
                          </>
                        )}
                      </div>
                      <div className="p-5 sm:p-6 flex flex-col flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs border border-white/[0.08] px-2 py-0.5 rounded-full text-zinc-500">{c.category}</span>
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: c.color }} />
                        </div>
                        <h3 className="font-display font-bold text-lg mt-3 mb-0.5">{c.title}</h3>
                        <p className="text-sm text-zinc-500 mb-2">{c.result}</p>
                        {c.price && (
                          <span
                            className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border mb-3"
                            style={{ color: 'var(--accent)', borderColor: 'rgba(201,133,42,0.25)', background: 'rgba(201,133,42,0.08)' }}
                          >
                            {c.price}
                          </span>
                        )}
                        <p className="text-sm text-zinc-400 leading-relaxed mb-4 flex-1">{c.desc}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {c.tags.map(tag => (
                            <span key={tag} className="text-xs px-2.5 py-1 rounded-full border border-white/[0.08] text-zinc-500">{tag}</span>
                          ))}
                        </div>
                        <a
                          href={c.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2.5 rounded-full border border-white/[0.08] text-zinc-400 text-sm font-medium text-center transition-all duration-300"
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = c.color!; (e.currentTarget as HTMLElement).style.color = '#fff' }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = ''; (e.currentTarget as HTMLElement).style.color = '' }}
                        >
                          Посмотреть сайт
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* "Your project" — horizontal invitation strip */}
              <motion.div
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: 0.2 }}
                className="rounded-2xl border border-dashed border-[var(--accent)]/25 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6"
              >
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">Следующий кейс</span>
                  <h3 className="font-display font-bold text-xl mt-1 mb-2">{CASES[2].title}</h3>
                  <p className="text-sm text-zinc-400 max-w-lg">{CASES[2].desc}</p>
                </div>
                <div className="flex flex-wrap gap-2 shrink-0">
                  {CASES[2].tags.map(tag => (
                    <span key={tag} className="text-xs px-2.5 py-1 rounded-full border border-white/[0.08] text-zinc-500">{tag}</span>
                  ))}
                </div>
                <a
                  href="#contact"
                  className="shrink-0 px-6 py-3 rounded-full border border-[var(--accent)]/30 text-sm font-semibold transition-all duration-300 active:scale-[0.98] hover:bg-[var(--accent)] hover:text-[#0b0907] hover:border-[var(--accent)]"
                  style={{ color: 'var(--accent-muted)' }}
                >
                  Обсудить проект
                </a>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Why site ─────────────────────────────────────────────────────── */}
        <section id="why-site" className="py-20 sm:py-32 px-4 sm:px-6 border-t border-white/[0.05] bg-white/[0.01]">
          <div className="max-w-6xl mx-auto">
            <SectionLabel>Зачем сайт</SectionLabel>
            <motion.h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-3" {...clipReveal}>
              Без сайта вы теряете клиентов<br />
              <span style={{ color: 'var(--accent-muted)' }}>прямо сейчас</span>
            </motion.h2>
            <motion.p className="text-zinc-400 text-center mb-12 sm:mb-16 max-w-lg mx-auto" {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
              73% людей ищут услуги в интернете перед покупкой. Вопрос лишь в том — найдут ли они вас.
            </motion.p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12 sm:mb-16">
              <motion.div className="h-full" {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.05 }}>
                <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.04] p-6 sm:p-8 h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-7 h-7 rounded-full bg-red-500/15 flex items-center justify-center text-red-400 text-xs font-bold">✕</div>
                    <h3 className="font-bold text-base text-red-400">Без сайта</h3>
                  </div>
                  <ul className="flex flex-col gap-4">
                    {WITHOUT_SITE.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-zinc-400">
                        <span className="text-red-500/50 shrink-0 mt-0.5 text-xs font-bold">—</span>{item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
              <motion.div className="h-full" {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.13 }}>
                <div className="rounded-2xl border border-[var(--accent)]/25 bg-[var(--accent-dim)] p-6 sm:p-8 h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ background: 'rgba(201,133,42,0.15)', color: 'var(--accent)' }}
                    >✓</div>
                    <h3 className="font-bold text-base" style={{ color: 'var(--accent-muted)' }}>С сайтом WebScaleKv</h3>
                  </div>
                  <ul className="flex flex-col gap-4">
                    {WITH_SITE.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-zinc-300">
                        <span className="shrink-0 mt-0.5 text-xs font-bold" style={{ color: 'var(--accent)' }}>—</span>{item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>
            <motion.blockquote
              className="max-w-3xl mx-auto border border-white/[0.06] rounded-2xl p-8 sm:p-10 bg-white/[0.01]"
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.15 }}
            >
              <p className="font-display text-lg sm:text-xl md:text-2xl font-semibold text-zinc-200 leading-relaxed">
                Сайт — это единственный менеджер по продажам который работает 24/7, никогда не болеет и не просит зарплату.
              </p>
            </motion.blockquote>
          </div>
        </section>

        {/* ── Conversion / Funnel ──────────────────────────────────────────── */}
        <section id="conversion" className="py-20 sm:py-32 px-4 sm:px-6 border-t border-white/[0.05]">
          <div className="max-w-6xl mx-auto">
            <SectionLabel>Конверсия</SectionLabel>
            <motion.h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-3" {...clipReveal}>
              Как работает конверсия
            </motion.h2>
            <motion.p className="text-zinc-400 text-center mb-12 sm:mb-16 max-w-lg mx-auto" {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
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
                      <div
                        className="rounded-xl p-4 border"
                        style={{
                          background: `rgba(201,133,42,${0.04 + i * 0.025})`,
                          borderColor: `rgba(201,133,42,${0.10 + i * 0.06})`,
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="text-[10px] font-bold tracking-widest mb-0.5" style={{ color: 'var(--accent)' }}>{step.label}</div>
                            <div className="text-sm text-zinc-300 truncate">{step.desc}</div>
                          </div>
                          <div className="font-display text-lg font-bold text-[var(--foreground)] shrink-0">{step.num.toLocaleString('ru')}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div
                    className="mt-4 p-4 rounded-xl border"
                    style={{ background: 'rgba(201,133,42,0.07)', borderColor: 'rgba(201,133,42,0.20)' }}
                  >
                    <p className="text-sm text-zinc-300 font-medium">
                      200 клиентов × 5 000₽ = <span className="font-display font-bold" style={{ color: 'var(--accent)' }}>1 000 000₽/мес</span> с одного канала
                    </p>
                    <p className="text-xs text-zinc-500 mt-1">Это реальные цифры бизнесов с качественным сайтом</p>
                  </div>
                </div>
              </motion.div>
              <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.13 }}>
                <div className="glass rounded-2xl p-6 sm:p-8">
                  <h3 className="font-display font-bold text-xl mb-7">Калькулятор ROI</h3>
                  <div className="flex flex-col gap-6">
                    <SliderField label="Посетителей в месяц" value={visitors} min={100} max={10000} step={100} onChange={setVisitors} fmt={v => v.toLocaleString('ru')} />
                    <SliderField label="Средний чек" value={avgCheck} min={1000} max={50000} step={1000} onChange={setAvgCheck} fmt={v => `${v.toLocaleString('ru')} ₽`} />
                    <SliderField label="Конверсия сайта" value={conv} min={1} max={15} step={0.5} onChange={setConv} fmt={v => `${v}%`} />
                  </div>
                  <div
                    className="mt-8 p-5 rounded-xl border"
                    style={{ background: 'rgba(201,133,42,0.08)', borderColor: 'rgba(201,133,42,0.20)' }}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm text-zinc-400">Выручка с сайта:</span>
                      <span className="font-display text-xl sm:text-2xl font-bold" style={{ color: 'var(--accent-muted)' }}>{revenue.toLocaleString('ru')} ₽/мес</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-zinc-400">Окупаемость сайта:</span>
                      <span className="font-display text-lg font-bold text-[var(--foreground)]">за {daysROI} дней</span>
                    </div>
                    <div className="mt-3 text-xs text-zinc-500">*При стоимости сайта 30 000 ₽</div>
                  </div>
                  <a
                    href="#contact"
                    className="mt-5 block py-3 rounded-full text-[#0b0907] text-sm font-semibold text-center active:scale-[0.98] hover:opacity-90 transition-all duration-300"
                    style={{ background: 'var(--accent)' }}
                  >
                    Хочу такой сайт
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Trust ────────────────────────────────────────────────────────── */}
        <section id="trust" className="py-20 sm:py-32 px-4 sm:px-6 border-t border-white/[0.05] bg-white/[0.01]">
          <div className="max-w-6xl mx-auto">
            <SectionLabel>Доверие</SectionLabel>
            <motion.h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4" {...clipReveal}>
              Нам доверяют потому что<br />
              <span style={{ color: 'var(--accent-muted)' }}>мы прозрачны</span>
            </motion.h2>
            <motion.p className="text-zinc-400 text-center mb-12 sm:mb-16 max-w-md mx-auto" {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
              Никаких сюрпризов. Всё зафиксировано заранее.
            </motion.p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <motion.div className="h-full" {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.05 }}>
                <div className="glass rounded-2xl p-6 sm:p-8 h-full">
                  <h3 className="font-display font-bold text-lg mb-6" style={{ color: 'var(--accent-muted)' }}>Наши гарантии</h3>
                  <ul className="flex flex-col gap-4">
                    {GUARANTEES.map((g, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-zinc-300">
                        <span className="shrink-0 mt-0.5 text-xs font-bold" style={{ color: 'var(--accent)' }}>—</span>{g}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
              <motion.div className="h-full" {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
                <div className="glass rounded-2xl p-6 sm:p-8 h-full">
                  <h3 className="font-display font-bold text-lg mb-6" style={{ color: 'var(--accent-muted)' }}>Как проходит работа</h3>
                  <div className="flex flex-col gap-5">
                    {TRANSPARENCY.map((t, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className="w-7 h-7 rounded-full border flex items-center justify-center text-xs font-bold font-display shrink-0"
                            style={{ borderColor: 'rgba(201,133,42,0.35)', background: 'rgba(201,133,42,0.08)', color: 'var(--accent)' }}
                          >
                            {t.step}
                          </div>
                          {i < TRANSPARENCY.length - 1 && <div className="w-px flex-1 bg-white/[0.05] mt-2" />}
                        </div>
                        <div className="pb-4">
                          <div className="font-semibold text-sm text-[var(--foreground)]">{t.text}</div>
                          <div className="text-xs text-zinc-500 mt-0.5">{t.sub}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
              <motion.div className="h-full" {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.15 }}>
                <div className="glass rounded-2xl p-6 sm:p-8 h-full">
                  <h3 className="font-display font-bold text-lg mb-6" style={{ color: 'var(--accent-muted)' }}>Частые вопросы</h3>
                  <div className="flex flex-col gap-2">
                    {FAQ_ITEMS.map((item, i) => (
                      <div key={i} className="border border-white/[0.06] rounded-xl overflow-hidden">
                        <button
                          onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                          aria-expanded={faqOpen === i}
                          aria-controls={`faq-${i}`}
                          className="w-full flex items-center justify-between gap-3 p-4 text-left text-sm hover:bg-white/[0.04] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/60 focus-visible:ring-inset"
                        >
                          <span className="text-zinc-200 font-medium">{item.q}</span>
                          <span
                            aria-hidden="true"
                            className={`shrink-0 text-xl font-light transition-transform duration-200 ${faqOpen === i ? 'rotate-45' : ''}`}
                            style={{ color: 'var(--accent)' }}
                          >+</span>
                        </button>
                        <div
                          id={`faq-${i}`}
                          role="region"
                          className={`overflow-hidden transition-[max-height] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${faqOpen === i ? 'max-h-40' : 'max-h-0'}`}
                        >
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
        <section id="contact" className="py-20 sm:py-32 px-4 sm:px-6 border-t border-white/[0.05] relative overflow-hidden">
          <div
            className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full blur-3xl pointer-events-none"
            style={{ background: 'rgba(201,133,42,0.05)' }}
            aria-hidden="true"
          />
          <div className="max-w-5xl mx-auto relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-start">
              <motion.div {...fadeUp}>
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--accent)] block mb-6">
                  Контакт
                </span>
                <motion.h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-5" {...clipReveal}>
                  Обсудим<br /><span style={{ color: 'var(--accent-muted)' }}>ваш проект</span>
                </motion.h2>
                <p className="text-zinc-400 mb-8 sm:mb-10 leading-relaxed">Оставьте заявку — свяжемся в течение дня и назначим бесплатный звонок на 15 минут.</p>
                <div className="mb-3 text-sm font-semibold text-zinc-300">На первом звонке:</div>
                <div className="flex flex-col gap-3.5">
                  {FIRST_CALL_POINTS.map((p, i) => (
                    <div key={p} className="flex items-start gap-3">
                      <span
                        className="font-display font-bold text-sm shrink-0 mt-0.5 w-5"
                        style={{ color: 'var(--accent)', opacity: 0.55 }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="text-sm text-zinc-400 leading-relaxed">{p}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
              <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.12 }}>
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-6 sm:p-8">
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
                        <option value="" className="bg-[#0b0907]">Выберите тип...</option>
                        <option value="landing" className="bg-[#0b0907]">Лендинг (от 15 000 ₽)</option>
                        <option value="site" className="bg-[#0b0907]">Сайт-визитка (от 40 000 ₽)</option>
                        <option value="other" className="bg-[#0b0907]">Другое / пока не знаю</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-zinc-500 font-medium">Бюджет</label>
                      <select name="budget" value={form.budget} onChange={handleChange} className={inputCls}>
                        <option value="" className="bg-[#0b0907]">Выберите бюджет...</option>
                        <option value="10-20" className="bg-[#0b0907]">10 000 — 20 000 ₽</option>
                        <option value="20-50" className="bg-[#0b0907]">20 000 — 50 000 ₽</option>
                        <option value="50-100" className="bg-[#0b0907]">50 000 — 100 000 ₽</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-zinc-500 font-medium">О проекте</label>
                      <textarea name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Расскажите о вашем бизнесе и задаче..." className={inputCls + ' resize-none'} />
                    </div>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="py-4 rounded-full text-[#0b0907] font-semibold text-base disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] hover:opacity-90 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0907]"
                      style={{ background: 'var(--accent)' }}
                    >
                      {submitting ? 'Отправляем...' : 'Отправить заявку'}
                    </button>
                    <p className="text-center text-xs text-zinc-500">Нажимая кнопку, вы соглашаетесь с обработкой персональных данных</p>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

      </main>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="py-12 px-4 sm:px-6 border-t border-white/[0.05]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="font-display text-xl font-bold select-none">
              <span style={{ color: 'var(--accent)' }}>Web</span>ScaleKv
            </span>
            <p className="text-xs text-zinc-500 max-w-xs leading-relaxed">AI-first веб-агентство. Современные сайты для малого бизнеса — быстро, красиво, по делу.</p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-2">
            <a href="mailto:lifescalekv@gmail.com" className="text-sm text-zinc-400 hover:text-[var(--accent)] transition-colors duration-200">lifescalekv@gmail.com</a>
            <p className="text-xs text-zinc-500">© 2026 WebScaleKv. Все права защищены.</p>
          </div>
        </div>
      </footer>

    </div>
  )
}
