# CyberPulse site

Корневой `index.html` сейчас подключает оригинальный бандл `assets/index-8EiOxp41.js`, поэтому локальная версия открывается 1-в-1 как сайт на `neon-dev.ru`.

## Как дорабатывать

- Текущая 1-в-1 версия: `index.html` + `public/assets/index-8EiOxp41.js`
- Старый хостинговый архив: `public_html`
- Черновые восстановленные исходники для будущей переработки: `src/App.jsx`, `src/data.js`, `src/styles.css`
- Картинки и служебные файлы для новой версии лежат в `public`
- Vite больше не сканирует `public_html`, поэтому ошибка с `@emotion/is-prop-valid` не должна появляться

## Команды

```bash
npm install
npm run dev
npm run build
```

После `npm run build` готовая версия будет в папке `dist`. Ее можно загрузить на хостинг вместо текущего содержимого `public_html`.
