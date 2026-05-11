import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowUp,
  Check,
  Code2,
  CreditCard,
  Eye,
  FileText,
  Layers3,
  Menu,
  MessageCircle,
  MonitorSmartphone,
  Rocket,
  ShieldCheck,
  Timer,
  X,
  XCircle,
  Zap
} from 'lucide-react';
import { portfolio, pricingTiers, workflow } from './data.js';

const navItems = [
  ['Тарифы', '#services'],
  ['Портфолио', '#portfolio'],
  ['Процесс', '#workflow'],
  ['Условия', '#terms'],
  ['Контакт', '#contact']
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

const PROMO_DURATION_MS = 5 * 60 * 1000;
const PROMO_STORAGE_KEY = 'neonPromoExpiresAt';
const PROMO_EVENT = 'neon-promo-activated';

function scrollToId(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

function formatPromoTime(ms) {
  const safeMs = Math.max(0, ms);
  const minutes = Math.floor(safeMs / 60000);
  const seconds = Math.floor((safeMs % 60000) / 1000);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function activatePromoCode() {
  const nextExpiresAt = Date.now() + PROMO_DURATION_MS;
  window.localStorage.setItem(PROMO_STORAGE_KEY, String(nextExpiresAt));
  window.dispatchEvent(new CustomEvent(PROMO_EVENT, { detail: { expiresAt: nextExpiresAt } }));
  return nextExpiresAt;
}

function PromoAnchor() {
  const [expiresAt, setExpiresAt] = useState(null);
  const [remaining, setRemaining] = useState(PROMO_DURATION_MS);

  useEffect(() => {
    const stored = Number(window.localStorage.getItem(PROMO_STORAGE_KEY));
    if (stored > Date.now()) {
      setExpiresAt(stored);
      setRemaining(stored - Date.now());
    }

    const onPromoActivated = (event) => {
      const nextExpiresAt = event.detail?.expiresAt;
      if (nextExpiresAt) {
        setExpiresAt(nextExpiresAt);
        setRemaining(nextExpiresAt - Date.now());
      }
    };

    window.addEventListener(PROMO_EVENT, onPromoActivated);
    return () => window.removeEventListener(PROMO_EVENT, onPromoActivated);
  }, []);

  useEffect(() => {
    if (!expiresAt) return undefined;

    const tick = () => {
      const nextRemaining = expiresAt - Date.now();
      if (nextRemaining <= 0) {
        window.localStorage.removeItem(PROMO_STORAGE_KEY);
        setExpiresAt(null);
        setRemaining(PROMO_DURATION_MS);
        return;
      }
      setRemaining(nextRemaining);
    };

    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [expiresAt]);

  const active = Boolean(expiresAt);

  const activatePromo = () => {
    const nextExpiresAt = activatePromoCode();
    setExpiresAt(nextExpiresAt);
    setRemaining(PROMO_DURATION_MS);
  };

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
        <small>на запуск сайта под ключ</small>
      </div>
      <div className="promo-anchor__timer">
        <Timer className="w-4 h-4" />
        <span>{active ? 'бронь активна' : 'активация на 5 минут'}</span>
        <b>{formatPromoTime(remaining)}</b>
      </div>
      <a
        href="#contact"
        onClick={activatePromo}
        data-plan="Промокод NEON-15"
        data-price="скидка 15 000 ₽"
        className="promo-anchor__cta"
      >
        {active ? 'Забрать скидку' : 'Активировать'}
        <ArrowRight className="w-4 h-4" />
      </a>
    </motion.aside>
  );
}

function FloatingPromo() {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.pageYOffset > 520);
    const stored = Number(window.localStorage.getItem(PROMO_STORAGE_KEY));
    setActive(stored > Date.now());
    window.addEventListener('scroll', onScroll);
    onScroll();

    const onPromoActivated = () => setActive(true);
    window.addEventListener(PROMO_EVENT, onPromoActivated);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener(PROMO_EVENT, onPromoActivated);
    };
  }, []);

  const handleClick = () => {
    activatePromoCode();
    setActive(true);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href="#contact"
          onClick={handleClick}
          initial={{ opacity: 0, x: 18, scale: 0.88 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 18, scale: 0.88 }}
          className={`floating-promo ${active ? 'floating-promo--active' : ''}`}
          data-plan="Промокод NEON-15"
          data-price="скидка 15 000 ₽"
          aria-label="Активировать промокод NEON-15 на скидку 15 000 рублей"
        >
          <span className="floating-promo__icon">
            <Zap className="w-4 h-4" />
          </span>
          <span className="floating-promo__copy">
            <b>{active ? 'NEON-15' : '-15K'}</b>
            <small>{active ? 'активен' : 'промо'}</small>
          </span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-cyber-bg/95 backdrop-blur-xl border-b border-white/5 py-4' : 'bg-transparent py-8'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <button onClick={() => scrollToId('hero')} className="flex items-center gap-3 group" aria-label="Наверх">
          <div className="w-12 h-12 flex items-center justify-center border border-cyber-neon/50 bg-cyber-neon/10 rounded-sm group-hover:shadow-neon transition-all duration-300">
            <Zap className="text-cyber-neon w-6 h-6" />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-header font-black text-xl leading-none tracking-wide text-white">NEON</span>
            <span className="font-sub text-xs font-bold tracking-[0.2em] text-cyber-cyan mt-1">DESIGN</span>
          </div>
        </button>

        <div className="hidden md:flex items-center gap-10">
          {navItems.map(([label, href]) => (
            <a key={href} href={href} className="font-sub text-xs font-bold tracking-widest text-gray-300 hover:text-white transition-colors relative group py-2">
              {label}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-cyber-neon group-hover:w-full transition-all duration-300" />
            </a>
          ))}
          <button onClick={() => scrollToId('contact')} className="ml-6 px-8 py-3 border border-cyber-neon text-cyber-neon font-header font-bold tracking-wider text-sm hover:bg-cyber-neon hover:text-white hover:shadow-neon transition-all duration-300 uppercase">
            Обсудить проект
          </button>
        </div>

        <button className="md:hidden text-white p-2" onClick={() => setOpen(!open)} aria-label="Открыть меню">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="absolute top-full left-0 w-full bg-cyber-dark border-b border-white/10 md:hidden flex flex-col p-8 gap-8 shadow-2xl">
            {navItems.map(([label, href]) => (
              <a key={href} href={href} onClick={() => setOpen(false)} className="font-header font-bold text-xl text-white hover:text-cyber-neon transition-colors tracking-wide">
                {label}
              </a>
            ))}
            <button
              onClick={() => {
                setOpen(false);
                scrollToId('contact');
              }}
              className="w-full py-4 bg-cyber-neon text-white font-bold uppercase tracking-widest"
            >
              Обсудить проект
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function Hero() {
  return (
    <section id="hero" className="min-h-screen flex flex-col justify-center relative pt-20 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(157,111,255,0.16),transparent_32%),linear-gradient(245deg,rgba(0,255,209,0.12),transparent_30%)]" />
      <div className="absolute inset-0 hero-grid opacity-35" />
      <div className="absolute inset-0 hero-scan opacity-20" />
      <div className="absolute -top-20 right-0 w-[58vw] h-[120vh] bg-[linear-gradient(135deg,rgba(0,255,209,0.14),rgba(157,111,255,0.08)_42%,transparent_43%)] skew-x-[-14deg] opacity-80" />
      <div className="absolute top-24 right-[-6rem] hidden lg:block font-header font-black text-[12rem] xl:text-[17rem] leading-none text-white/[0.035] uppercase select-none">
        NEON
      </div>
      <div className="absolute bottom-16 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyber-cyan/35 to-transparent" />
      <div className="absolute top-[38%] right-10 hidden xl:block w-[360px]">
        <PromoAnchor />
      </div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="absolute top-0 left-6 w-[1px] h-32 bg-gradient-to-b from-cyber-neon to-transparent opacity-50 hidden md:block" />
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="flex items-center gap-4 mb-8">
          <div className="h-[2px] w-16 bg-cyber-cyan shadow-cyan" />
          <span className="font-sub font-bold text-cyber-cyan tracking-[0.3em] text-sm uppercase">Веб-разработка для бизнеса</span>
        </motion.div>

        <div className="relative mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-header font-black text-4xl md:text-8xl lg:text-9xl leading-[0.95] text-white uppercase tracking-normal"
          >
            РАЗРАБОТКА{' '}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 relative z-20">
              САЙТОВ ДЛЯ БИЗНЕСА
            </span>
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="mt-8 inline-flex flex-wrap items-center gap-3 border border-cyber-cyan/35 bg-cyber-cyan/10 px-5 py-3 font-sub text-sm md:text-base font-bold uppercase tracking-[0.14em] text-white shadow-cyan"
          >
            <span className="text-cyber-cyan">от 45 000 ₽</span>
            <span className="text-white/45">/</span>
            <span>фикс, без скрытых доплат</span>
          </motion.div>
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, delay: 0.8 }} className="absolute -bottom-6 left-0 w-2/3 md:w-1/2 h-2 bg-cyber-neon shadow-neon origin-left" />
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1 }} className="flex flex-col md:flex-row justify-between items-start md:items-end mt-16 gap-10">
          <div className="max-w-xl">
            <h2 className="font-sub font-light text-2xl md:text-3xl text-white mb-6 tracking-wide">
              САЙТ ПОД КЛЮЧ <span className="text-cyber-neon font-bold border-b border-cyber-neon">ЗА 14 ДНЕЙ</span>
            </h2>
            <p className="font-body text-cyber-text text-lg font-light leading-relaxed border-l-4 border-cyber-dark pl-6">
              Чистый код, без конструкторов, с адаптивом, заявками и настройкой аналитики. Детали уточним в переписке, а на старте сразу понятно по срокам и бюджету.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-6 w-full md:w-auto">
            <a href="#contact" className="px-7 md:px-8 py-4 bg-cyber-neon text-white font-header font-bold tracking-wider uppercase text-sm md:text-base hover:bg-white hover:text-cyber-bg transition-all duration-300 shadow-neon hover:shadow-none text-center">
              Получить консультацию
            </a>
            <a href="#workflow" className="px-7 md:px-8 py-4 border border-white/20 text-white font-sub font-bold tracking-wider uppercase text-xs md:text-sm hover:border-cyber-cyan hover:text-cyber-cyan transition-all duration-300 flex items-center justify-center bg-cyber-dark/50 backdrop-blur-sm">
              Как я работаю
            </a>
          </div>
        </motion.div>
        <div className="mt-8 xl:hidden">
          <PromoAnchor />
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="pricing-lab py-24 md:py-32 relative border-t border-white/5 bg-[#070613] overflow-hidden">
      <div className="pricing-noise absolute inset-0 pointer-events-none opacity-70" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyber-cyan/50 to-transparent" />
      <div className="container mx-auto px-5 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16 items-end mb-12 md:mb-16">
          <div>
            <span className="inline-flex items-center gap-3 text-cyber-cyan font-sub text-xs tracking-[0.28em] uppercase font-bold">
              <span className="w-2 h-2 bg-cyber-cyan shadow-cyan" />
              Тарифная сетка
            </span>
            <h2 className="font-header font-black text-4xl sm:text-5xl md:text-7xl text-white mt-4 uppercase leading-[0.92] tracking-normal">
              ВЫБЕРИ <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-white to-cyber-pink">ФОРМАТ САЙТА</span>
            </h2>
          </div>
          <div className="pricing-brief">
            <div className="pricing-brief__bar">
              <span />
              <span />
              <span />
              <b>pricing.board / 2026</b>
            </div>
            <p>
              Не три одинаковые карточки, а три разных сценария запуска: промо для старта, лендинг под заявки и сайт компании под несколько услуг.
            </p>
            <div className="pricing-brief__meta">
              <span>no shop</span>
              <span>no heavy integrations</span>
              <span>clean deploy</span>
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
                        <h3 className="font-header font-black text-2xl md:text-3xl text-white uppercase leading-none">{tier.name}</h3>
                        {tier.featured && <span className="pricing-thread__badge">Оптимальный</span>}
                      </div>
                      <p className={`mt-2 font-sub text-xs uppercase tracking-[0.22em] ${accent.text}`}>{tier.title}</p>
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
                    <a
                      href="#contact"
                      className={`pricing-thread__cta ${accent.text}`}
                      data-open-modal
                      data-plan={tier.title}
                      data-price={tier.price}
                    >
                      Обсудить <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
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

function Portfolio() {
  const [active, setActive] = useState(null);

  return (
    <section id="portfolio" className="py-24 bg-[#05050e] relative">
      <div className="absolute top-10 right-0 font-header font-black text-[10rem] md:text-[20rem] text-white/5 leading-none select-none -z-1 overflow-hidden whitespace-nowrap">REAL</div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-20 pt-10">
          <span className="text-cyber-pink font-sub text-sm tracking-[0.3em] uppercase font-bold">Портфолио</span>
          <h2 className="font-header font-black text-4xl md:text-6xl text-white uppercase mt-2">
            ПРИМЕРЫ <span className="text-cyber-pink">РАБОТ</span>
          </h2>
          <p className="mt-4 text-gray-400 max-w-2xl font-light">
            Реальные кейсы для бизнеса. От автосервиса до IT-компании. Функциональность, скорость и стиль.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {portfolio.map((project) => (
            <button key={project.id} onClick={() => setActive(project)} className="group relative bg-[#0A091A] border border-white/10 overflow-hidden hover:border-white/20 transition-colors duration-500 cursor-pointer text-left">
              <div className="relative h-72 overflow-hidden">
                <div className="absolute inset-0 bg-cyber-dark/40 group-hover:bg-transparent transition-colors duration-500 z-10" />
                <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover transition-all duration-700 transform group-hover:scale-105" />
                <div className="absolute top-4 left-4 z-20">
                  <span className="px-4 py-1 bg-cyber-bg/90 border border-cyber-cyan text-cyber-cyan text-xs font-sub font-bold tracking-widest uppercase backdrop-blur-md shadow-lg">{project.category}</span>
                </div>
                <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-[2px]">
                  <div className="w-16 h-16 rounded-full border border-white/50 flex items-center justify-center bg-cyber-bg/50 text-white transform scale-75 group-hover:scale-100 transition-transform duration-300">
                    <Eye className="w-8 h-8" />
                  </div>
                </div>
              </div>
              <div className="p-8 relative">
                <h3 className="font-header font-bold text-3xl text-white mb-3 uppercase tracking-wide group-hover:text-cyber-neon transition-colors duration-300">{project.title}</h3>
                <p className="font-body text-gray-400 font-light text-sm mb-8 leading-relaxed min-h-[3rem] line-clamp-2">{project.description}</p>
                <div className="flex flex-wrap gap-3 pt-4 border-t border-white/5">
                  {project.techStack.map((tech) => (
                    <span key={tech} className="text-[11px] font-sub font-bold text-cyber-cyan/80 uppercase tracking-wider border border-white/5 px-2 py-1 rounded-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyber-pink via-cyber-neon to-cyber-cyan scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </button>
          ))}
        </div>

        <div className="mt-20 text-center">
          <button onClick={() => scrollToId('workflow')} className="px-12 py-5 border border-white/10 bg-white/5 backdrop-blur text-white font-header font-bold uppercase tracking-widest hover:bg-cyber-neon hover:border-cyber-neon transition-all duration-300">
            Хочу такой сайт
          </button>
        </div>
      </div>
      <ProjectModal project={active} onClose={() => setActive(null)} />
    </section>
  );
}

function ProjectModal({ project, onClose }) {
  useEffect(() => {
    if (!project) return undefined;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [project]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-[#0A091A] overflow-y-auto">
          <button onClick={onClose} className="fixed top-6 right-6 z-[110] w-12 h-12 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-cyber-neon hover:border-cyber-neon transition-all duration-300 group" aria-label="Закрыть проект">
            <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
          </button>
          <div className="relative h-[40vh] md:h-[80vh] w-full">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A091A]/50 to-[#0A091A] z-10" />
            <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
            <div className="absolute bottom-0 left-0 w-full z-20 p-6 md:p-12">
              <div className="container mx-auto">
                <motion.span initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="inline-block px-4 py-2 bg-cyber-neon/20 border border-cyber-neon text-cyber-neon font-sub font-bold tracking-widest text-xs uppercase mb-4 md:mb-6 backdrop-blur-md">
                  {project.category}
                </motion.span>
                <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="font-header font-black text-3xl md:text-8xl text-white uppercase leading-none mb-4">
                  {project.title}
                </motion.h1>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-6 py-16 md:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-4 space-y-8">
                <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="bg-cyber-dark/50 p-8 border border-white/5 backdrop-blur-sm">
                  <h3 className="font-header font-bold text-xl text-white mb-6 uppercase border-b border-white/10 pb-4">Детали</h3>
                  <div className="space-y-6">
                    <Detail icon={Timer} label="Год" value={project.year || '2026'} />
                    <Detail icon={ShieldCheck} label="Клиент" value={project.client || project.title} />
                    <div className="flex items-start gap-4">
                      <Code2 className="text-cyber-neon w-5 h-5 mt-1" />
                      <div>
                        <span className="block text-gray-400 text-xs uppercase tracking-wider">Технологии</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {project.techStack.map((tech) => (
                            <span key={tech} className="text-xs text-white/80 bg-white/5 px-2 py-1 rounded-sm">{tech}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  onClick={() => {
                    onClose();
                    setTimeout(() => scrollToId('contact'), 100);
                  }}
                  className="w-full py-4 bg-white text-cyber-bg font-header font-bold uppercase tracking-widest hover:bg-cyber-neon hover:text-white transition-colors flex items-center justify-center gap-2"
                >
                  Обсудить проект <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>

              <div className="lg:col-span-8">
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="prose prose-invert prose-lg max-w-none">
                  <ProjectText number="01." title="ЗАДАЧА" color="text-cyber-pink" text={project.challenge} />
                  <ProjectText number="02." title="РЕШЕНИЕ" color="text-cyber-neon" text={project.solution} />
                  <ProjectText number="03." title="РЕЗУЛЬТАТ" color="text-cyber-cyan" text={project.result} />
                </motion.div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                  {project.additionalImages.map((image, index) => (
                    <motion.div key={image} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 * index }} className="relative h-64 md:h-80 overflow-hidden rounded-sm group">
                      <img src={image} alt={`${project.title} detail`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-cyber-neon/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-overlay" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Detail({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-4">
      <Icon className="text-cyber-cyan w-5 h-5 mt-1" />
      <div>
        <span className="block text-gray-400 text-xs uppercase tracking-wider">{label}</span>
        <span className="text-white font-sub font-bold">{value}</span>
      </div>
    </div>
  );
}

function ProjectText({ number, title, color, text }) {
  return (
    <div className="mb-12">
      <h3 className="font-header font-bold text-3xl text-white mb-4 flex items-center gap-3">
        <span className={color}>{number}</span> {title}
      </h3>
      <p className={`font-body text-gray-300 font-light leading-relaxed text-lg ${number === '03.' ? 'border-l-4 border-cyber-cyan pl-6 py-2 bg-cyber-cyan/5' : ''}`}>{text}</p>
    </div>
  );
}

function Workflow() {
  const icons = [MessageCircle, Zap, Rocket];

  return (
    <section id="workflow" className="py-24 bg-cyber-bg relative overflow-hidden border-t border-white/5">
      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-20 text-center max-w-3xl mx-auto">
          <span className="text-cyber-cyan font-sub text-sm tracking-[0.3em] uppercase font-bold">Процесс</span>
          <h2 className="font-header font-black text-4xl md:text-6xl text-white mt-4 uppercase leading-tight">
            ОТ ИДЕИ ДО САЙТА ЗА <span className="text-cyber-neon relative inline-block">2 ДНЯ</span>
          </h2>
          <p className="mt-6 text-gray-400 font-light">Мы не тратим недели на бесконечные согласования. Современные технологии дают быстрый результат.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 relative">
          <div className="hidden md:block absolute top-12 left-0 w-full h-[2px] bg-gradient-to-r from-cyber-pink via-cyber-neon to-cyber-cyan opacity-30" />
          {workflow.map((step, index) => {
            const Icon = icons[index];
            const color = index === 0 ? 'text-cyber-pink' : index === 1 ? 'text-cyber-neon' : 'text-cyber-cyan';
            return (
              <div key={step.title} className="relative z-10 flex flex-col items-center text-center group">
                <div className="w-24 h-24 rounded-full bg-[#0A091A] border-2 border-white/10 flex items-center justify-center mb-6 group-hover:border-white/40 transition-colors shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                  <Icon className={`w-10 h-10 ${color}`} />
                </div>
                <div className="bg-cyber-dark/50 p-6 border border-white/5 rounded-sm w-full hover:bg-cyber-dark hover:border-white/20 transition-all duration-300">
                  <h3 className="font-header font-bold text-2xl text-white mb-3">{step.title}</h3>
                  <p className="font-body text-sm text-gray-400 leading-relaxed">{step.text}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-white/10 rounded-lg overflow-hidden">
          <div className="bg-[#1a1a2e] p-10 md:p-16 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-red-500/50" />
            <h3 className="font-header font-bold text-2xl text-gray-400 mb-6 flex items-center gap-3">
              <XCircle className="text-red-500" /> ОБЫЧНЫЙ ПОДХОД
            </h3>
            <ul className="space-y-4 font-body text-gray-500 text-sm">
              <li className="flex items-start gap-3"><XCircle className="w-5 h-5 shrink-0 mt-0.5" /><span>Долгая разработка (7-14 дней)</span></li>
              <li className="flex items-start gap-3"><XCircle className="w-5 h-5 shrink-0 mt-0.5" /><span>Медленные конструкторы (Tilda, WordPress)</span></li>
              <li className="flex items-start gap-3"><span>✖</span><span>Переплата за менеджмент и лишние созвоны</span></li>
            </ul>
          </div>
          <div className="bg-cyber-dark p-10 md:p-16 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-cyber-cyan" />
            <h3 className="font-header font-bold text-2xl text-white mb-6 flex items-center gap-3">
              <Zap className="text-cyber-cyan" /> МОЙ ПОДХОД
            </h3>
            <ul className="space-y-4 font-body text-gray-300 text-sm font-medium">
              <li className="flex items-start gap-3 text-white"><Check className="w-5 h-5 shrink-0 mt-0.5 text-cyber-cyan" /><span>Готовый сайт за <span className="text-cyber-cyan">48 часов</span></span></li>
              <li className="flex items-start gap-3 text-white"><Check className="w-5 h-5 shrink-0 mt-0.5 text-cyber-cyan" /><span>Чистый код. Мгновенная загрузка.</span></li>
              <li className="flex items-start gap-3 text-white"><span className="text-cyber-cyan">✔</span><span>Прямая связь с разработчиком.</span></li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Terms() {
  return (
    <section id="terms" className="py-24 bg-[#090816] border-t border-white/5 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-16">
          <span className="text-cyber-pink font-sub text-sm tracking-[0.3em] uppercase font-bold">Договор</span>
          <h2 className="font-header font-black text-4xl md:text-6xl text-white mt-2 uppercase leading-tight">
            УСЛОВИЯ <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-pink to-cyber-neon">РАБОТЫ</span>
          </h2>
          <p className="mt-4 text-gray-400 max-w-2xl font-light">Прозрачные правила для комфортного сотрудничества. Мы ценим время друг друга.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <TermCard icon={CreditCard} color="text-cyber-cyan" title="ОПЛАТА 50/50">
            <p>Работаю официально через <span className="text-white font-bold">ЮКассу</span>.</p>
            <ul className="space-y-2">
              <li>50% предоплата для старта.</li>
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
    <div className={`group bg-cyber-dark/40 p-8 border border-white/5 hover:border-white/20 transition-all duration-300 relative overflow-hidden`}>
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Icon className={`w-24 h-24 ${color}`} />
      </div>
      <div className={`w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center rounded-sm mb-6`}>
        <Icon className={`${color} w-6 h-6`} />
      </div>
      <h3 className={`font-header font-bold text-xl text-white mb-4 uppercase tracking-wide ${color}`}>{title}</h3>
      <div className="font-body text-gray-400 text-sm leading-relaxed space-y-4">{children}</div>
    </div>
  );
}

function Footer() {
  return (
    <footer id="contact" className="py-24 bg-cyber-dark border-t border-white/5 relative overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-64 bg-cyber-neon opacity-5 filter blur-[150px] pointer-events-none" />
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center mb-16">
          <span className="text-cyber-cyan font-sub text-sm tracking-[0.4em] uppercase font-bold mb-4 animate-pulse">На связи</span>
          <h2 className="font-header font-black text-5xl md:text-7xl text-white uppercase leading-none mb-8">
            ГОТОВЫ <span className="text-outline-white hover:text-cyber-neon transition-colors duration-300 cursor-default">НАЧАТЬ?</span>
          </h2>
          <p className="font-body text-cyber-text font-light max-w-xl mb-10">
            Пишите в Telegram. Обсудим задачу, и я приступлю к работе уже сегодня. Без брифов на 10 страниц и бюрократии.
          </p>
          <a href="https://t.me/Rambajo" target="_blank" rel="noopener noreferrer" className="group relative inline-flex items-center gap-4 px-10 py-5 bg-[#229ED9] hover:bg-[#1e8bbd] text-white overflow-hidden transition-all duration-300 shadow-[0_0_20px_rgba(34,158,217,0.3)] hover:shadow-[0_0_30px_rgba(34,158,217,0.6)] rounded-sm">
            <MessageCircle className="w-5 h-5 relative z-10 -ml-1" />
            <span className="font-header font-bold tracking-widest text-lg uppercase relative z-10">Telegram</span>
          </a>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-white/10">
          <span className="font-header font-bold text-2xl text-white">NEON<span className="text-cyber-neon">DEV</span></span>
          <span className="text-gray-500 font-sub text-xs tracking-wider">© 2026 NEON DEV. DIGITAL PRODUCTION.</span>
        </div>
      </div>
    </footer>
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
          className="fixed bottom-6 right-5 md:bottom-8 md:right-8 z-50 p-4 bg-cyber-neon text-white rounded-full shadow-[0_0_20px_rgba(157,111,255,0.5)] hover:bg-white hover:text-cyber-neon transition-all duration-300 group"
          aria-label="Наверх"
        >
          <ArrowUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform duration-300" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <main className="relative min-h-screen text-white selection:bg-cyber-neon selection:text-white font-body">
      <Header />
      <Hero />
      <Services />
      <Portfolio />
      <Workflow />
      <Terms />
      <Footer />
      <FloatingPromo />
      <BackToTop />
    </main>
  );
}
