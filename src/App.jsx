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
  Palette,
  Rocket,
  Shield,
  ShieldCheck,
  Timer,
  X,
  XCircle,
  Zap
} from 'lucide-react';
import { portfolio, services, workflow } from './data.js';

const navItems = [
  ['Услуги', '#services'],
  ['Портфолио', '#portfolio'],
  ['Процесс', '#workflow'],
  ['Условия', '#terms'],
  ['Контакт', '#contact']
];

const serviceIcons = {
  code: Code2,
  design: Palette,
  rocket: Rocket,
  shield: Shield
};

function scrollToId(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
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
            <span className="font-header font-black text-xl leading-none tracking-wide text-white">CYBER</span>
            <span className="font-sub text-xs font-bold tracking-[0.2em] text-cyber-cyan mt-1">PORTFOLIO</span>
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
      <div className="absolute top-1/2 right-10 hidden xl:block w-80 border border-white/10 bg-cyber-dark/25 backdrop-blur-sm p-5 text-xs font-sub text-cyber-cyan/70 shadow-[0_0_40px_rgba(0,255,209,0.08)]">
        <div className="flex items-center gap-2 pb-3 border-b border-white/10">
          <span className="w-2 h-2 bg-cyber-pink" />
          <span className="w-2 h-2 bg-cyber-neon" />
          <span className="w-2 h-2 bg-cyber-cyan" />
          <span className="ml-auto tracking-[0.25em] uppercase text-white/35">build.live</span>
        </div>
        <div className="pt-4 space-y-2 tracking-[0.18em] uppercase">
          <div>deploy: clean</div>
          <div className="text-white/35">speed: 98/100</div>
          <div>ui: neon-ready</div>
        </div>
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
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, delay: 0.8 }} className="absolute -bottom-6 left-0 w-2/3 md:w-1/2 h-2 bg-cyber-neon shadow-neon origin-left" />
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1 }} className="flex flex-col md:flex-row justify-between items-start md:items-end mt-16 gap-10">
          <div className="max-w-xl">
            <h2 className="font-sub font-light text-2xl md:text-3xl text-white mb-6 tracking-wide">
              САЙТЫ КОТОРЫЕ <span className="text-cyber-neon font-bold border-b border-cyber-neon">ПРОДАЮТ</span>
            </h2>
            <p className="font-body text-cyber-text text-lg font-light leading-relaxed border-l-4 border-cyber-dark pl-6">
              Создаю быстрые и красивые сайты для компаний. Без конструкторов, без лишних сложностей. Только чистый код и результат.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-6 w-full md:w-auto">
            <a href="#workflow" className="px-10 py-5 bg-cyber-neon text-white font-header font-bold tracking-wider uppercase text-lg hover:bg-white hover:text-cyber-bg transition-all duration-300 shadow-neon hover:shadow-none text-center">
              Как я работаю
            </a>
            <a href="#contact" className="px-10 py-5 border border-white/20 text-white font-sub font-bold tracking-wider uppercase text-sm hover:border-cyber-cyan hover:text-cyber-cyan transition-all duration-300 flex items-center justify-center bg-cyber-dark/50 backdrop-blur-sm">
              Написать мне
            </a>
          </div>
        </motion.div>
      </div>

      <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-3 opacity-70">
        <span className="font-sub text-[10px] tracking-[0.3em] uppercase text-cyber-cyan">Вниз</span>
        <ArrowRight className="w-5 h-5 text-cyber-cyan rotate-90" />
      </motion.div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="py-24 relative border-t border-white/5 bg-[#080714]">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <div>
            <span className="text-cyber-neon font-sub text-sm tracking-[0.3em] uppercase font-bold">Предложение</span>
            <h2 className="font-header font-black text-4xl md:text-6xl text-white mt-2 uppercase leading-tight">
              ЧЕСТНАЯ <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-blue-500">ЦЕНА</span>
            </h2>
          </div>
          <p className="text-cyber-text font-sub text-sm max-w-xs ml-auto opacity-70 text-right hidden md:block">
            Фиксированная стоимость. Никаких скрытых доплат.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const Icon = serviceIcons[service.icon] || Code2;
            const featured = Boolean(service.price);
            return (
              <div key={service.title} className={`group relative p-8 border transition-all duration-500 flex flex-col justify-between min-h-[320px] ${featured ? 'bg-cyber-dark border-cyber-neon shadow-[0_0_30px_rgba(157,111,255,0.1)]' : 'bg-cyber-dark/50 border-white/5 hover:border-cyber-cyan/50'}`}>
                <div>
                  <div className={`mb-6 transition-colors duration-300 ${featured ? 'text-cyber-neon' : 'text-white/30 group-hover:text-cyber-cyan'}`}>
                    <Icon size={48} strokeWidth={1.5} />
                  </div>
                  <h3 className="font-header font-bold text-xl text-white mb-4 tracking-wide group-hover:text-cyber-cyan transition-colors duration-300">{service.title}</h3>
                  <p className="font-body text-sm text-cyber-text font-light leading-relaxed opacity-80">{service.text}</p>
                </div>
                {service.price && (
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <div className="font-sub text-xs uppercase tracking-widest text-gray-400 mb-1">Фиксировано</div>
                    <div className="font-header font-black text-3xl text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{service.price}</div>
                  </div>
                )}
                <div className="absolute top-4 right-4 font-sub text-xs font-bold text-white/10">0{index + 1}</div>
              </div>
            );
          })}
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
      <BackToTop />
    </main>
  );
}
