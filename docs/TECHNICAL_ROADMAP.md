# Charivna Craft — Technical Roadmap

* **ChatGPT-проєкт:** Charivna Технічка
* **Останнє оновлення:** 2026-06-27
* **Пов’язані документи:** [`MASTER_PLAN.md`](./MASTER_PLAN.md), [`DECISIONS.md`](./DECISIONS.md), [`WORKFLOW.md`](./WORKFLOW.md), [`AGENTS.md`](../AGENTS.md)

## Вступ

Стек: React, Vite, React Router, MobX, React-Bootstrap, SCSS, Node.js, Express, Sequelize, PostgreSQL, Vercel, Railway, Cloudinary.

Правила:

* `client/` — frontend, `server/` — backend;
* `main` — production source, `staging` — staging source;
* одна погоджена задача — одна feature branch і один PR;
* merge і deployment лише після ручного підтвердження.

## Поточний пріоритет

Реалізувати UX/CRO-план маленькими незалежними PR. Не змішувати сторінку товару, checkout, notifications і success screen в одну задачу.

## Next actions

### 1. ⏭ Product purchase clarity

Frontend-only зміни сторінки товару:

* нова purchase-ієрархія;
* пояснення `MADE_TO_ORDER` зі строком 1–3 робочі дні;
* ключові характеристики до CTA;
* компактніший quantity control;
* trust-рядки доставки, оплати, повернення й консультації;
* плашка «Безкоштовна доставка від 1500 грн»;
* focus states і mobile layout;
* без змін backend, cart, checkout, email і Telegram.

### 2. ⏭ Checkout delivery cleanup

* Видалити `UKR_BRANCH` зі способів доставки.
* Видалити `ukrCity`, `ukrOffice` і пов’язані validation/render branches.
* Не формувати shipping payload для Укрпошти.
* Залишити Нову пошту: відділення, поштомат і кур’єр.
* Показувати умову безкоштовної доставки від 1500 грн.
* Явно показувати, коли поточне замовлення отримує безкоштовну доставку.
* Не ламати Nova Poshta API, map modal і warehouse selection.
* Перевірити guest та auth order flow.
* Не додавати автоматичне правило передоплати залежно від кількості товарів.

### 3. ⏭ Order notifications

Backend самостійно визначає умови за товарами з БД і фактичною сумою.

Scope:

* обчислювати `isFreeShipping` при сумі товарів від 1500 грн;
* у Telegram для магазину додавати окремий помітний рядок `БЕЗКОШТОВНА ДОСТАВКА`;
* у спільному email покупцю й магазину показувати безкоштовну доставку як звичайний параметр;
* не додавати `requiresFullPrepayment` або автоматичні нагадування про передоплату;
* не довіряти frontend total або flags;
* не робити Telegram/email критичними для створення замовлення;
* зберегти logging помилок сповіщень.

### 4. ⏭ Order success screen

Поточний `OrderConfirm` автоматично закривається, а checkout через 4,5 секунди очищає кошик і переходить на головну. Замінити це окремим success state або route.

Scope:

* після успішного API response показувати повноцінний success screen;
* не закривати його й не redirect-ити автоматично;
* показувати номер замовлення;
* пояснити підтвердження дзвінком або повідомленням;
* додати кнопку повернення до каталогу;
* за потреби — посилання на замовлення для авторизованого користувача;
* очистити кошик один раз, не втративши success data;
* блокувати повторний submit і double click;
* refresh/back не повинні повторювати POST;
* зберегти `noindex, nofollow`;
* перевірити desktop/mobile, focus management, screen reader announcement і reduced motion;
* не копіювати Pethouse assets або branding.

### 5. ⏭ Актуалізація order-related content

* Прибрати Укрпошту зі сторінки доставки, оферти й інших актуальних текстів.
* Прибрати згадки гіпсових фігурок та інших старих напрямів.
* Уніфікувати email на `charivna.craft@gmail.com`.
* Синхронізувати формулювання підтвердження замовлення.
* Синхронізувати безкоштовну доставку від 1500 грн.
* Повернення комунікувати як 14 днів відповідно до погодженої політики.
* Юридичні твердження не переписувати без окремої перевірки.

### 6. ⏭ Product gallery

* Більше основне фото.
* Thumbnails у звичайному layout.
* Active thumbnail і лічильник.
* Mobile swipe.
* Semantic buttons замість клікабельних `img`.
* Keyboard navigation, `Escape` і focus return.
* Стани з одним, двома й багатьма фото.

### 7. ⏭ Product cards and mobile grid

* Нова інформаційна ієрархія.
* Status badge.
* Прибрати артикул із картки.
* Спростити ціну.
* Стабільна висота назв.
* `focus-visible`.
* Перевірка `object-fit`.
* Окреме рішення щодо direct add-to-cart.
* Дві колонки на погоджених mobile widths.

### 8. ⏭ Homepage header, hero and categories

* Компактний header.
* Змістовний hero.
* CTA до каталогу.
* Trust strip і плашка безкоштовної доставки.
* Візуальні категорії.
* Desktop/mobile navigation.

### 9. ⏭ SEO-friendly pagination

Для `/`, `/koshyky-dlia-zberihannia` і `/blog`:

#### Phase 1

* `?page=n`, чистий URL для першої сторінки;
* crawlable `<a href>` для номерів, «Далі» й «Назад»;
* refresh, direct navigation і back/forward;
* self-canonical для кожної сторінки;
* без URL fragments;
* передбачувана обробка некоректних значень;
* desktop/mobile і crawler accessibility testing.

#### Phase 2

* backend pagination;
* filter/sort state у URL;
* окрема SEO-стратегія для combinations;
* без неконтрольованих indexable URL;
* не змішувати з Phase 1 без погодження.

### 10. ⏭ Technical blog template

* Metadata, canonical, Open Graph і Twitter Cards.
* `BlogPosting` і `BreadcrumbList`.
* Коректний description без HTML.
* Image, alt, dates, author block, related articles і TOC.
* Reusable template для публікації без ручного дизайну кожної статті.

### 11. ⏭ 404 handling

* Неіснуюча стаття й unmatched frontend route.
* Видимий Not Found state.
* `noindex, nofollow`.
* Без маскування 404 редиректом на головну.

### 12. ⏭ Metadata інших сторінок

Contacts, delivery-payment, return-policy, oferta, privacy, login, registration, profile, admin, password reset.

### 13. ⏭ Structured data audit

Organization, Product, Offer, BreadcrumbList, CollectionPage, ItemList, BlogPosting, FAQPage лише за видимого FAQ, без fake review data.

### 14. 🔍 Feeds та Merchant Center

`/gmc.xml`, `/rozetka.xml`, availability, product URLs, категорії, виключення старих напрямів, setup і validation.

### 15. 🔍 Performance і технічний борг

Bundle size, lazy loading, images, Sass deprecation, ESLint warnings, Core Web Vitals, API errors, loading/error states, dependency audit.

### 16. 🧊 Tests and CI

Frontend tests, backend endpoint tests, smoke tests для sitemap/feed/cart/order, CI та staging verification.

## Completed

* ✅ Проведено UX/UI та CRO-аудит.
* ✅ Зафіксовано поділ CRO-реалізації на окремі PR.
* ✅ Уточнено: автоматичного правила передоплати за кількістю товарів не буде.
* ✅ Уточнено формат free-shipping notification для email і Telegram.
* ✅ Filters, mobile filters і public type GET.
* ✅ Landing route, dynamic sitemap і feeds.
* ✅ Product not-found і availability/cart guards.
* ✅ Product/Breadcrumb structured data.
* ✅ Global metadata cleanup і noindex для cart/order.
* ✅ Staging workflow.

## Deferred

* 🧊 Чекбокс «Не телефонувати».
* 🧊 Великі checkout-зміни поза погодженими PR.
* 🧊 Database migrations без rollback plan.
* 🧊 Повний архітектурний refactor.

## Definition of Done

* маленький scope;
* feature branch і PR;
* build/lint;
* staging test;
* diff review;
* manual checklist;
* без автоматичного merge.
