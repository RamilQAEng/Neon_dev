(function () {
  const contacts = {
    telegram: 'https://t.me/Rambajo',
    vk: 'https://vk.com/allakhverdievr',
    email: 'qubitaibots@gmail.com',
    phone: '+7 901 272-89-16'
  };
  let quickModalOpener = null;

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
      result: 'Упаковали сложный security-продукт в понятный first screen: зачем проверять LLM, какие риски закрывает платформа и как быстро перейти к аудиту.',
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

  function removeLegacyFooter() {
    const legacyFooter = document.querySelector('footer#contact');
    if (legacyFooter) legacyFooter.remove();
  }

  function trackGoal(goal, payload) {
    if (typeof window.ym === 'function') {
      window.ym(109145693, 'reachGoal', goal, payload);
    }
  }

  function watchLegacyFooter() {
    const observer = new MutationObserver(() => removeLegacyFooter());
    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => observer.disconnect(), 3000);
  }

  async function sendLeadForm(form) {
    const status = form.querySelector('.form-status');
    const submit = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);
    status.textContent = 'Отправляю...';
    submit.disabled = true;

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' }
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.ok) throw new Error(data.message || 'Не удалось отправить заявку.');
      trackGoal('lead_sent', {
        plan: formData.get('plan') || 'Тариф по задаче',
        price: formData.get('price') || 'Тариф по задаче'
      });
      form.reset();
      status.textContent = 'Заявка отправлена. Я свяжусь с вами в ближайшее время.';
      return true;
    } catch (error) {
      status.textContent = error.message || 'Ошибка отправки. Напишите в Telegram.';
      return false;
    } finally {
      submit.disabled = false;
    }
  }

  function buildQuickModal() {
    if (document.querySelector('.quick-modal')) return;

    const modal = document.createElement('div');
    modal.className = 'quick-modal';
    modal.setAttribute('aria-hidden', 'true');
    modal.inert = true;
    modal.innerHTML = `
      <div class="quick-modal__overlay" data-close-modal></div>
      <div class="quick-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="quick-modal-title">
        <button class="quick-modal__close" type="button" aria-label="Закрыть" data-close-modal>×</button>
        <div class="quick-modal__terminal">
          <span class="terminal-dot"></span>
          <span class="terminal-dot"></span>
          <span class="terminal-dot"></span>
          <span class="terminal-title">quick.lead</span>
        </div>
        <div class="quick-modal__grid">
          <div class="quick-modal__copy">
            <div class="sales-contact__kicker">Быстрый контакт</div>
            <h2 id="quick-modal-title">Обсудить <span>проект</span></h2>
            <p>Оставьте имя и контакт. Детали задачи уточню в переписке, без длинной формы на старте.</p>
            <div class="quick-modal__price">
              <span>Старт от</span>
              <strong>45 000 ₽</strong>
            </div>
          </div>
          <form class="quick-modal__form" action="/contact.php" method="post">
            <input name="name" autocomplete="name" placeholder="Имя" required>
            <input name="contact" autocomplete="email tel" placeholder="Telegram, телефон или email" required>
            <input type="hidden" name="price" value="Тариф по задаче">
            <input type="hidden" name="plan" value="Тариф по задаче">
            <input type="hidden" name="message" value="Заявка без сообщения: уточнить задачу в переписке.">
            <input type="hidden" name="consent_version" value="consent-2026-05-11">
            <input type="hidden" name="privacy_version" value="privacy-2026-05-11">
            <input type="hidden" name="privacy_read" value="yes">
            <label>
              <input type="checkbox" name="personal_data_agree" value="yes" required>
              <span>Согласен на <a href="/consent.html" target="_blank">обработку персональных данных</a> и ознакомлен с <a href="/privacy.html" target="_blank">политикой конфиденциальности</a>.</span>
            </label>
            <button type="submit">Получить консультацию</button>
            <div class="form-status" aria-live="polite"></div>
          </form>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.addEventListener('click', (event) => {
      if (event.target.closest('[data-close-modal]')) closeQuickModal();
    });

    modal.querySelector('form').addEventListener('submit', async (event) => {
      event.preventDefault();
      const sent = await sendLeadForm(event.currentTarget);
      if (sent) setTimeout(() => closeQuickModal(), 1400);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && modal.classList.contains('is-open')) closeQuickModal();
    });
  }

  function openQuickModal(opener) {
    buildQuickModal();
    const modal = document.querySelector('.quick-modal');
    const trigger = opener?.currentTarget || opener;
    if (opener?.currentTarget) {
      quickModalOpener = opener.currentTarget;
    } else if (opener instanceof HTMLElement) {
      quickModalOpener = opener;
    } else if (document.activeElement instanceof HTMLElement && !document.activeElement.closest('.quick-modal')) {
      quickModalOpener = document.activeElement;
    }

    const price = trigger?.dataset?.price || '45 000 ₽';
    const plan = trigger?.dataset?.plan || 'Тариф по задаче';
    const priceLabel = trigger?.dataset?.price ? plan : 'Старт от';
    const priceCaption = modal.querySelector('.quick-modal__price span');
    const priceValue = modal.querySelector('.quick-modal__price strong');
    const priceField = modal.querySelector('input[name="price"]');
    const planField = modal.querySelector('input[name="plan"]');

    if (priceCaption) priceCaption.textContent = priceLabel;
    if (priceValue) priceValue.textContent = price;
    if (priceField) priceField.value = price;
    if (planField) planField.value = plan;
    if (trigger?.dataset?.price) {
      trackGoal('tariff_click', { plan, price });
    }

    modal.inert = false;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('modal-open');
    setTimeout(() => modal.querySelector('input[name="name"]')?.focus(), 80);
  }

  function closeQuickModal() {
    const modal = document.querySelector('.quick-modal');
    if (!modal) return;

    if (modal.contains(document.activeElement)) {
      if (quickModalOpener?.isConnected) {
        quickModalOpener.focus({ preventScroll: true });
      } else {
        document.activeElement.blur();
      }
    }

    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    modal.inert = true;
    document.documentElement.classList.remove('modal-open');
  }

  function hookCtaButtons() {
    const shouldOpenModal = (element) => {
      const text = (element.textContent || '').trim().toLowerCase();
      const href = element.getAttribute('href') || '';
      return href === '#contact' || text.includes('обсудить проект') || text.includes('хочу такой сайт') || text.includes('написать мне');
    };

    document.addEventListener('click', (event) => {
      const trigger = event.target.closest('a, button');
      if (!trigger || trigger.closest('.quick-modal') || trigger.closest('.sales-contact__form')) return;
      if (!shouldOpenModal(trigger)) return;

      event.preventDefault();
      openQuickModal(trigger);
    });
  }

  function buildContactSection() {
    if (document.querySelector('.sales-contact')) return;

    const section = document.createElement('section');
    section.className = 'sales-contact';
    section.id = 'contact';
    section.innerHTML = `
      <div class="live-projects">
        <div class="live-projects__head">
          <div class="sales-contact__kicker">Действующие сайты</div>
          <h2>LIVE <span>PROJECTS</span></h2>
          <p class="sales-contact__text">
            Реальные проекты, которые уже открываются по доменам. Разные задачи: AI-аудит, ИИ-боты, SEO/digital-воронка.
          </p>
        </div>
        <div class="live-projects__grid">
          ${liveProjects.map((project, index) => `
            <article class="live-card live-card--${index + 1}">
              <div class="live-card__screen">
                <div class="live-card__bar">
                  <span></span><span></span><span></span>
                  <small>${new URL(project.url).hostname}</small>
                </div>
                <div class="live-card__preview">
                  <div class="live-card__eyebrow">${project.type}</div>
                  <div class="live-card__title">${project.title}</div>
                  <div class="live-card__accent">${project.accent}</div>
                  <div class="live-card__lines">
                    <i></i><i></i><i></i>
                  </div>
                </div>
              </div>
              <div class="live-card__body">
                <div class="live-card__meta">
                  <span>0${index + 1}</span>
                  <span>production</span>
                </div>
                <h3>${project.title}</h3>
                <p>${project.lead}</p>
                <div class="live-card__stats">
                  ${project.stats.map((stat) => `<span>${stat}</span>`).join('')}
                </div>
                <p class="live-card__result">${project.result}</p>
                <div class="live-card__stack">
                  ${project.stack.map((tag) => `<span>${tag}</span>`).join('')}
                </div>
                <div class="live-card__actions">
                  <a href="${project.url}" target="_blank" rel="noopener noreferrer">Открыть сайт</a>
                  <button type="button" data-open-modal>Хочу похожий</button>
                </div>
              </div>
            </article>
          `).join('')}
        </div>
      </div>

      <div class="sales-contact__head">
        <div class="sales-contact__kicker">Связаться</div>
        <h2>ЗАПУСТИМ <span>ПРОЕКТ</span></h2>
        <div class="sales-contact__price">
          <span>Старт проекта</span>
          <strong>от 45 000 ₽</strong>
          <small>фиксируем формат и бюджет до начала работ</small>
        </div>
        <p class="sales-contact__text">
          Оставьте имя и контакт. Я сам уточню детали в переписке и предложу подходящий формат сайта без длинных брифов.
        </p>
      </div>

      <div class="sales-contact__inner">
        <form class="sales-contact__form" action="/contact.php" method="post">
          <div class="sales-contact__form-top">
            <span class="terminal-dot"></span>
            <span class="terminal-dot"></span>
            <span class="terminal-dot"></span>
            <span class="terminal-title">request.init</span>
          </div>
          <h3>Форма связи</h3>
          <p>Оставьте контакт. Я напишу сам, уточню задачу и предложу подходящий формат сайта.</p>
          <div class="form-grid">
            <input name="name" autocomplete="name" placeholder="Ваше имя" required>
            <input name="contact" autocomplete="email tel" placeholder="Телефон, Telegram или email" required>
            <input type="hidden" name="price" value="Тариф по задаче">
            <input type="hidden" name="plan" value="Тариф по задаче">
            <input type="hidden" name="message" value="Заявка без сообщения: уточнить задачу в переписке.">
            <input type="hidden" name="consent_version" value="consent-2026-05-11">
            <input type="hidden" name="privacy_version" value="privacy-2026-05-11">
            <input type="hidden" name="privacy_read" value="yes">
            <label>
              <input type="checkbox" name="personal_data_agree" value="yes" required>
              <span>Согласен на <a href="/consent.html" target="_blank">обработку персональных данных</a> и ознакомлен с <a href="/privacy.html" target="_blank">политикой конфиденциальности</a>.</span>
            </label>
            <button type="submit">Получить консультацию</button>
            <div class="form-status" aria-live="polite"></div>
          </div>
        </form>
      </div>

      <footer class="neo-footer">
        <div class="neo-footer__grid">
          <div>
            <div class="neo-footer__brand">NEON<span>DEV</span></div>
            <p>Чистый код, быстрый запуск, темная digital-эстетика для сайтов, которые продают услугу.</p>
          </div>

          <div>
            <div class="neo-footer__title">Контакты</div>
            <div class="neo-footer__links">
              <a href="${contacts.telegram}" target="_blank" rel="noopener noreferrer">Telegram</a>
              <a href="${contacts.vk}" target="_blank" rel="noopener noreferrer">VK</a>
              <a href="mailto:${contacts.email}">${contacts.email}</a>
              <a href="tel:${contacts.phone.replace(/[^+\d]/g, '')}">${contacts.phone}</a>
            </div>
          </div>

          <div>
            <div class="neo-footer__title">Документы</div>
            <div class="neo-footer__links">
              <a href="/privacy.html">Конфиденциальность</a>
              <a href="/consent.html">Согласие на ПД</a>
              <a href="/cookies.html">Cookies</a>
            </div>
          </div>
        </div>
        <div class="neo-footer__bottom">
          <span>© 2026 NEON DEV</span>
          <span class="neo-footer__mono">status: online / stack: react + php</span>
        </div>
      </footer>
    `;

    document.body.appendChild(section);

    section.querySelectorAll('[data-open-modal]').forEach((button) => {
      button.addEventListener('click', openQuickModal);
    });

    section.querySelector('form').addEventListener('submit', async (event) => {
      event.preventDefault();
      sendLeadForm(event.currentTarget);
    });
  }

  function buildCookieBanner() {
    if (localStorage.getItem('neonCookieConsent')) return;

    const banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.innerHTML = `
      <div>
        <strong>Cookie и аналитика</strong>
        <p>Сайт использует cookie для работы интерфейса, статистики и улучшения качества. Подробнее — в <a href="/cookies.html">политике cookies</a>.</p>
      </div>
      <div class="cookie-banner__actions">
        <button type="button" data-cookie="necessary" class="secondary">Только нужные</button>
        <button type="button" data-cookie="all">Принять</button>
      </div>
    `;

    banner.addEventListener('click', (event) => {
      const button = event.target.closest('[data-cookie]');
      if (!button) return;
      localStorage.setItem('neonCookieConsent', button.dataset.cookie);
      banner.remove();
    });

    document.body.appendChild(banner);
  }

  function buildFloatingDiscussButton() {
    if (document.querySelector('.floating-discuss')) return;

    const button = document.createElement('button');
    button.className = 'floating-discuss';
    button.type = 'button';
    button.innerHTML = '<span></span><strong>Обсудить проект</strong>';
    button.addEventListener('click', openQuickModal);

    document.body.appendChild(button);
  }

  window.addEventListener('DOMContentLoaded', () => {
    removeLegacyFooter();
    watchLegacyFooter();
    buildQuickModal();
    hookCtaButtons();
    buildContactSection();
    buildFloatingDiscussButton();
    buildCookieBanner();
  });
})();
