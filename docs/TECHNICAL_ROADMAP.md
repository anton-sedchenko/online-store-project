# Charivna Craft — Technical Roadmap

* **ChatGPT-проєкт:** Charivna Технічка
* **Останнє оновлення:** 2026-06-22
* **Пов’язані документи:** [`MASTER_PLAN.md`](./MASTER_PLAN.md), [`DECISIONS.md`](./DECISIONS.md), [`WORKFLOW.md`](./WORKFLOW.md), [`AGENTS.md`](../AGENTS.md)

## Вступ

Основний стек:

* React;
* Vite;
* React Router;
* MobX;
* React-Bootstrap;
* SCSS;
* Node.js;
* Express;
* Sequelize;
* PostgreSQL;
* Vercel;
* Railway;
* Cloudinary.

Архітектурна схема:

* `client/` — frontend;
* `server/` — backend;
* `main` — production source;
* `staging` — staging source;
* кожна зміна через feature branch і PR;
* merge і deployment лише після ручного підтвердження.

## Next actions

### 1. ⏭ Технічний шаблон блогу

* SEO metadata для `/blog`.
* SEO metadata для `/blog/:slug`.
* Canonical.
* Open Graph.
* Twitter Cards.
* `BlogPosting`.
* `BreadcrumbList`.
* Коректний description без HTML.
* Тематичне зображення та alt.
* Дата публікації й оновлення.
* Reusable author block.
* Reusable related-articles block.
* Можливий зміст статті.
* Шаблон, де для публікації достатньо додати текст і кілька зображень.

### 2. ⏭ SEO-friendly пагінація каталогу й блогу

Поточна пагінація працює через локальний React state і кнопки без окремих URL. Це потрібно виправити як близький технічний SEO-пріоритет для:

* головного каталогу `/`;
* landing page `/koshyky-dlia-zberihannia`;
* списку статей `/blog`.

#### Phase 1 — crawlable URL pagination

* Кожна сторінка має отримати окремий URL у форматі `?page=n`.
* Перша сторінка має використовувати чистий URL без `?page=1`.
* Номери сторінок, «Далі» та «Назад» мають бути звичайними crawlable посиланнями `<a href>`.
* Поточна сторінка має відновлюватися після refresh, direct navigation та browser back/forward.
* Кожна сторінка пагінації має мати self-referencing canonical, а не canonical на першу сторінку.
* Не використовувати URL fragments на кшталт `#page=2`.
* Не покладатися на `rel="next"` і `rel="prev"` як на вимогу Google.
* Некоректні та завеликі значення `page` обробляти передбачувано без порожніх indexable сторінок.
* Перевірити desktop/mobile UI, direct navigation, refresh і доступність посилань для crawler.
* Зберегти всі product/article URLs у sitemap; sitemap не замінює внутрішні crawlable links.

Офіційна рекомендація: [Google Search Central — pagination and incremental page loading](https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading).

#### Phase 2 — масштабована backend/URL логіка

* Перенести пагінацію великих списків на backend замість завантаження сотень товарів і frontend `slice`.
* Зберігати filter/sort state у URL.
* Дозволити пряме відкриття погоджених відфільтрованих сторінок.
* Для filter/sort combinations визначити окрему SEO-стратегію: indexable landing, `noindex` або canonical — залежно від intent.
* Уникати неконтрольованого створення індексованих URL-комбінацій.
* Не поєднувати повний backend refactor із Phase 1 в одному PR без окремого погодження.

### 3. ⏭ Обробка 404

* Неіснуюча стаття.
* Unmatched frontend route.
* `noindex, nofollow`.
* Коректний видимий Not Found стан.
* Не маскувати 404 редиректом на головну без пояснення.

### 4. ⏭ SEO metadata інших сторінок

Перевірити й доповнити:

* contacts;
* delivery-payment;
* return-policy;
* oferta;
* privacy;
* login;
* registration;
* profile;
* admin;
* password reset.

### 5. ⏭ Structured data audit

Перевірити:

* Organization;
* Product;
* Offer;
* BreadcrumbList;
* CollectionPage;
* ItemList;
* BlogPosting;
* FAQPage лише за наявності видимого FAQ;
* відсутність fake review/aggregateRating data.

### 6. 🔍 Feeds та Merchant Center

* Перевірка `/gmc.xml`.
* Перевірка `/rozetka.xml`.
* Актуальні статуси availability.
* Коректні product URLs.
* Актуальні категорії.
* Виключення старих товарних напрямів.
* Merchant Center setup і validation.

### 7. 🔍 Performance і технічний борг

* Bundle/chunk size.
* Lazy loading.
* Image optimization.
* Sass `@import` deprecation.
* Старі ESLint warnings.
* Core Web Vitals.
* API error handling.
* Loading/error states.
* Dependency audit.

### 8. 🧊 Тести й CI

* Базові frontend tests.
* Backend endpoint tests.
* Smoke tests для sitemap/feed/cart/order.
* CI перед merge.
* Перевірка staging.

## Completed

* ✅ Filters: category/kind/color.
* ✅ Mobile filters.
* ✅ `typeRouter` public GET.
* ✅ Landing route.
* ✅ Dynamic sitemap.
* ✅ GMC/Rozetka routes.
* ✅ Product not-found handling.
* ✅ Availability helper.
* ✅ Cart availability guards.
* ✅ Product structured data.
* ✅ Breadcrumb structured data.
* ✅ Global metadata cleanup.
* ✅ Noindex для cart/order.
* ✅ Staging Railway/Vercel workflow.

## Deferred

* 🧊 Чекбокс «Не телефонувати».
* 🧊 Великі зміни checkout без окремого погодження.
* 🧊 Database migrations без rollback plan.
* 🧊 Повний архітектурний refactor.

## Definition of Done

Для технічної задачі:

* маленький scope;
* feature branch;
* PR;
* build/lint;
* staging test;
* diff review;
* manual checklist;
* без автоматичного merge.
