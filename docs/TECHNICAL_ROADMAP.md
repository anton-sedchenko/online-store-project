# Charivna Craft — Technical Roadmap

* **ChatGPT-проєкт:** Charivna Технічка
* **Останнє оновлення:** 2026-06-27
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

## Поточний пріоритет

Технічна реалізація погодженого UX/CRO-плану має виконуватися маленькими незалежними PR. Перший PR — `Product purchase clarity`; checkout, order notifications і фінальний success screen не змішувати з ним.

## Next actions

### 1. ⏭ Product purchase clarity

Frontend-only зміни сторінки товару:

* нова purchase-ієрархія;
* пояснення `MADE_TO_ORDER` зі строком 1–3 робочі дні;
* ключові характеристики до CTA;
* компактніший quantity control;
* trust-рядки для доставки, оплати, повернення й консультації;
* плашка «Безкоштовна доставка від 1500 грн»;
* focus states і mobile layout;
* без змін backend, cart, checkout, email і Telegram.

### 2. ⏭ Checkout delivery cleanup

Поточний checkout має повну гілку `UKR_BRANCH`, яку потрібно прибрати окремим PR.

Scope:

* видалити Укрпошту зі списку способів доставки;
* видалити `ukrCity`, `ukrOffice` та пов’язану validation/render logic;
* не формувати shipping payload для Укрпошти;
* залишити Нову пошту: відділення, поштомат і кур’єр;
* оновити checkout hint відповідно до безкоштовної доставки від 1500 грн;
* явно показувати, коли поточне замовлення отримує безкоштовну доставку;
* не ламати Nova Poshta API, map modal і warehouse selection;
* перевірити guest/auth order flow.

### 3. ⏭ Order processing rules and notifications

Backend має самостійно обчислювати умови за фактичними товарами з БД та кількістю.

Scope:

* визначати `isFreeShipping` при сумі замовлення ≥1500 грн;
* додавати в Telegram великий помітний рядок `БЕЗКОШТОВНА ДОСТАВКА`;
* додавати помітне нагадування в email магазину;
* перед реалізацією визначити, чи бачить таке саме повідомлення покупець;
* після остаточного уточнення правила 5 одиниць обчислювати `requiresFullPrepayment`;
* додавати в Telegram/email нагадування `ПОТРІБНА ПОВНА ПЕРЕДОПЛАТА`;
* не довіряти frontend total/flags;
* не робити Telegram/email критичними для створення замовлення;
* зберегти logging помилок сповіщень;
* за потреби розділити customer email і admin email, оскільки зараз використовується один HTML для обох адрес.

### 4. ⏭ Order success screen

Поточний `OrderConfirm` — коротка modal, яка автоматично закривається; checkout через 4,5 секунди очищає кошик і переходить на головну. Це потрібно замінити окремим success state або route.

Scope:

* після успішного API response показувати повноцінний success screen;
* не закривати його автоматично;
* не виконувати автоматичний redirect через таймер;
* показувати номер замовлення з API response;
* текст: замовлення опрацьовується й буде підтверджене дзвінком або повідомленням;
* додати кнопку повернення до каталогу;
* за потреби додати посилання на замовлення для авторизованого користувача;
* очистити кошик один раз після успішного створення замовлення, не втративши потрібні success data;
* блокувати повторний submit під час запиту й після успіху;
* захистити від дублювання замовлення через double click;
* обробити refresh/back без повторного POST;
* залишити checkout/success flow `noindex, nofollow`;
* перевірити desktop/mobile, focus management, screen reader announcement і reduced motion;
* не копіювати Pethouse assets або branding, використовувати лише загальну інформаційну структуру як орієнтир.

### 5. ⏭ Актуалізація order-related content

Окремий невеликий PR або погоджена частина checkout cleanup:

* прибрати Укрпошту зі сторінки доставки, оферти й інших актуальних текстів;
* прибрати згадки гіпсових фігурок та інших старих напрямів;
* уніфікувати email на `charivna.craft@gmail.com`;
* синхронізувати формулювання підтвердження замовлення;
* синхронізувати поріг безкоштовної доставки 1500 грн;
* повернення комунікувати як 14 днів відповідно до затвердженої політики;
* юридичні твердження не переписувати без окремої перевірки змісту.

### 6. ⏭ Product gallery

* Більше основне фото.
* Thumbnails у звичайному layout.
* Active thumbnail і лічильник.
* Mobile swipe.
* Semantic buttons замість клікабельних `img`.
* Keyboard navigation та `Escape`.
* Стани з одним, двома й багатьма фото.
* Коректний focus return після lightbox.

### 7. ⏭ Product cards and mobile grid

* Нова інформаційна ієрархія.
* Status badge.
* Прибрати артикул із картки.
* Спростити відображення ціни.
* Резерв висоти назв.
* `focus-visible`.
* Перевірка `object-fit`.
* Окреме рішення щодо direct add-to-cart.
* Дві колонки на погоджених mobile widths.

### 8. ⏭ Homepage header, hero and categories

* Компактний header.
* Змістовний hero.
* CTA до каталогу.
* Trust strip.
* Плашка безкоштовної доставки.
* Візуальні категорії.
* Desktop/mobile navigation.

### 9. ⏭ SEO-friendly пагінація каталогу й блогу

Поточна пагінація працює через локальний React state і кнопки без окремих URL. Це потрібно виправити для:

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

### 10. ⏭ Технічний шаблон блогу

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

### 11. ⏭ Обробка 404

* Неіснуюча стаття.
* Unmatched frontend route.
* `noindex, nofollow`.
* Коректний видимий Not Found стан.
* Не маскувати 404 редиректом на головну без пояснення.

### 12. ⏭ SEO metadata інших сторінок

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

### 13. ⏭ Structured data audit

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

### 14. 🔍 Feeds та Merchant Center

* Перевірка `/gmc.xml`.
* Перевірка `/rozetka.xml`.
* Актуальні статуси availability.
* Коректні product URLs.
* Актуальні категорії.
* Виключення старих товарних напрямів.
* Merchant Center setup і validation.

### 15. 🔍 Performance і технічний борг

* Bundle/chunk size.
* Lazy loading.
* Image optimization.
* Sass `@import` deprecation.
* Старі ESLint warnings.
* Core Web Vitals.
* API error handling.
* Loading/error states.
* Dependency audit.

### 16. 🧊 Тести й CI

* Базові frontend tests.
* Backend endpoint tests.
* Smoke tests для sitemap/feed/cart/order.
* CI перед merge.
* Перевірка staging.

## Completed

* ✅ Проведено read-only UX/UI та CRO-аудит.
* ✅ Зафіксовано технічний поділ CRO-реалізації на окремі PR.
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
* 🧊 Великі зміни checkout поза погодженими маленькими PR.
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
