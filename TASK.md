# Neon Dev — план поддержки и доработок main-ветки

Документ описывает хрупкие места и техдолг на ветке `main` (тёмный cyber-дизайн). Светлый редизайн идёт отдельно в `rf-market-55plus-design`.

Идти сверху вниз: критичное → желательное.

---

## 1. Критичное: фрагильные связки, ломаются при правках

### 1.1 `custom.js` удаляет React-футер и достраивает контактную зону

[public/custom.js:50-53](public/custom.js#L50) — `removeLegacyFooter()` удаляет `<footer id="contact">` (React).  
[public/custom.js:106-110](public/custom.js#L106) — `watchLegacyFooter()` ставит `MutationObserver` на 3 секунды и снова удаляет, если React его перерендерит.  
[public/custom.js:280-422](public/custom.js#L280) — `buildContactSection()` строит `<section class="sales-contact">` с live-projects, формой и `<footer class="neo-footer">`.

**Чем плохо:**
- Любое изменение React-`Footer` в `src/App.jsx` молча сносится.
- Mutation observer на 3 секунды — если React медленно отрисуется, футер останется.
- Поведение зависит от тайминга и порядка загрузки скриптов.

**Что сделать:**
- Решить, кто отвечает за футер: React или `custom.js`. Лучше React.
- Если оставлять `custom.js` — добавить флаг/data-атрибут на React-`Footer`, который сигнализирует «не трогать», ИЛИ полностью убрать React-`Footer` из дерева на main.
- Вынести `buildContactSection` в React-компонент, удалить `custom.js`-двойник.

### 1.2 Две системы модалок для одной задачи

- React: `ContactModal` в [src/App.jsx](src/App.jsx) — открывается по `openModal()`.
- DOM: `.quick-modal` в [public/custom.js:140-200](public/custom.js#L140) — открывается из `floating-discuss` и `data-open-modal` элементов в `sales-contact`.

**Чем плохо:** разный UX, разный CSS, две точки правки текстов согласий и кнопок.

**Что сделать:** оставить React-`ContactModal`, убрать `.quick-modal` из custom.js, перевести `floating-discuss` и live-card-кнопки на вызов React openModal через `window.openModal = ...` или CustomEvent.

### 1.3 Две формы заявки

- React-форма в `ContactModal` (см. App.jsx) — POST на `/contact.php`.
- DOM-форма `.sales-contact__form` в [public/custom.js:350-376](public/custom.js#L350) — тоже POST на `/contact.php`.

**Чем плохо:** разные наборы полей и текста чекбоксов могут разойтись. Цели Яндекс.Метрики `lead_sent` могут дважды отрабатывать.

**Что сделать:** оставить одну форму. Если нужна inline-форма в нижней секции — рендерить её React-компонентом, использующим тот же `handleSubmit`.

### 1.4 Промокод тянут две системы параллельно

- React: `usePromoTimer()`, `activatePromoCode()`, `ensurePromoCode()` в [src/App.jsx](src/App.jsx) — пишут в `localStorage.neonPromoExpiresAt`.
- DOM: `promo` объект и `isPromoActive`/`applyPromoToForm` в [public/custom.js:1-104](public/custom.js#L1) — читают/пишут тот же ключ.

**Чем плохо:** оба слушают `neon-promo-activated` событие. Если поменять `PROMO_DURATION_MS` в React и забыть в `custom.js` — таймеры разойдутся.

**Что сделать:** одна точка истины. Например — модуль `src/promo.js`, импортируется обоими (если custom.js остаётся, переделать его на ESM и подключать через Vite).

---

## 2. Дублирование данных

### 2.1 Контакты дублируются

- [public/custom.js:2-7](public/custom.js#L2) — `{ telegram, vk, email, phone }`.
- [src/App.jsx](src/App.jsx) Footer — те же контакты вписаны руками.
- В нескольких CTA жёстко прописан `https://t.me/Rambajo`.

**Что сделать:** перенести в `src/data.js`, импортировать везде. `custom.js` либо убрать, либо тоже читать оттуда.

### 2.2 Версии юридических документов

[public/contact.php:26-27](public/contact.php#L26), [public/custom.js:365-366](public/custom.js#L365), и формы в `src/App.jsx` — везде вшито `consent-2026-05-11` / `privacy-2026-05-11`.

**Что сделать:** один файл `src/legal-versions.js` (или константы PHP-include), импортировать. При обновлении документов меняется в одном месте + в `.html`.

### 2.3 Live-projects массив

[public/custom.js:17-48](public/custom.js#L17) — 3 проекта инлайн в скрипте.

**Что сделать:** перенести в `src/data.js` рядом с `portfolio`. Один источник, проще править.

### 2.4 Yandex.Metrika counter ID `109145693`

Прописан в [index.html](index.html#L77) и [public/custom.js:57](public/custom.js#L57).

**Что сделать:** переменная окружения `VITE_YANDEX_METRIKA_ID` + чтение в обоих местах.

### 2.5 Брендинг расходится

- Header в App.jsx: «САЙТЫ ДЛЯ БИЗНЕСА».
- Footer в custom.js: «NEON DEV».
- README: «Neon Dev / CyberPulse».
- `<title>`: «Neon Dev».

**Что сделать:** выбрать один — «NEON DEV». Прогнать по всем файлам.

---

## 3. Безопасность формы заявки

### 3.1 `public/contact.php` — нет защиты от спама и автоматизации

[public/contact.php](public/contact.php) использует `mail()` без:
- rate limiting (один IP может слать заявки тысячами),
- honeypot-поля,
- проверки `Referer` / `Origin`,
- reCAPTCHA / Cloudflare Turnstile,
- проверки длины и формата (минимальной).

**Что сделать:**
- Добавить honeypot input (например `<input name="company" hidden>` — если заполнено, считать ботом).
- Простой rate limit по IP через файл/кеш (1 заявка / 30 сек).
- Проверить `Origin` хедер.
- Добавить Cloudflare Turnstile / Yandex SmartCaptcha (для прод).

### 3.2 `From: no-reply@neon-dev.ru` без SPF/DKIM

[public/contact.php:65](public/contact.php#L65) ставит From на домене сайта.

**Что сделать:** настроить SPF, DKIM, DMARC на DNS Beget, иначе письма уходят в спам.

### 3.3 Нет логирования

Заявки уходят только письмом. Если `mail()` упадёт или письмо потеряется — заявка пропадёт без следа.

**Что сделать:** дублировать каждую заявку в файл `logs/leads.json` (или базу) с тем же содержимым.

---

## 4. SEO и производительность

### 4.1 `public/robots.txt` — двойной слеш в Sitemap

Сейчас `Sitemap: https://neon-dev.ru//sitemap.xml`. Поисковики могут не подобрать.

**Что сделать:** убрать второй слеш.

### 4.2 `public/sitemap.xml` — http и старый lastmod

URL `http://neon-dev.ru/`, дата устаревшая.

**Что сделать:** `https://`, актуальный `<lastmod>`.

### 4.3 Нет JSON-LD разметки

В `index.html` отсутствуют schema.org блоки: `LocalBusiness` / `ProfessionalService`, `WebSite`, `Service`, `OfferCatalog`.

**Что сделать:** добавить `<script type="application/ld+json">` в `<head>` index.html для:
- организации (Аллахвердиев Р.А., контакты, цены от 45 000 ₽),
- WebSite + SearchAction,
- ItemList для тарифов.

### 4.4 Изображения в `public/img/` — крупные PNG

Кейсы лежат как PNG. Должны быть WebP/AVIF с fallback.

**Что сделать:**
- Конвертировать в WebP (например через `cwebp` или Squoosh CLI).
- Использовать `<picture><source srcset="*.webp"><img src="*.png"></picture>` в `Portfolio` карточках.
- Добавить ширину/высоту → меньше CLS.

### 4.5 Метрики Lighthouse не зафиксированы

Нет baseline-замеров производительности.

**Что сделать:** запустить Lighthouse на проде, записать FCP/LCP/CLS/TBT/INP в `LIGHTHOUSE.md`. После каждой крупной правки — проверять.

---

## 5. Чистка проекта

### 5.1 `public/assets/index-8EiOxp41.js` — старый артефакт

Файл с собранным хешем — мёртвый код, висит в `public/` и попадает в `dist`.

**Что сделать:** удалить.

### 5.2 `dist/` коммитится в git

Должен быть в `.gitignore` и собираться в CI/CD.

**Что сделать:**
- Добавить `dist/` в `.gitignore`.
- `git rm -r --cached dist/`.
- Создать GitHub Actions / npm-скрипт `deploy` который собирает `dist/` и rsync'ит на Beget.

### 5.3 `importmap` в index.html — возможно мёртвый код

[index.html:58-68](index.html#L58) задаёт importmap для react/react-dom/etc через aistudiocdn.com. При сборке Vite использует свои бандлы.

**Что сделать:** проверить — нужен ли в проде. Если Vite-сборка работает без него, удалить.

### 5.4 `custom.css` (1184 строки) частично дублирует `src/styles.css`

Стили для `.live-card`, `.sales-contact__form`, `.quick-modal`, `.neo-footer`, `.floating-discuss` повторяют то, что есть в `src/styles.css`.

**Что сделать:** если убираем `custom.js` (см. 1.1), удаляем и `custom.css`. Стили переезжают в React-компоненты + `src/styles.css`.

### 5.5 `package.json` — название `cyberpulse-site`

Несоответствие бренду «Neon Dev».

**Что сделать:** переименовать в `"name": "neon-dev-site"`.

---

## 6. Dev-процесс

### 6.1 Нет линтера и форматтера

Нет `.eslintrc`, нет `.prettierrc`. Код может разойтись по стилю.

**Что сделать:**
- Установить ESLint с конфигом для React (`eslint-config-react-app` или `@vitejs/plugin-react` рекомендации).
- Установить Prettier.
- Добавить `npm run lint` и `npm run format` в `package.json`.

### 6.2 Нет тестов

Нет ни юнит, ни e2e.

**Что сделать (минимум):** Playwright e2e-тест на критический сценарий — открыть сайт, кликнуть «Обсудить сайт», заполнить форму, отправить. Один тест, который ловит регрессии формы.

### 6.3 Нет pre-commit хуков

Нет `husky` / `lint-staged`. Можно закоммитить сломанный код.

**Что сделать:** husky + lint-staged → `eslint --fix`, `prettier --write`, `vite build` на staged-файлах перед commit.

### 6.4 `npm run check` не покрывает CSS и React

[package.json:10-12](package.json#L10) — `check:js` проверяет только `public/custom.js`, `check:php` — только `contact.php`. React-код не валидируется.

**Что сделать:** добавить `npm run lint` в `check`, прогонять ESLint на `src/**`.

---

## 7. Backups и мониторинг (production)

### 7.1 Нет автобэкапа

Beget по умолчанию ничего не бэкапит код-проекта (только панель).

**Что сделать:**
- Git origin — основной бэкап кода.
- Раз в месяц вручную дёргать `tar` на сервере + скачивать.
- Логи заявок (см. 3.3) тоже бэкапить.

### 7.2 Нет аптайм-мониторинга

Если сайт упадёт ночью — узнаешь от клиента.

**Что сделать:** UptimeRobot / БетСтат / самописный скрипт пинга — раз в 5 минут, уведомление в Telegram.

### 7.3 Нет dashboard для заявок

Заявки идут только в почту. Можно потерять, не отвечая в спам.

**Что сделать:** подключить заявки в Telegram-бот (например через `bot.sendMessage`). При получении заявки PHP-скрипт делает HTTP-запрос к telegram-api.

---

## Приоритет

| Приоритет | Что | Где |
|---|---|---|
| 🔥 Сейчас | Honeypot + rate limit на форму | 3.1 |
| 🔥 Сейчас | Заявки в Telegram + лог в файл | 3.3, 7.3 |
| 🔥 Сейчас | SPF / DKIM на домене | 3.2 |
| ⚡ Ближайшее | Убрать `dist/` из git | 5.2 |
| ⚡ Ближайшее | Исправить robots.txt + sitemap.xml | 4.1, 4.2 |
| ⚡ Ближайшее | JSON-LD разметка | 4.3 |
| ⚡ Ближайшее | WebP для изображений | 4.4 |
| 🛠 Когда руки дойдут | Убрать `custom.js`, перевести всё в React | 1.1, 1.2, 1.3 |
| 🛠 Когда руки дойдут | Контакты + версии в одном месте | 2.1, 2.2 |
| 🛠 Когда руки дойдут | ESLint + Prettier + Playwright | 6.1, 6.2 |
| 📦 На будущее | Уптайм-мониторинг | 7.2 |

---

## Подсказки по правкам

- **Перед любой правкой `App.jsx`** проверять, не сносит ли `custom.js` твой компонент (см. 1.1).
- **При добавлении полей в форму** синхронизировать: React-форма + `custom.js` форма + `contact.php`. Иначе данные потеряются.
- **При обновлении юр-документов** синхронизировать версии: контента в HTML + `contact.php` + `custom.js`.
- **`dist/` не править руками** — все правки через `src/`, `public/`, `index.html` → `npm run build`.
- **Светлая ветка `rf-market-55plus-design`** — параллельный эксперимент. Не мёрджить в main без полного review, она поменяла App.jsx и styles.css капитально.
