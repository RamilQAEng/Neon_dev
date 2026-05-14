import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowUp,
  Check,
  CheckCircle2,
  ChevronDown,
  Code2,
  CreditCard,
  Eye,
  FileText,
  Gift,
  Layers3,
  Loader2,
  Menu,
  MessageCircle,
  MonitorSmartphone,
  PhoneCall,
  Rocket,
  Send,
  ShieldCheck,
  Star,
  Timer,
  X,
  XCircle,
  Zap
} from 'lucide-react';
import { faqItems, portfolio, pricingTiers, testimonials, workflow } from './data.js';

const navItems = [
  ['Тарифы', '#services'],
  ['Кейсы', '#portfolio'],
  ['Отзывы', '#testimonials'],
  ['Процесс', '#workflow'],
  ['Условия', '#terms'],
  ['Контакты', '#contact-form']
];

const tierIcons = {
  start: MonitorSmartphone,
  landing: Rocket,
  business: Layers3
};

const tierAccent = {
  cyan: {
    line: 'from-cyber-cyan via-white/70 to-transparent',
    text: 'text-cyber-cyan',
    border: 'border-cyber-cyan/45',
    bg: 'bg-cyber-cyan/10',
    glow: 'shadow-[0_0_36px_rgba(0,255,209,0.14)]'
  },
  violet: {
    line: 'from-cyber-neon via-white/70 to-transparent',
    text: 'text-cyber-neon',
    border: 'border-cyber-neon/50',
    bg: 'bg-cyber-neon/10',
    glow: 'shadow-[0_0_48px_rgba(157,111,255,0.22)]'
  },
  pink: {
    line: 'from-cyber-pink via-white/70 to-transparent',
    text: 'text-cyber-pink',
    border: 'border-cyber-pink/45',
    bg: 'bg-cyber-pink/10',
    glow: 'shadow-[0_0_36px_rgba(255,112,184,0.14)]'
  }
};

const PROMO_DURATION_MS = 15 * 60 * 1000;
const PROMO_STORAGE_KEY = 'neonPromoExpiresAt';
const PROMO_EVENT = 'neon-promo-activated';
const PROMO_DISCOUNT = 15000;
const COOKIE_CONSENT_KEY = 'neonCookieConsent';

function scrollToId(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

function formatPromoTime(ms) {
  const safeMs = Math.max(0, ms);
  const minutes = Math.floor(safeMs / 60000);
  const seconds = Math.floor((safeMs % 60000) / 1000);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function formatPrice(amount) {
  return amount.toLocaleString('ru-RU') + ' ₽';
}

function safeStorageGet(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeStorageSet(key, value) {
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function trackGoal(goal, payload) {
  if (typeof window.ym === 'function') {
    window.ym(109145693, 'reachGoal', goal, payload);
  }
}

function activatePromoCode() {
  const nextExpiresAt = Date.now() + PROMO_DURATION_MS;
  safeStorageSet(PROMO_STORAGE_KEY, String(nextExpiresAt));
  window.dispatchEvent(new CustomEvent(PROMO_EVENT, { detail: { expiresAt: nextExpiresAt } }));
  return nextExpiresAt;
}

function ensurePromoCode() {
  const stored = Number(safeStorageGet(PROMO_STORAGE_KEY));
  if (stored > Date.now()) return stored;
  return activatePromoCode();
}

function usePromoTimer() {
  const [expiresAt, setExpiresAt] = useState(() => ensurePromoCode());
  const [remaining, setRemaining] = useState(PROMO_DURATION_MS);

  useEffect(() => {
    const onActivated = (e) => {
      const next = e.detail?.expiresAt;
      if (next) { setExpiresAt(next); setRemaining(next - Date.now()); }
    };
    window.addEventListener(PROMO_EVENT, onActivated);
    return () => window.removeEventListener(PROMO_EVENT, onActivated);
  }, []);

  useEffect(() => {
    if (!expiresAt) return undefined;
    const tick = () => {
      const next = expiresAt - Date.now();
      if (next <= 0) {
        const refreshed = activatePromoCode();
        setExpiresAt(refreshed);
        setRemaining(PROMO_DURATION_MS);
        return;
      }
      setRemaining(next);
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [expiresAt]);

  const activate = () => {
    const next = activatePromoCode();
    setExpiresAt(next);
    setRemaining(PROMO_DURATION_MS);
  };

  return { active: Boolean(expiresAt), remaining, activate };
}

function PromoAnchor({ openModal }) {
  const { remaining } = usePromoTimer();

  return (
    <motion.aside
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.75 }}
      className="promo-anchor"
    >
      <div className="promo-anchor__top">
        <div className="promo-anchor__icon">
          <Zap className="w-5 h-5" />
        </div>
        <div>
          <span>Промокод</span>
          <strong>NEON-15</strong>
        </div>
      </div>
      <div className="promo-anchor__value">
        <span>-15 000 ₽</span>
        <small>на запуск сайта под ключ при заявке с сайта</small>
      </div>
      <button
        onClick={() => openModal('Проект с промокодом NEON-15', 'скидка 15 000 ₽')}
        data-plan="Промокод NEON-15"
        data-price="скидка 15 000 ₽"
        className="promo-anchor__cta"
      >
        <span>Промокод активен</span>
        <b>{formatPromoTime(remaining)}</b>
        <ArrowRight className="w-4 h-4" />
      </button>
    </motion.aside>
  );
}

function FloatingPromo({ openModal }) {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const { active, remaining } = usePromoTimer();

  useEffect(() => {
    const onScroll = () => setVisible(window.pageYOffset > 520);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="floating-promo-wrap"
          initial={{ opacity: 0, x: 18, scale: 0.88 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 18, scale: 0.88 }}
        >
          <AnimatePresence>
            {open && (
              <motion.div
                className="floating-promo-card floating-promo-card--open"
                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.96 }}
              >
                <div className="floating-promo-card__top">
                  <span>Промокод NEON-15</span>
                  <b>{formatPromoTime(remaining)}</b>
                </div>
                <strong>−15 000 ₽</strong>
                <small>на запуск сайта под ключ</small>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    openModal('Проект с промокодом NEON-15', 'скидка 15 000 ₽');
                  }}
                >
                  Обсудить со скидкой <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="button"
            onClick={() => { ensurePromoCode(); setOpen((value) => !value); }}
            className={`floating-promo ${active ? 'floating-promo--active' : ''} ${open ? 'floating-promo--open' : ''}`}
            aria-label="Показать промокод NEON-15 на скидку 15 000 рублей"
            aria-expanded={open}
          >
            <span className="floating-promo__icon">
              <Zap className="w-4 h-4" />
            </span>
            <span className="floating-promo__copy">
              <b>{formatPromoTime(remaining)}</b>
              <small>NEON-15</small>
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PromoInModal({ rawPrice }) {
  const { active, remaining } = usePromoTimer();
  const discounted = rawPrice ? rawPrice - PROMO_DISCOUNT : null;

  return (
    <div className={`promo-in-modal ${active ? 'promo-in-modal--active' : ''}`}>
      <div className="promo-in-modal__row">
        <span className="promo-in-modal__icon"><Zap className="w-4 h-4" /></span>
        <span className="promo-in-modal__code">NEON-15</span>
        {active && <span className="promo-in-modal__badge">Активен</span>}
      </div>

      {rawPrice ? (
        <div className="promo-in-modal__price">
          {active ? (
            <>
              <span className="promo-in-modal__old">от {formatPrice(rawPrice)}</span>
              <strong className="promo-in-modal__new">от {formatPrice(discounted)}</strong>
            </>
          ) : (
            <span className="promo-in-modal__hint">Промокод NEON-15 дает <b>−15 000 ₽</b> на этом тарифе</span>
          )}
        </div>
      ) : (
        <div className="promo-in-modal__price">
          <span className="promo-in-modal__hint">Промокод NEON-15: <b>−15 000 ₽</b> на запуск сайта</span>
        </div>
      )}

      {active ? (
        <div className="promo-in-modal__timer">
          <Timer className="w-3.5 h-3.5" />
          <span>Промокод закреплен за заявкой — осталось {formatPromoTime(remaining)}</span>
        </div>
      ) : (
        <button onClick={ensurePromoCode} className="promo-in-modal__activate">
          <Zap className="w-3.5 h-3.5" />
          Активировать NEON-15
        </button>
      )}
    </div>
  );
}

function Header({ openModal }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-xl border-b border-slate-200 py-4' : 'bg-transparent py-8'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <button onClick={() => scrollToId('hero')} className="flex items-center gap-3 group" aria-label="Наверх">
          <div className="w-12 h-12 flex items-center justify-center border border-cyber-neon/50 bg-cyber-neon/10 rounded-sm group-hover:shadow-neon transition-all duration-300">
            <Zap className="text-cyber-neon w-6 h-6" />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-header font-black text-xl leading-none text-slate-900">САЙТЫ</span>
            <span className="font-sub text-xs font-bold tracking-[0.2em] text-cyber-cyan mt-1">ДЛЯ БИЗНЕСА</span>
          </div>
        </button>

        <div className="hidden md:flex items-center gap-10">
          {navItems.map(([label, href]) => (
            <a key={href} href={href} className="font-sub text-sm font-bold text-slate-700 hover:text-slate-900 transition-colors py-2">
              {label}
            </a>
          ))}
          <button
            onClick={() => openModal()}
            className="ml-6 px-8 py-3 border border-cyber-neon text-cyber-neon font-header font-bold tracking-wider text-sm hover:bg-cyber-neon hover:text-white hover:shadow-neon transition-all duration-300 uppercase"
          >
            Обсудить сайт
          </button>
        </div>

        <button className="md:hidden text-slate-900 p-2" onClick={() => setOpen(!open)} aria-label="Открыть меню">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="absolute top-full left-0 w-full bg-white border-b border-slate-200 md:hidden flex flex-col p-8 gap-8 shadow-2xl">
            {navItems.map(([label, href]) => (
              <a key={href} href={href} onClick={() => setOpen(false)} className="font-header font-bold text-xl text-slate-900 hover:text-cyber-neon transition-colors tracking-wide">
                {label}
              </a>
            ))}
            <button
              onClick={() => { setOpen(false); openModal(); }}
              className="w-full py-4 bg-cyber-neon text-white font-bold uppercase tracking-widest"
            >
              Обсудить сайт
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function Hero({ openModal }) {
  return (
    <section id="hero" className="min-h-screen flex flex-col justify-center relative pt-20 overflow-hidden">
      <div className="hero-soft-bg absolute inset-0" />
      <div className="container mx-auto px-6 relative z-10">
        <div className="hero-shell">
          <div className="hero-copy">
            <motion.div initial={{ opacity: 0, x: -28 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} className="hero-eyebrow">
              <span />
              Веб-разработка для бизнеса
            </motion.div>

            <div className="relative">
              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.15 }}
                className="font-header font-black text-5xl md:text-7xl lg:text-8xl leading-[1] text-slate-900 tracking-tight"
              >
                Сайт для бизнеса,{' '}
                <span className="block text-cyber-neon relative z-20">
                  который приводит заявки
                </span>
              </motion.h1>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.3 }}
                className="hero-price"
              >
                <span>от 45 000 ₽</span>
                <b />
                цена фиксируется до начала работ
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }} className="hero-message">
              <h2>
                Клиент видит услуги, цены и сразу понимает, как с вами связаться
              </h2>
              <p>
                Покажем услуги, цены, примеры работ и контакты простыми словами. Без сложных терминов и лишней суеты.
              </p>
              <div className="hero-mobile-points" aria-label="Что входит в сайт">
                <span><MonitorSmartphone className="w-4 h-4" /> Удобно с телефона</span>
                <span><ShieldCheck className="w-4 h-4" /> Цена до начала</span>
                <span><PhoneCall className="w-4 h-4" /> Звонки и заявки</span>
              </div>
            </div>
          </div>

          <motion.aside initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.35 }} className="hero-side">
            <div className="hero-side__card">
              <span className="hero-side__tag">Что получите</span>
              <ul>
                <li><CheckCircle2 className="w-5 h-5" /> Понятная структура для рекламы и заявок</li>
                <li><CheckCircle2 className="w-5 h-5" /> Кнопки звонка, Telegram, MAX или форма</li>
                <li><CheckCircle2 className="w-5 h-5" /> Мобильная версия в приоритете</li>
              </ul>
            </div>

            <div className="hero-actions">
              <div className="hero-actions__buttons">
                <button
                  onClick={() => openModal()}
                  className="px-7 md:px-8 py-4 bg-cyber-neon text-white font-header font-bold tracking-wider uppercase text-sm md:text-base hover:bg-blue-700 transition-all duration-300 shadow-neon hover:shadow-none text-center"
                >
                  Обсудить сайт
                </button>
                <a href="#workflow" className="px-7 md:px-8 py-4 border border-slate-300 text-slate-900 font-sub font-bold tracking-wider uppercase text-xs md:text-sm hover:border-cyber-cyan hover:text-cyber-cyan transition-all duration-300 flex items-center justify-center bg-white/70 backdrop-blur-sm">
                  Как проходит работа
                </a>
              </div>
              <PromoAnchor openModal={openModal} />
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
const statsData = [
  { value: '8+', label: 'Запущенных сайтов' },
  { value: '48 ч', label: 'Стартовый срок' },
  { value: '45К', label: 'Цена от' },
  { value: '50/50', label: 'Схема оплаты' },
];

function Stats() {
  return (
    <section className="stats-row border-y border-slate-200 bg-white">
      <div className="container mx-auto px-6">
        <div className="stats-row__grid">
          {statsData.map(({ value, label }, i) => (
            <motion.div
              key={label}
              className="stats-row__item"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <strong>{value}</strong>
              <span>{label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingPromoStrip({ tier, openModal }) {
  const { active, activate } = usePromoTimer();
  const discounted = tier.rawPrice - PROMO_DISCOUNT;

  const handleClick = (e) => {
    e.stopPropagation();
    if (!active) activate();
    openModal(tier.title, tier.price, tier.rawPrice);
  };

  return (
    <button
      onClick={handleClick}
      className={`pricing-thread__promo ${active ? 'pricing-thread__promo--active' : ''}`}
    >
      <Zap className="w-3.5 h-3.5 flex-shrink-0" />
      {active ? (
        <>
          <span className="pricing-thread__promo-old">от {formatPrice(tier.rawPrice)}</span>
          <strong>от {formatPrice(discounted)}</strong>
          <span className="pricing-thread__promo-tag">NEON-15</span>
        </>
      ) : (
        <>
          <span>Промокод NEON-15</span>
          <strong>−15 000 ₽</strong>
          <span className="pricing-thread__promo-hint">закрепить →</span>
        </>
      )}
    </button>
  );
}

function Services({ openModal }) {
  return (
    <section id="services" className="pricing-lab py-24 md:py-32 relative border-t border-slate-200 bg-white overflow-hidden">
      <div className="pricing-noise absolute inset-0 pointer-events-none opacity-70" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyber-cyan/50 to-transparent" />
      <div className="container mx-auto px-5 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16 items-end mb-12 md:mb-16">
          <div>
            <span className="inline-flex items-center gap-3 text-cyber-cyan font-sub text-xs tracking-[0.28em] uppercase font-bold">
              <span className="w-2 h-2 bg-cyber-cyan shadow-cyan" />
              Стоимость
            </span>
            <h2 className="font-header font-black text-4xl sm:text-5xl md:text-6xl text-slate-900 mt-4 leading-[1] tracking-tight">
              Выберите <span className="text-cyber-cyan">подходящий сайт</span>
            </h2>
          </div>
          <div className="pricing-brief">
            <div className="pricing-brief__bar">
              <span />
              <span />
              <span />
              <b>цены на 2026 год</b>
            </div>
            <p>
              Три понятных варианта: первый сайт для начала, лендинг под рекламу и сайт компании с несколькими страницами.
            </p>
            <div className="pricing-brief__meta">
              <span>без магазина</span>
              <span>без сложных интеграций</span>
              <span>публикация включена</span>
            </div>
          </div>
        </div>

        <div className="pricing-board">
          {pricingTiers.map((tier, index) => {
            const Icon = tierIcons[tier.id] || FileText;
            const accent = tierAccent[tier.accent];
            return (
              <article key={tier.id} className={`pricing-thread ${tier.featured ? 'pricing-thread--featured' : ''} ${accent.glow}`}>
                <div className={`pricing-thread__rail bg-gradient-to-b ${accent.line}`} />
                <div className="pricing-thread__index">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <small>{tier.code}</small>
                </div>
                <div className="pricing-thread__body">
                  <div className="pricing-thread__top">
                    <div className={`pricing-thread__icon ${accent.bg} ${accent.text} ${accent.border}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-header font-black text-2xl md:text-3xl text-slate-900 leading-none tracking-tight">{tier.title}</h3>
                        {tier.featured && <span className="pricing-thread__badge">Оптимальный</span>}
                      </div>
                      <p className={`mt-2 font-sub text-sm font-bold tracking-[0.16em] uppercase ${accent.text}`}>{tier.name}</p>
                    </div>
                  </div>

                  <div className="pricing-thread__price">
                    <span>от</span>
                    <strong>{tier.price}</strong>
                  </div>

                  <p className="pricing-thread__lead">{tier.lead}</p>

                  <div className="pricing-thread__fit">
                    <b>Кому:</b>
                    <span>{tier.fit}</span>
                  </div>

                  <ul className="pricing-thread__scope">
                    {tier.scope.map((item) => (
                      <li key={item}>
                        <Check className={`w-4 h-4 ${accent.text}`} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pricing-thread__footer">
                    <div>
                      <small>Срок</small>
                      <b>{tier.timeline}</b>
                    </div>
                    <button
                      onClick={() => openModal(tier.title, tier.price, tier.rawPrice)}
                      className={`pricing-thread__cta ${accent.text}`}
                    >
                      Обсудить сайт <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  <PricingPromoStrip tier={tier} openModal={openModal} />
                </div>
                <div className="pricing-thread__result">
                  <span>Итог</span>
                  <p>{tier.outcome}</p>
                </div>
              </article>
            );
          })}
        </div>

        <div className="pricing-note">
          <span>Важно:</span>
          <p>Все тарифы без интернет-магазина, личных кабинетов и сложных внешних интеграций. Такие задачи считаются отдельно, чтобы не раздувать базовые пакеты.</p>
        </div>
      </div>
    </section>
  );
}

function Portfolio({ openModal }) {
  const [active, setActive] = useState(null);

  return (
    <section id="portfolio" className="py-24 bg-white relative">
      <div className="absolute top-10 right-0 font-header font-black text-[10rem] md:text-[20rem] text-slate-900/5 leading-none select-none -z-1 overflow-hidden whitespace-nowrap">REAL</div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-20 pt-10">
          <span className="text-cyber-cyan font-sub text-sm tracking-[0.3em] uppercase font-bold">Кейсы</span>
          <h2 className="font-header font-black text-4xl md:text-5xl lg:text-6xl text-slate-900 mt-3 leading-[1.05] tracking-tight">
            Примеры работ <span className="text-cyber-cyan">для бизнеса</span>
          </h2>
          <p className="mt-4 text-slate-600 max-w-2xl font-light">
            Сделал кейсы крупнее и понятнее: отрасль, задача, решение и результат. Изображения можно открыть и рассмотреть отдельно.
          </p>
        </div>

        <div className="portfolio-grid">
          {portfolio.map((project) => (
            <button key={project.id} onClick={() => setActive(project)} className="portfolio-card group">
              <div className="portfolio-card__image">
                <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 transform group-hover:scale-105" />
                <div className="absolute top-4 left-4 z-20">
                  <span className="portfolio-card__tag">{project.category}</span>
                </div>
                <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-slate-900/35 backdrop-blur-[2px]">
                  <div className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center bg-cyber-neon text-white transform scale-75 group-hover:scale-100 transition-transform duration-300 shadow-lg">
                    <Eye className="w-8 h-8" />
                  </div>
                </div>
              </div>
              <div className="portfolio-card__body">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="portfolio-card__chips">
                  {project.techStack.map((tech) => (
                    <span key={tech}>{tech}</span>
                  ))}
                </div>
                <span className="portfolio-card__open">Открыть кейс <ArrowRight className="w-4 h-4" /></span>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-20 text-center">
          <button
            onClick={() => openModal()}
            className="px-12 py-5 border border-slate-200 bg-slate-100 backdrop-blur text-slate-900 font-header font-bold uppercase tracking-widest hover:bg-cyber-neon hover:border-cyber-neon hover:text-white transition-all duration-300"
          >
            Хочу похожий сайт
          </button>
        </div>
      </div>
      <ProjectModal project={active} onClose={() => setActive(null)} openModal={openModal} />
    </section>
  );
}

const liveProjects = [
  {
    title: 'Q-Bench',
    url: 'https://ai-benchmark.space/',
    type: 'AI audit platform',
    accent: 'AI-SAFETY25',
    lead: 'Сервис для оценки качества ответов ИИ-моделей, аудита чат-ботов и поиска рисков до контакта с клиентами.',
    stack: ['AI evaluation', 'Landing', 'Pricing', 'Telegram CTA'],
    result: 'Упаковали сложную B2B-услугу в понятную воронку: проблема, метрики, тарифы, демо и быстрый контакт.',
    stats: ['24ч отчет', '30 тестов', 'ROI-блок']
  },
  {
    title: 'DeepThroat',
    url: 'https://xn------6cdcftgetdacf6b3ah5dablkc92a.xn--p1ai/',
    type: 'AI security platform',
    accent: 'OWASP / RAG / API',
    lead: 'Платформа для проверки LLM до релиза и после инцидента: red teaming, RAG evaluation и API runner в едином дашборде.',
    stack: ['OWASP LLM Top 10', 'DeepEval', 'Docker', 'RAG evaluation'],
    result: 'Сложный security-продукт превратили в понятный первый экран: зачем проверять LLM, какие риски закрывает и как быстро перейти к аудиту.',
    stats: ['red teaming', 'self-hosted', 'no telemetry']
  },
  {
    title: 'Индекс Роста',
    url: 'https://qubitai.ru/',
    type: 'SEO / Digital',
    accent: 'GROWTH OS',
    lead: 'Digital-сайт про SEO, разработку, аналитику и контекстную рекламу для заявок в Яндексе и Google.',
    stack: ['SEO pages', 'Analytics', 'Services', 'Content'],
    result: 'Упаковали услуги в систему роста: точки входа, кейсы, план работ, доверие, формы и юридические страницы.',
    stats: ['+38% leads', '2.4x visibility', '126 pages']
  }
];

function LiveProjects({ openModal }) {
  return (
    <section id="live-projects" className="py-24 bg-slate-50 border-t border-slate-200 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-16 max-w-2xl">
          <span className="text-cyber-cyan font-sub text-sm tracking-[0.3em] uppercase font-bold">Действующие сайты</span>
          <h2 className="font-header font-black text-4xl md:text-5xl lg:text-6xl text-slate-900 mt-3 leading-[1.05] tracking-tight">
            Сайты, <span className="text-cyber-cyan">которые работают прямо сейчас</span>
          </h2>
          <p className="mt-5 text-slate-600 font-light text-lg">
            Реальные проекты, открываются по доменам. Разные задачи: AI-аудит, ИИ-безопасность, SEO-digital.
          </p>
        </div>

        <div className="live-projects__grid">
          {liveProjects.map((project, index) => {
            const hostname = (() => { try { return new URL(project.url).hostname; } catch { return project.url; } })();
            return (
              <motion.article
                key={project.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`live-card live-card--${index + 1}`}
              >
                <div className="live-card__screen">
                  <div className="live-card__bar">
                    <span /><span /><span />
                    <small>{hostname}</small>
                  </div>
                  <div className="live-card__preview">
                    <div className="live-card__eyebrow">{project.type}</div>
                    <div className="live-card__title">{project.title}</div>
                    <div className="live-card__accent">{project.accent}</div>
                    <div className="live-card__lines">
                      <i /><i /><i />
                    </div>
                  </div>
                </div>

                <div className="live-card__body">
                  <div className="live-card__meta">
                    <span>0{index + 1}</span>
                    <span>production</span>
                  </div>
                  <h3>{project.title}</h3>
                  <p>{project.lead}</p>
                  <div className="live-card__stats">
                    {project.stats.map((stat) => <span key={stat}>{stat}</span>)}
                  </div>
                  <p className="live-card__result">{project.result}</p>
                  <div className="live-card__stack">
                    {project.stack.map((tag) => <span key={tag}>{tag}</span>)}
                  </div>
                  <div className="live-card__actions">
                    <a href={project.url} target="_blank" rel="noopener noreferrer">Открыть сайт <ArrowRight className="w-4 h-4" /></a>
                    <button type="button" onClick={() => openModal('Похожий проект', '')}>Хочу похожий</button>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ProjectModal({ project, onClose, openModal }) {
  const [zoomImage, setZoomImage] = useState(null);

  useEffect(() => {
    if (!project) return undefined;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, [project]);

  useEffect(() => {
    if (!project) setZoomImage(null);
  }, [project]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="project-modal fixed inset-0 z-[100] overflow-y-auto">
          <button onClick={onClose} className="project-modal__close fixed top-6 right-6 z-[110] w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 group" aria-label="Закрыть проект">
            <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
          </button>

          <div className="container mx-auto px-6 py-20 md:py-24">
            <div className="project-modal__shell">
              <div className="project-modal__hero">
                <button type="button" onClick={() => setZoomImage(project.imageUrl)} className="project-modal__image" aria-label={`Открыть изображение ${project.title}`}>
                  <img src={project.imageUrl} alt={project.title} />
                  <span className="project-image-hint"><Eye className="w-4 h-4" /> Открыть изображение</span>
                </button>
                <div className="project-modal__intro">
                  <motion.span initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }} className="project-modal__category">
                    {project.category}
                  </motion.span>
                  <motion.h1 initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.22 }}>
                    {project.title}
                  </motion.h1>
                  <p>{project.description}</p>
                  <button
                    onClick={() => { onClose(); setTimeout(() => openModal(), 100); }}
                    className="project-modal__cta"
                  >
                    Обсудить похожий сайт <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="project-modal__grid">
                <motion.aside initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="project-modal__details">
                  <h3>Детали</h3>
                  <div className="project-modal__detail-list">
                    <Detail icon={Timer} label="Год" value={project.year || '2026'} />
                    <Detail icon={ShieldCheck} label="Клиент" value={project.client || project.title} />
                    <div className="project-detail">
                      <Code2 className="project-detail__icon" />
                      <div>
                        <span>Что сделано</span>
                        <div className="project-detail__chips">
                          {project.techStack.map((tech) => (
                            <em key={tech}>{tech}</em>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.aside>

                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.38 }} className="project-modal__texts">
                  <ProjectText number="01." title="Задача" color="text-cyber-pink" text={project.challenge} />
                  <ProjectText number="02." title="Решение" color="text-cyber-neon" text={project.solution} />
                  <ProjectText number="03." title="Результат" color="text-cyber-cyan" text={project.result} />
                </motion.div>
              </div>

              <div className="project-modal__gallery">
                {project.additionalImages.map((image, index) => (
                  <motion.button type="button" onClick={() => setZoomImage(image)} key={`${image}-${index}`} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.08 * index }} className="project-modal__thumb">
                    <img src={image} alt={`${project.title} detail`} />
                    <span className="project-thumb-hint"><Eye className="w-4 h-4" /> Смотреть</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          <AnimatePresence>
            {zoomImage && (
              <motion.div
                className="image-lightbox"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setZoomImage(null)}
              >
                <button type="button" className="image-lightbox__close" onClick={() => setZoomImage(null)} aria-label="Закрыть изображение">
                  <X className="w-5 h-5" />
                </button>
                <img src={zoomImage} alt={`${project.title} full view`} onClick={(e) => e.stopPropagation()} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Detail({ icon: Icon, label, value }) {
  return (
    <div className="project-detail">
      <Icon className="project-detail__icon" />
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

function ProjectText({ number, title, color, text }) {
  return (
    <div className="project-text">
      <h3>
        <span className={color}>{number}</span> {title}
      </h3>
      <p className={number === '03.' ? 'project-text__result' : ''}>{text}</p>
    </div>
  );
}

const accentColors = {
  cyan: { bg: 'bg-cyber-cyan/10', border: 'border-cyber-cyan/30', text: 'text-cyber-cyan', avatar: 'bg-cyber-cyan text-[#070613]' },
  violet: { bg: 'bg-cyber-neon/10', border: 'border-cyber-neon/30', text: 'text-cyber-neon', avatar: 'bg-cyber-neon text-white' },
  pink: { bg: 'bg-cyber-pink/10', border: 'border-cyber-pink/30', text: 'text-cyber-pink', avatar: 'bg-cyber-pink text-white' },
};

const teamExpert = {
  name: 'Алексей',
  role: 'ведет запуск и правки сайта',
  image: '/img/project-manager-portrait.png',
  text: 'Помогает быстро собрать задачу, подготовить материалы и довести сайт до запуска без длинных брифов и лишних созвонов.'
};

function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-white border-t border-slate-200 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyber-neon/5 filter blur-[100px] pointer-events-none" />
      <div className="container mx-auto px-6 relative z-10">
        <div className="testimonials-head">
          <div>
            <span className="text-cyber-neon font-sub text-sm tracking-[0.3em] uppercase font-bold">Отзывы</span>
            <h2 className="font-header font-black text-4xl md:text-5xl lg:text-6xl text-slate-900 mt-3 leading-[1.05] tracking-tight">
              Что <span className="text-cyber-neon">говорят</span> клиенты
            </h2>
            <p className="mt-4 text-slate-600 font-light">Не идеальная витрина на 5.0, а живые впечатления после запуска и правок.</p>
          </div>
          <div className="testimonials-score">
            <strong>4.8</strong>
            <div>
              <span>средняя оценка</span>
              <small>по последним проектам</small>
            </div>
          </div>
        </div>

        <div className="testimonials-layout">
          <motion.aside
            className="team-expert"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <div className="team-expert__image">
              <img src={teamExpert.image} alt={`${teamExpert.name}, ${teamExpert.role}`} />
            </div>
            <div className="team-expert__body">
              <span>Наш сотрудник</span>
              <h3>{teamExpert.name}</h3>
              <strong>{teamExpert.role}</strong>
              <p>{teamExpert.text}</p>
            </div>
          </motion.aside>

          <div className="testimonials-track" aria-label="Отзывы клиентов">
            {testimonials.map((t, i) => {
              const colors = accentColors[t.accent];
              return (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className={`tcard border ${colors.border} ${colors.bg}`}
                >
                  <div className="tcard__stars">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        className={`w-4 h-4 ${idx < t.rating ? `fill-current ${colors.text}` : 'text-slate-300'}`}
                      />
                    ))}
                    <span>{t.rating}.0</span>
                  </div>
                  <p className="tcard__quote">"{t.text}"</p>
                  <div className="tcard__author">
                    <div className={`tcard__avatar ${colors.avatar}`}>{t.initial}</div>
                    <div>
                      <strong>{t.name}</strong>
                      <span>{t.role}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function Workflow({ openModal }) {
  const icons = [MessageCircle, Zap, Rocket];

  return (
    <section id="workflow" className="py-24 bg-cyber-bg relative overflow-hidden border-t border-slate-200">
      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-20 text-center max-w-3xl mx-auto">
          <span className="text-cyber-cyan font-sub text-sm tracking-[0.3em] uppercase font-bold">Процесс</span>
          <h2 className="font-header font-black text-4xl md:text-5xl lg:text-6xl text-slate-900 mt-4 leading-[1.05] tracking-tight">
            От идеи до сайта — <span className="text-cyber-cyan relative inline-block">без лишней бюрократии</span>
          </h2>
          <p className="mt-6 text-slate-600 font-light">Сначала фиксируем задачу и цену, потом показываю тестовую ссылку, вносим правки и запускаем сайт.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 relative">
          <div className="hidden md:block absolute top-12 left-0 w-full h-[2px] bg-gradient-to-r from-cyber-pink via-cyber-neon to-cyber-cyan opacity-30" />
          {workflow.map((step, index) => {
            const Icon = icons[index];
            const color = index === 0 ? 'text-cyber-pink' : index === 1 ? 'text-cyber-neon' : 'text-cyber-cyan';
            return (
              <div key={step.title} className="relative z-10 flex flex-col items-center text-center group">
                <div className="w-24 h-24 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center mb-6 group-hover:border-cyber-cyan transition-colors shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
                  <Icon className={`w-10 h-10 ${color}`} />
                </div>
                <div className="bg-white p-6 border border-slate-200 rounded-sm w-full hover:bg-slate-50 hover:border-slate-300 transition-all duration-300">
                  <h3 className="font-header font-bold text-2xl text-slate-900 mb-3">{step.title}</h3>
                  <p className="font-body text-sm text-slate-600 leading-relaxed">{step.text}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-slate-200 rounded-lg overflow-hidden mb-12">
          <div className="bg-slate-100 p-10 md:p-16 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-red-500/50" />
            <h3 className="font-header font-bold text-2xl text-slate-600 mb-6 flex items-center gap-3">
              <XCircle className="text-red-500" /> ЧАСТЫЕ ПРОБЛЕМЫ
            </h3>
            <ul className="space-y-4 font-body text-slate-500 text-sm">
              <li className="flex items-start gap-3"><XCircle className="w-5 h-5 shrink-0 mt-0.5" /><span>Неясная цена и доплаты после начала работ</span></li>
              <li className="flex items-start gap-3"><XCircle className="w-5 h-5 shrink-0 mt-0.5" /><span>Сайт долго открывается и неудобен с телефона</span></li>
              <li className="flex items-start gap-3"><span>✖</span><span>Переплата за менеджмент и лишние созвоны</span></li>
            </ul>
          </div>
          <div className="bg-white p-10 md:p-16 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-cyber-cyan" />
            <h3 className="font-header font-bold text-2xl text-slate-900 mb-6 flex items-center gap-3">
              <ShieldCheck className="text-cyber-cyan" /> КАК РАБОТАЮ Я
            </h3>
            <ul className="space-y-4 font-body text-slate-700 text-sm font-medium">
              <li className="flex items-start gap-3 text-slate-900"><Check className="w-5 h-5 shrink-0 mt-0.5 text-cyber-cyan" /><span>Срок и стоимость фиксируем <span className="text-cyber-cyan">до начала</span></span></li>
              <li className="flex items-start gap-3 text-slate-900"><Check className="w-5 h-5 shrink-0 mt-0.5 text-cyber-cyan" /><span>Сайт быстро открывается и удобно смотрится с телефона.</span></li>
              <li className="flex items-start gap-3 text-slate-900"><span className="text-cyber-cyan">✔</span><span>Прямая связь с разработчиком.</span></li>
            </ul>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => openModal()}
            className="px-12 py-5 bg-cyber-neon text-white font-header font-bold uppercase tracking-widest hover:bg-blue-700 transition-all duration-300 shadow-neon"
          >
            Обсудить сайт
          </button>
        </div>
      </div>
    </section>
  );
}

function Terms() {
  return (
    <section id="terms" className="py-24 bg-slate-50 border-t border-slate-200 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-16">
          <span className="text-cyber-pink font-sub text-sm tracking-[0.3em] uppercase font-bold">Прозрачные условия</span>
          <h2 className="font-header font-black text-4xl md:text-5xl lg:text-6xl text-slate-900 mt-3 leading-[1.05] tracking-tight">
            Условия <span className="text-cyber-cyan">без сюрпризов</span>
          </h2>
          <p className="mt-4 text-slate-600 max-w-2xl font-light">До начала работ понятно, что входит в стоимость, когда будет первый вариант и как передаются доступы.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <TermCard icon={CreditCard} color="text-cyber-cyan" title="ОПЛАТА 50/50">
            <p>Работаю официально через <span className="text-slate-900 font-bold">ЮКассу</span>.</p>
            <ul className="space-y-2">
              <li>50% предоплата для начала работ.</li>
              <li>50% перед передачей доступов.</li>
            </ul>
          </TermCard>
          <TermCard icon={XCircle} color="text-cyber-pink" title="ОТКАЗ И ВОЗВРАТ">
            <p className="border-l-2 border-cyber-pink pl-4 italic">"Предоплата бронирует время в моем графике."</p>
            <p>Если вы отказываетесь после начала работ, предоплата не возвращается.</p>
          </TermCard>
          <TermCard icon={ShieldCheck} color="text-cyber-neon" title="ПРАВКИ">
            <p>Мелкие баги и правки исправляю бесплатно в течение 48 часов после сдачи.</p>
            <p>Полная переделка логики или дизайна оплачивается отдельно.</p>
          </TermCard>
        </div>
      </div>
    </section>
  );
}

function TermCard({ icon: Icon, color, title, children }) {
  return (
    <div className="group bg-white/70 p-8 border border-slate-200 hover:border-slate-300 transition-all duration-300 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Icon className={`w-24 h-24 ${color}`} />
      </div>
      <div className="w-12 h-12 bg-slate-100 border border-slate-200 flex items-center justify-center rounded-sm mb-6">
        <Icon className={`${color} w-6 h-6`} />
      </div>
      <h3 className={`font-header font-bold text-xl mb-4 uppercase tracking-wide ${color}`}>{title}</h3>
      <div className="font-body text-slate-600 text-sm leading-relaxed space-y-4">{children}</div>
    </div>
  );
}

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id="faq" className="py-24 bg-white border-t border-slate-200 relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-cyber-cyan/5 filter blur-[120px] pointer-events-none" />
      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-16 max-w-2xl">
          <span className="text-cyber-cyan font-sub text-sm tracking-[0.3em] uppercase font-bold">FAQ</span>
          <h2 className="font-header font-black text-4xl md:text-5xl lg:text-6xl text-slate-900 mt-3 leading-[1.05] tracking-tight">
            Частые <span className="text-cyber-cyan">вопросы</span>
          </h2>
          <p className="mt-4 text-slate-600 font-light">Ответы на то, что спрашивают чаще всего перед началом работы.</p>
        </div>

        <div className="faq-accordion max-w-3xl">
          {faqItems.map((item, i) => (
            <div key={i} className={`faq-item ${openIndex === i ? 'faq-item--open' : ''}`}>
              <button
                className="faq-item__btn"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                aria-expanded={openIndex === i}
              >
                <span>{item.q}</span>
                <ChevronDown className={`faq-item__chevron w-5 h-5 flex-shrink-0 transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    key="answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <p className="faq-item__answer">{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LandingBonus({ openModal }) {
  return (
    <section className="landing-bonus bg-white border-t border-slate-200 relative overflow-hidden">
      <div className="landing-bonus__word" aria-hidden="true">GIFT</div>
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="landing-bonus__card"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <div className="landing-bonus__panel landing-bonus__panel--logo">
            <div className="landing-bonus__head">
              <div className="landing-bonus__icon">
                <Gift className="w-7 h-7" />
              </div>
              <div>
                <span>Бонус к лендингу</span>
                <h2>Логотип в подарок</h2>
              </div>
            </div>
            <p>
              При заказе лендинга подготовим простой логотип для первого запуска,
              чтобы сайт, мессенджеры и реклама выглядели цельно.
            </p>
            <button
              type="button"
              onClick={() => openModal('Продающий лендинг', '90 000 ₽', 90000)}
              className="landing-bonus__cta"
            >
              Обсудить лендинг <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="landing-bonus__panel landing-bonus__panel--pdf">
            <div className="landing-bonus__head">
              <div className="landing-bonus__icon">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span>PDF-гайд</span>
                <strong>Что будет после запуска сайта</strong>
              </div>
            </div>
            <p>
              Короткий файл: что вы получите, как подготовить материалы
              и как потом улучшать сайт с помощью ИИ.
            </p>
            <a
              href="/gift/neon-guide.pdf"
              download
              className="landing-bonus__download"
            >
              Скачать PDF <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function InlineContactForm() {
  const [fields, setFields] = useState({ name: '', contact: '' });
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const { active: promoActive } = usePromoTimer();

  const update = (key) => (e) => setFields((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');
    setErrorMsg('');

    const fd = new FormData();
    const baseMessage = 'Заявка с формы на главной: уточнить задачу в переписке.';
    fd.append('name', fields.name);
    fd.append('contact', fields.contact);
    fd.append('message', baseMessage + (promoActive ? '\n[Промокод NEON-15 закреплен]' : ''));
    fd.append('plan', promoActive ? 'Форма на главной с промокодом NEON-15' : 'Форма на главной');
    fd.append('price', promoActive ? `Промокод NEON-15: скидка ${formatPrice(PROMO_DISCOUNT)} на проект` : 'Тариф по задаче');
    fd.append('personal_data_agree', 'yes');
    fd.append('privacy_read', 'yes');

    try {
      const res = await fetch('/contact.php', { method: 'POST', body: fd });
      const json = await res.json();
      if (!json.ok) {
        setStatus('error');
        setErrorMsg(json.message || 'Ошибка при отправке.');
        return;
      }
      trackGoal('lead_sent', {
        plan: fd.get('plan') || 'Форма на главной',
        price: fd.get('price') || 'Тариф по задаче',
        source: 'main_contact_form'
      });
      setFields({ name: '', contact: '' });
      setStatus('success');
    } catch {
      setStatus('error');
      setErrorMsg('Сервер недоступен. Напишите напрямую в Telegram или MAX.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="contact-inline-form">
      <div className="contact-inline-form__head">
        <span>Форма обратной связи</span>
        <h3>Оставьте имя и контакт</h3>
        <p>Я сам уточню задачу в переписке или по звонку.</p>
      </div>

      <div className="contact-inline-form__grid">
        <label>
          <span>Имя *</span>
          <input
            type="text"
            value={fields.name}
            onChange={update('name')}
            placeholder="Как вас зовут?"
            required
            maxLength={120}
            autoComplete="name"
          />
        </label>
        <label>
          <span>Телефон, Telegram или MAX *</span>
          <input
            type="text"
            value={fields.contact}
            onChange={update('contact')}
            placeholder="@username или +7..."
            required
            maxLength={180}
          />
        </label>
      </div>

      {status === 'error' && <p className="contact-inline-form__error">{errorMsg}</p>}
      {status === 'success' && <p className="contact-inline-form__success">Заявка отправлена. Я свяжусь с вами в ближайшее время.</p>}

      <button type="submit" disabled={status === 'sending'} className="contact-inline-form__submit">
        {status === 'sending' ? (
          <><Loader2 className="w-5 h-5 animate-spin" /> Отправляю...</>
        ) : (
          <><Send className="w-5 h-5" /> Отправить заявку</>
        )}
      </button>

      <p className="contact-inline-form__legal">
        Нажимая «Отправить», вы соглашаетесь с{' '}
        <a href="/privacy.html" target="_blank" rel="noopener noreferrer">Политикой конфиденциальности</a>.
      </p>
    </form>
  );
}

function ContactSection() {
  return (
    <section id="contact-form" className="contact-section border-t border-slate-200 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="contact-section__grid">
          <div className="contact-section__copy">
            <span>Контакты</span>
            <h2>Написать напрямую</h2>
            <p>
              Выберите удобный мессенджер. Отвечу в Telegram или MAX.
            </p>
            <div className="contact-section__actions">
              <a
                href="https://t.me/Rambajo"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-section__secondary"
              >
                <MessageCircle className="w-4 h-4" />
                Telegram
              </a>
              <a
                href="https://max.ru/u/f9LHodD0cOJ5MDDMdgloDt0hKnUdAN8UnSnCJ4M6vSdQUFm08O7EDBIkgEQ"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-section__primary"
              >
                <MessageCircle className="w-4 h-4" />
                MAX
              </a>
            </div>
            <p className="contact-section__note">
              MAX — российский мессенджер для переписки и звонков.
            </p>
          </div>

          <InlineContactForm />
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="contact" className="bg-white border-t border-slate-200 relative">
      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_0.8fr_0.8fr] gap-10 md:gap-12 mb-12">
          <div>
            <div className="font-header font-black text-3xl text-slate-900 tracking-tight">
              NEON<span className="text-cyber-neon"> DEV</span>
            </div>
            <p className="mt-4 max-w-md text-slate-600 font-light leading-relaxed">
              Сайты под ключ для малого бизнеса: страницы услуг, продающие лендинги и небольшие сайты компаний.
              Чистый код, адаптив, аналитика и запуск без подписок на конструктор.
            </p>
          </div>

          <div>
            <div className="font-sub text-xs tracking-[0.18em] uppercase text-cyber-neon font-bold mb-4">Контакты</div>
            <div className="flex flex-col gap-3 text-sm">
              <a href="https://t.me/Rambajo" target="_blank" rel="noopener noreferrer" className="text-slate-700 hover:text-cyber-neon transition-colors">Telegram</a>
              <a href="https://vk.com/allakhverdievr" target="_blank" rel="noopener noreferrer" className="text-slate-700 hover:text-cyber-neon transition-colors">VK</a>
              <a href="mailto:qubitaibots@gmail.com" className="text-slate-700 hover:text-cyber-neon transition-colors">qubitaibots@gmail.com</a>
              <a href="tel:+79012728916" className="text-slate-700 hover:text-cyber-neon transition-colors">+7 901 272-89-16</a>
            </div>
          </div>

          <div>
            <div className="font-sub text-xs tracking-[0.18em] uppercase text-cyber-neon font-bold mb-4">Документы</div>
            <div className="flex flex-col gap-3 text-sm">
              <a href="/privacy.html" className="text-slate-700 hover:text-cyber-neon transition-colors">Политика конфиденциальности</a>
              <a href="/consent.html" className="text-slate-700 hover:text-cyber-neon transition-colors">Согласие на обработку ПД</a>
              <a href="/cookies.html" className="text-slate-700 hover:text-cyber-neon transition-colors">Политика cookies</a>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-8 border-t border-slate-200">
          <span className="text-slate-500 text-xs font-sub tracking-wider">© 2026 NEON DEV. Разработка сайтов для малого бизнеса.</span>
          <span className="text-slate-400 text-xs font-mono">status: online · stack: react + php</span>
        </div>
      </div>
    </footer>
  );
}

function ModalSuccess({ plan, onClose }) {
  return (
    <div className="contact-modal__success">
      <div className="contact-modal__success-icon">
        <CheckCircle2 className="w-10 h-10 text-cyber-cyan" />
      </div>
      <h3 className="font-header font-black text-2xl md:text-3xl text-slate-900 uppercase">Заявка отправлена!</h3>
      <p className="text-slate-600 font-light text-center max-w-sm leading-relaxed">
        Увижу её в ближайшее время и напишу вам{plan ? ` по тарифу "${plan}"` : ''}. Обычно отвечаю в течение нескольких часов.
      </p>
      <a
        href="https://t.me/Rambajo"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-3 px-8 py-4 bg-[#229ED9] text-white font-header font-bold uppercase tracking-wider hover:bg-[#1e8bbd] transition-colors"
      >
        <MessageCircle className="w-5 h-5" />
        Написать в Telegram
      </a>
      <button onClick={onClose} className="text-slate-500 hover:text-slate-900 text-sm transition-colors mt-2">
        Закрыть
      </button>
    </div>
  );
}

function ContactModal({ data, onClose }) {
  const [fields, setFields] = useState({ name: '', contact: '', message: '' });
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const { active: promoActive, remaining } = usePromoTimer();
  const promoPrice = promoActive && data?.rawPrice
    ? `от ${formatPrice(data.rawPrice - PROMO_DISCOUNT)} (промокод NEON-15)`
    : promoActive
      ? `Промокод NEON-15: скидка ${formatPrice(PROMO_DISCOUNT)} на проект`
      : (data?.price || '');

  useEffect(() => {
    if (!data) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [data]);

  useEffect(() => {
    if (!data) return undefined;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [data, onClose]);

  useEffect(() => {
    if (!data) return;
    setFields({ name: '', contact: '', message: '' });
    setStatus('idle');
    setErrorMsg('');
  }, [data]);

  const update = (key) => (e) => setFields((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');
    setErrorMsg('');

    const fd = new FormData();
    fd.append('name', fields.name);
    fd.append('contact', fields.contact);
    const baseMessage = fields.message.trim() || 'Заявка без комментария: уточнить задачу в переписке.';
    const msgWithPromo = baseMessage + (promoActive ? '\n[Промокод NEON-15 закреплен]' : '');
    fd.append('message', msgWithPromo);
    fd.append('plan', data?.plan || (promoActive ? 'Проект с промокодом NEON-15' : 'Не указан'));
    fd.append('price', promoPrice);
    fd.append('personal_data_agree', 'yes');
    fd.append('privacy_read', 'yes');

    try {
      const res = await fetch('/contact.php', { method: 'POST', body: fd });
      const json = await res.json();
      if (json.ok) {
        trackGoal('lead_sent', {
          plan: fd.get('plan') || 'Не указан',
          price: fd.get('price') || 'Не указана'
        });
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMsg(json.message || 'Ошибка при отправке.');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Сервер недоступен. Напишите напрямую в Telegram @Rambajo.');
    }
  };

  return (
    <AnimatePresence>
      {data && (
        <motion.div
          className="fixed inset-0 z-[200] overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
          <div className="relative min-h-full flex items-center justify-center p-4 py-10">
            <motion.div
              className="contact-modal relative w-full max-w-xl"
              initial={{ scale: 0.95, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 24 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center border border-slate-200 bg-slate-100 hover:bg-cyber-neon hover:border-cyber-neon text-slate-700 hover:text-white transition-all"
                aria-label="Закрыть"
              >
                <X className="w-4 h-4" />
              </button>

              {status === 'success' ? (
                <ModalSuccess plan={data?.plan} onClose={onClose} />
              ) : (
                <>
                  <div className="contact-modal__header">
                    <h2>Обсудить сайт</h2>
                    {data?.plan && (
                      <p className="contact-modal__plan">
                        Тариф: <span>{data.plan}</span>
                        {promoPrice && <b>{promoPrice}</b>}
                      </p>
                    )}
                    {!data?.plan && promoActive && (
                      <p className="contact-modal__plan">
                        Промокод: <span>NEON-15</span>
                        <b>−{formatPrice(PROMO_DISCOUNT)}</b>
                      </p>
                    )}
                  </div>

                  <div className="contact-modal__quick">
                    <span><Check className="w-4 h-4" /> Ответ в течение дня</span>
                    <span><Check className="w-4 h-4" /> Достаточно имени и телефона</span>
                    <span><Check className="w-4 h-4" /> Без обязательного брифа</span>
                  </div>

                  <PromoInModal rawPrice={data?.rawPrice} />

                  <form onSubmit={handleSubmit} className="contact-modal__form">
                    <div className="contact-modal__field">
                      <label htmlFor="cm-name">Имя *</label>
                      <input
                        id="cm-name"
                        type="text"
                        value={fields.name}
                        onChange={update('name')}
                        placeholder="Как вас зовут?"
                        required
                        maxLength={120}
                        autoComplete="name"
                      />
                    </div>
                    <div className="contact-modal__field">
                      <label htmlFor="cm-contact">Telegram или телефон *</label>
                      <input
                        id="cm-contact"
                        type="text"
                        value={fields.contact}
                        onChange={update('contact')}
                        placeholder="@username или +7..."
                        required
                        maxLength={180}
                      />
                    </div>
                    <div className="contact-modal__field">
                      <label htmlFor="cm-message">Комментарий</label>
                      <textarea
                        id="cm-message"
                        value={fields.message}
                        onChange={update('message')}
                        placeholder="Можно коротко: чем занимаетесь и какой сайт нужен."
                        maxLength={3000}
                        rows={3}
                      />
                    </div>

                    {status === 'error' && (
                      <p className="contact-modal__error">{errorMsg}</p>
                    )}

                    <button
                      type="submit"
                      className="contact-modal__submit"
                      disabled={status === 'sending'}
                    >
                      {status === 'sending' ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> Отправляю...</>
                      ) : (
                        <><Send className="w-5 h-5" /> Отправить заявку</>
                      )}
                    </button>

                    <p className="contact-modal__legal">
                      Нажимая «Отправить», вы соглашаетесь с{' '}
                      <a href="/privacy.html" target="_blank" rel="noopener noreferrer">Политикой конфиденциальности</a>.
                    </p>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function FloatingDiscuss({ openModal }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.pageYOffset > 420);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={() => openModal()}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.25 }}
          aria-label="Обсудить проект"
          className="floating-discuss-btn"
        >
          <span className="floating-discuss-btn__dot" aria-hidden="true" />
          <strong>Обсудить проект</strong>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.pageYOffset > 300);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-5 md:bottom-8 md:right-8 z-50 p-4 bg-cyber-neon text-white rounded-full shadow-[0_8px_24px_rgba(37,99,235,0.35)] hover:bg-blue-700 transition-all duration-300 group"
          aria-label="Наверх"
        >
          <ArrowUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform duration-300" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!safeStorageGet(COOKIE_CONSENT_KEY));
  }, []);

  const accept = (value) => {
    safeStorageSet(COOKIE_CONSENT_KEY, value);
    trackGoal('cookie_choice', { choice: value });
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="cookie-banner"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 18 }}
          transition={{ duration: 0.25 }}
          role="region"
          aria-label="Cookie и аналитика"
        >
          <div>
            <strong>Cookie и аналитика</strong>
            <p>
              Сайт использует cookie для работы интерфейса, статистики и улучшения качества.
              Подробнее — <a href="/cookies.html">в политике cookies</a>.
            </p>
          </div>
          <div className="cookie-banner__actions">
            <button type="button" className="cookie-banner__secondary" onClick={() => accept('necessary')}>
              Только нужные
            </button>
            <button type="button" onClick={() => accept('all')}>
              Принять
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function App() {
  const [modalData, setModalData] = useState(null);
  const openModal = (plan = '', price = '', rawPrice = null) => {
    trackGoal('lead_open', { plan: plan || 'Не указан', price: price || 'Не указана' });
    setModalData({ plan, price, rawPrice });
  };
  const closeModal = () => setModalData(null);

  return (
    <main className="relative min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white font-body">
      <Header openModal={openModal} />
      <Hero openModal={openModal} />
      <Stats />
      <Services openModal={openModal} />
      <Portfolio openModal={openModal} />
      <LiveProjects openModal={openModal} />
      <Testimonials />
      <Workflow openModal={openModal} />
      <Terms />
      <FAQ />
      <LandingBonus openModal={openModal} />
      <ContactSection />
      <Footer />
      <FloatingDiscuss openModal={openModal} />
      <FloatingPromo openModal={openModal} />
      <BackToTop />
      <CookieBanner />
      <ContactModal data={modalData} onClose={closeModal} />
    </main>
  );
}
