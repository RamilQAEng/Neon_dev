import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowUp,
  Check,
  Code2,
  CreditCard,
  Eye,
  Menu,
  MessageCircle,
  Rocket,
  ShieldCheck,
  Sparkles,
  Timer,
  X,
  XCircle,
  Zap
} from 'lucide-react';
import { portfolio, services, workflow } from './data.js';

const navItems = [
  ['Услуги', 'services'],
  ['Портфолио', 'portfolio'],
  ['Процесс', 'workflow'],
  ['Условия', 'terms'],
  ['Контакт', 'contact']
];

function scrollToId(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-cyber-bg/80 backdrop-blur-xl">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <button onClick={() => scrollToId('hero')} className="font-header font-black text-2xl tracking-wide">
          CYBER<span className="text-cyber-neon">.</span>
        </button>

        <nav className="hidden md:flex items-center gap-8 text-xs font-sub uppercase tracking-[0.25em] text-gray-300">
          {navItems.map(([label, id]) => (
            <button key={id} onClick={() => scrollToId(id)} className="hover:text-cyber-cyan transition-colors">
              {label}
            </button>
          ))}
        </nav>

        <button
          onClick={() => setOpen(true)}
          className="md:hidden p-3 border border-white/10 text-white"
          aria-label="Открыть меню"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 min-h-screen bg-cyber-bg z-50 p-6 md:hidden"
          >
            <div className="flex items-center justify-between h-16">
              <span className="font-header font-black text-2xl">CYBER<span className="text-cyber-neon">.</span></span>
              <button onClick={() => setOpen(false)} className="p-3 border border-white/10" aria-label="Закрыть меню">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="pt-12 space-y-6">
              {navItems.map(([label, id]) => (
                <button
                  key={id}
                  onClick={() => {
                    setOpen(false);
                    setTimeout(() => scrollToId(id), 100);
                  }}
                  className="block text-left font-header text-4xl font-black uppercase text-white"
                >
                  {label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function Hero() {
  return (
    <section id="hero" className="min-h-screen pt-32 pb-20 bg-cyber-bg relative overflow-hidden flex items-center">
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_20%,rgba(157,111,255,0.3),transparent_30%),radial-gradient(circle_at_80%_70%,rgba(0,255,209,0.18),transparent_28%)]" />
      <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 text-cyber-cyan font-sub text-sm tracking-[0.3em] uppercase font-bold mb-6"
          >
            <Sparkles className="w-4 h-4" /> Быстрые сайты на чистом коде
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-header font-black text-5xl sm:text-7xl lg:text-8xl uppercase leading-[0.9] text-white"
          >
            CYBER<span className="text-cyber-neon">PULSE</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 max-w-2xl text-lg text-gray-300 font-light leading-relaxed"
          >
            Разрабатываю современные лендинги и сайты для бизнеса в темном неоновом стиле: быстро, адаптивно, без конструкторов и лишней бюрократии.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row gap-4"
          >
            <button onClick={() => scrollToId('contact')} className="px-8 py-5 bg-cyber-neon text-white font-header font-bold uppercase tracking-widest hover:bg-white hover:text-cyber-bg transition-colors flex items-center justify-center gap-3">
              Обсудить проект <ArrowRight className="w-5 h-5" />
            </button>
            <button onClick={() => scrollToId('portfolio')} className="px-8 py-5 border border-white/15 text-white font-header font-bold uppercase tracking-widest hover:border-cyber-cyan hover:text-cyber-cyan transition-colors">
              Смотреть работы
            </button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-5 relative"
        >
          <div className="border border-white/10 bg-cyber-dark/70 p-5 shadow-neon">
            <img src="/img/nerix.png" alt="Пример сайта CyberPulse" className="w-full aspect-[4/3] object-cover" />
            <div className="grid grid-cols-3 gap-3 mt-4">
              <Stat value="48ч" label="старт" />
              <Stat value="100%" label="адаптив" />
              <Stat value="React" label="стек" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Stat({ value, label }) {
  return (
    <div className="bg-white/5 border border-white/10 p-4">
      <div className="font-header font-black text-xl text-cyber-cyan">{value}</div>
      <div className="font-sub text-[10px] uppercase tracking-[0.2em] text-gray-500 mt-1">{label}</div>
    </div>
  );
}

function Services() {
  return (
    <section id="services" className="py-24 bg-[#090816] border-t border-white/5">
      <div className="container mx-auto px-6">
        <SectionTitle kicker="Направления" title="ЧТО МОЖНО ДОРАБОТАТЬ" accent="СЕЙЧАС" />
        <div className="grid md:grid-cols-3 gap-6 mt-14">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="bg-cyber-dark/50 border border-white/10 p-8 hover:border-cyber-neon/60 transition-colors"
            >
              <Code2 className="w-9 h-9 text-cyber-cyan mb-8" />
              <h3 className="font-header text-2xl font-bold uppercase text-white">{service.title}</h3>
              <div className="mt-3 text-cyber-pink font-header font-bold">{service.price}</div>
              <p className="mt-5 text-sm text-gray-400 leading-relaxed">{service.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionTitle({ kicker, title, accent }) {
  return (
    <div className="max-w-4xl">
      <span className="text-cyber-pink font-sub text-sm tracking-[0.3em] uppercase font-bold">{kicker}</span>
      <h2 className="font-header font-black text-4xl md:text-6xl text-white uppercase mt-3 leading-tight">
        {title} <span className="text-cyber-neon">{accent}</span>
      </h2>
    </div>
  );
}

function Portfolio() {
  const [active, setActive] = useState(null);

  return (
    <section id="portfolio" className="py-24 bg-[#05050e] relative overflow-hidden">
      <div className="absolute top-10 right-0 font-header font-black text-[10rem] md:text-[20rem] text-white/5 leading-none select-none">REAL</div>
      <div className="container mx-auto px-6 relative z-10">
        <SectionTitle kicker="Портфолио" title="ПРИМЕРЫ" accent="РАБОТ" />
        <p className="mt-5 text-gray-400 max-w-2xl font-light">
          Карточки вынесены в `src/data.js`: можно добавлять новые проекты, менять тексты и картинки без копания в минифицированном файле.
        </p>
        <div className="grid md:grid-cols-2 gap-10 mt-14">
          {portfolio.map((project) => (
            <button key={project.id} onClick={() => setActive(project)} className="group text-left bg-cyber-bg border border-white/10 overflow-hidden hover:border-white/25 transition-colors">
              <div className="relative h-72 overflow-hidden">
                <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-4 left-4 px-4 py-1 bg-cyber-bg/90 border border-cyber-cyan text-cyber-cyan text-xs font-sub font-bold tracking-widest uppercase">
                  {project.category}
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/25 backdrop-blur-[2px]">
                  <span className="w-16 h-16 rounded-full border border-white/50 flex items-center justify-center bg-cyber-bg/60">
                    <Eye className="w-8 h-8" />
                  </span>
                </div>
              </div>
              <div className="p-8">
                <h3 className="font-header font-bold text-3xl text-white uppercase group-hover:text-cyber-neon transition-colors">{project.title}</h3>
                <p className="mt-4 text-sm text-gray-400 leading-relaxed min-h-12">{project.description}</p>
                <div className="flex flex-wrap gap-3 pt-6 mt-6 border-t border-white/5">
                  {project.techStack.map((tech) => (
                    <span key={tech} className="text-[11px] font-sub font-bold text-cyber-cyan/80 uppercase tracking-wider border border-white/5 px-2 py-1">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      <ProjectModal project={active} onClose={() => setActive(null)} />
    </section>
  );
}

function ProjectModal({ project, onClose }) {
  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-cyber-bg/95 backdrop-blur-xl overflow-y-auto"
        >
          <div className="container mx-auto px-6 py-8">
            <button onClick={onClose} className="fixed top-6 right-6 p-4 bg-white text-cyber-bg hover:bg-cyber-neon hover:text-white transition-colors z-10" aria-label="Закрыть проект">
              <X className="w-6 h-6" />
            </button>
            <div className="grid lg:grid-cols-12 gap-10 pt-14">
              <div className="lg:col-span-4">
                <img src={project.imageUrl} alt={project.title} className="w-full aspect-[4/3] object-cover border border-white/10" />
                <h2 className="mt-8 font-header font-black text-4xl text-white uppercase">{project.title}</h2>
                <p className="mt-4 text-cyber-cyan uppercase tracking-widest text-xs font-bold">{project.category}</p>
                <button onClick={() => scrollToId('contact')} className="mt-8 w-full py-4 bg-white text-cyber-bg font-header font-bold uppercase tracking-widest hover:bg-cyber-neon hover:text-white transition-colors flex items-center justify-center gap-2">
                  Обсудить проект <ArrowRight className="w-5 h-5" />
                </button>
              </div>
              <div className="lg:col-span-8">
                <ProjectText number="01." title="ЗАДАЧА" color="text-cyber-pink" text={project.challenge} />
                <ProjectText number="02." title="РЕШЕНИЕ" color="text-cyber-neon" text={project.solution} />
                <ProjectText number="03." title="РЕЗУЛЬТАТ" color="text-cyber-cyan" text={project.result} />
                <div className="grid md:grid-cols-2 gap-6 mt-12">
                  {project.additionalImages.map((image) => (
                    <img key={image} src={image} alt={`${project.title} detail`} className="w-full h-72 object-cover border border-white/10" />
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

function ProjectText({ number, title, color, text }) {
  return (
    <div className="mb-12">
      <h3 className="font-header font-bold text-3xl text-white mb-4 flex items-center gap-3">
        <span className={color}>{number}</span> {title}
      </h3>
      <p className="text-gray-300 font-light leading-relaxed text-lg">{text}</p>
    </div>
  );
}

function Workflow() {
  const icons = [MessageCircle, Zap, Rocket];

  return (
    <section id="workflow" className="py-24 bg-cyber-bg border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-cyber-cyan font-sub text-sm tracking-[0.3em] uppercase font-bold">Процесс</span>
          <h2 className="font-header font-black text-4xl md:text-6xl text-white mt-4 uppercase leading-tight">
            ОТ ИДЕИ ДО САЙТА ЗА <span className="text-cyber-neon">2 ДНЯ</span>
          </h2>
          <p className="mt-6 text-gray-400 font-light">Сайт теперь можно дорабатывать через понятные компоненты и данные, не редактируя собранный JS-бандл.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {workflow.map((step, index) => {
            const Icon = icons[index];
            return (
              <div key={step.title} className="text-center">
                <div className="w-24 h-24 rounded-full mx-auto bg-[#0A091A] border-2 border-white/10 flex items-center justify-center mb-6">
                  <Icon className="w-10 h-10 text-cyber-cyan" />
                </div>
                <div className="bg-cyber-dark/50 p-6 border border-white/5">
                  <h3 className="font-header font-bold text-2xl text-white mb-3">{step.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{step.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Terms() {
  return (
    <section id="terms" className="py-24 bg-[#090816] border-t border-white/5">
      <div className="container mx-auto px-6">
        <SectionTitle kicker="Договор" title="УСЛОВИЯ" accent="РАБОТЫ" />
        <div className="grid md:grid-cols-3 gap-8 mt-14">
          <TermCard icon={CreditCard} color="text-cyber-cyan" title="ОПЛАТА 50/50">
            <p>Работаю официально через <strong className="text-white">ЮКассу</strong>.</p>
            <p>50% предоплата для старта, 50% перед передачей доступов.</p>
          </TermCard>
          <TermCard icon={XCircle} color="text-cyber-pink" title="ОТКАЗ И ВОЗВРАТ">
            <p className="border-l-2 border-cyber-pink pl-4 italic">"Предоплата бронирует время в моем графике."</p>
            <p>Если работа уже началась, предоплата не возвращается.</p>
          </TermCard>
          <TermCard icon={ShieldCheck} color="text-cyber-neon" title="ПРАВКИ">
            <p>Мелкие баги и правки исправляю бесплатно в течение 48 часов после сдачи.</p>
            <p>Новая логика или полная переделка оплачивается отдельно.</p>
          </TermCard>
        </div>
      </div>
    </section>
  );
}

function TermCard({ icon: Icon, color, title, children }) {
  return (
    <div className="bg-cyber-dark/40 p-8 border border-white/5 hover:border-white/20 transition-colors">
      <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center mb-6">
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <h3 className={`font-header font-bold text-xl text-white mb-4 uppercase tracking-wide ${color}`}>{title}</h3>
      <div className="space-y-4 text-sm text-gray-400 leading-relaxed">{children}</div>
    </div>
  );
}

function Footer() {
  return (
    <footer id="contact" className="py-24 bg-cyber-dark border-t border-white/5">
      <div className="container mx-auto px-6 text-center">
        <span className="text-cyber-cyan font-sub text-sm tracking-[0.4em] uppercase font-bold animate-pulse">На связи</span>
        <h2 className="font-header font-black text-5xl md:text-7xl text-white uppercase leading-none mt-4 mb-8">
          ГОТОВЫ <span className="text-outline-white">НАЧАТЬ?</span>
        </h2>
        <p className="text-cyber-text font-light max-w-xl mx-auto mb-10">
          Пишите в Telegram. Обсудим задачу, и я приступлю к работе уже сегодня.
        </p>
        <a href="https://t.me/Rambajo" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-4 px-10 py-5 bg-[#229ED9] hover:bg-[#1e8bbd] text-white transition-colors rounded-sm">
          <MessageCircle className="w-5 h-5" />
          <span className="font-header font-bold tracking-widest text-lg uppercase">Telegram</span>
        </a>
        <div className="mt-16 pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="font-header font-bold text-2xl text-white">CYBER<span className="text-cyber-neon">.</span></span>
          <span className="text-gray-500 font-sub text-xs tracking-wider">© 2026 CYBERPULSE. DIGITAL PRODUCTION.</span>
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
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.7 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 z-50 p-4 bg-cyber-neon text-white rounded-full shadow-neon hover:bg-white hover:text-cyber-neon transition-colors"
          aria-label="Наверх"
        >
          <ArrowUp className="w-6 h-6" />
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
      <BackToTop />
    </main>
  );
}
