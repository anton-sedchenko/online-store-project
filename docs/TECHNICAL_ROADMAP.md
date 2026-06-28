# Charivna Craft — Technical Roadmap

* **ChatGPT-проєкт:** Charivna Технічка
* **Останнє оновлення:** 2026-06-28
* **Пов’язані документи:** [`MASTER_PLAN.md`](./MASTER_PLAN.md), [`DECISIONS.md`](./DECISIONS.md), [`WORKFLOW.md`](./WORKFLOW.md), [`AGENTS.md`](../AGENTS.md)

## Вступ

Стек: React, Vite, React Router, MobX, React-Bootstrap, SCSS, Node.js, Express, Sequelize, PostgreSQL, Vercel, Railway, Cloudinary.

Правила:

* `client/` — frontend, `server/` — backend;
* `main` — production source, `staging` — staging source;
* одна погоджена задача — одна feature branch і один PR;
* merge і deployment лише після ручного підтвердження.

## Поточний пріоритет

Продовжувати UX/CRO-план маленькими незалежними PR. Purchase-блок, Nova Poshta-only checkout, confirmation preference, product gallery, order notifications і purchase controls завершені. Наступний окремий блок — повноцінний order success screen.

## Next actions

### 1. ✅ Product purchase clarity — завершено

PR #16:

* нова purchase-ієрархія;
* пояснення `MADE_TO_ORDER` зі строком 1–3 робочі дні;
* ключові характеристики до CTA;
* integer-safe quantity stepper;
* unit price і total для кількості понад 1;
* trust-рядки доставки, оплати, повернення й консультації;
* плашка «Безкоштовна доставка від 1500 грн»;
* focus states і mobile layout;
* фотоблок без зайвого вертикального розтягування.

### 2. ✅ Checkout delivery cleanup — завершено

PR #15:

* видалено `UKR_BRANCH` зі способів доставки;
* видалено `ukrCity`, `ukrOffice` і пов’язані validation/render branches;
* shipping payload більше не формується для Укрпошти;
* залишено Нову пошту: відділення, поштомат і кур’єр;
* Nova Poshta API, map modal і warehouse selection збережено;
* актуалізовано delivery/legal content і контактний email.

### 3. ✅ Checkout confirmation preference — завершено

PR #17:

* checkbox «Не зв’язуватися для підтвердження замовлення»;
* strict boolean normalization на backend;
* збереження preference у `shipping.orderPreferences` без migration;
* умовний Telegram/email/success-modal copy;
* primary CTA «Підтвердити замовлення» зроблена візуально помітною;
* телефон і email залишилися required.

### 4. ✅ Product gallery — завершено

PR #18 і PR #19:

* create-modal приймає окреме головне й кілька додаткових фото;
* головне фото зберігається лише в `Product.img`, додаткові — у `ProductImage`;
* previews, локальне видалення й захист від повторного вибору того самого файла;
* Cloudinary upload із cleanup через `public_id` при помилці;
* Product, marketplace params і ProductImage створюються в одній Sequelize transaction;
* storefront формує нормалізований список `product.img` + `product.images`;
* порожні й точні URL-дублікати прибираються, main image завжди перше;
* responsive main image з `object-fit: contain`;
* horizontal thumbnails, active state, counter і циклічні arrows;
* mobile swipe з `touch-action: pan-y`;
* semantic controls і `focus-visible`;
* React-Bootstrap lightbox із close button, arrows, thumbnails і keyboard navigation;
* focus переходить у modal при відкритті та повертається на main image trigger через `onExited`;
* Product schema використовує нормалізований gallery list;
* backend, schema й dependencies для storefront PR не змінювалися.

### 5. ✅ Order notifications and purchase controls — завершено

PR #20, PR #21 і PR #22:

* backend обчислює суму замовлення з `OrderProduct.quantity` і `Product.price` із БД;
* `isFreeShipping` визначається від 1500 грн включно без довіри до frontend flags;
* у Telegram для магазину додається окремий рядок `БЕЗКОШТОВНА ДОСТАВКА`;
* у спільному email покупцю й магазину безкоштовна доставка показується як звичайний параметр;
* Telegram/email errors не блокують створення замовлення;
* confirmation preference з PR #17 збережена;
* order email використовує актуальний Viber/Telegram номер `+38 (096) 784 63 99`;
* primary CTA у кошику, на товарі та checkout візуально уніфіковані;
* у кошику додано integer-safe quantity stepper із `−`, `+`, ручним input і мінімумом 1;
* auth cart має per-item pending guard і rollback при помилці;
* desktop-grid кошика адаптований, щоб степер, сума й remove button не виходили за картку;
* guest cart, auth cart API, checkout payload і backend cart architecture не змінювалися.

### 6. ⏭ Order success screen — наступний блок

Поточний `OrderConfirm` автоматично закривається, а checkout через 4,5 секунди очищає кошик і переходить на головну. Замінити це окремим success state або route.

Scope:

* після успішного API response показувати повноцінний success screen;
* не закривати його й не redirect-ити автоматично;
* показувати номер замовлення;
* пояснювати наступний крок з урахуванням `skipConfirmationContact`;
* додати кнопку повернення до каталогу;
* за потреби — посилання на замовлення для авторизованого користувача;
* очистити кошик один раз, не втративши success data;
* блокувати повторний submit і double click;
* refresh/back не повинні повторювати POST;
* зберегти `noindex, nofollow`;
* перевірити desktop/mobile, focus management, screen reader announcement і reduced motion;
* не копіювати Pethouse assets або branding.

### 7. ✅ Актуалізація order-related content — базовий cleanup завершено

PR #15, PR #16 і PR #21:

* прибрано Укрпошту зі сторінки доставки, оферти й актуальних текстів;
* прибрано згадки гіпсових фігурок у зміненому order-related scope;
* уніфіковано email на `charivna.craft@gmail.com`;
* синхронізовано формулювання підтвердження, оплати й `MADE_TO_ORDER`;
* повернення комунікується як 14 днів;
* актуалізовано Viber/Telegram contact у листі й support-блоці;
* юридичні твердження не переписувалися поза погодженим scope.

### 8. ⏭ Product cards and mobile grid

* Нова інформаційна ієрархія.
* Status badge.
* Прибрати артикул із картки.
* Спростити ціну.
* Стабільна висота назв.
* `focus-visible`.
* Перевірка `object-fit`.
* Окреме рішення щодо direct add-to-cart.
* Дві колонки на погоджених mobile widths.

### 9. ⏭ Homepage header, hero and categories

* Компактний header.
* Змістовний hero.
* CTA до каталогу.
* Trust strip і плашка безкоштовної доставки.
* Візуальні категорії.
* Desktop/mobile navigation.

### 10. ⏭ SEO-friendly pagination

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

### 11. ⏭ Technical blog template

* Metadata, canonical, Open Graph і Twitter Cards.
* `BlogPosting` і `BreadcrumbList`.
* Коректний description без HTML.
* Image, alt, dates, author block, related articles і TOC.
* Reusable template для публікації без ручного дизайну кожної статті.

### 12. ⏭ 404 handling

* Неіснуюча стаття й unmatched frontend route.
* Видимий Not Found state.
* `noindex, nofollow`.
* Без маскування 404 редиректом на головну.

### 13. ⏭ Metadata інших сторінок

Contacts, delivery-payment, return-policy, oferta, privacy, login, registration, profile, admin, password reset.

### 14. ⏭ Structured data audit

Organization, Product, Offer, BreadcrumbList, CollectionPage, ItemList, BlogPosting, FAQPage лише за видимого FAQ, без fake review data.

### 15. 🔍 Feeds та Merchant Center

`/gmc.xml`, `/rozetka.xml`, availability, product URLs, категорії, виключення старих напрямів, setup і validation.

### 16. 🔍 Performance і технічний борг

Bundle size, lazy loading, images, Sass deprecation, ESLint warnings, Core Web Vitals, API errors, loading/error states, dependency audit.

### 17. 🧊 Tests and CI

Frontend tests, backend endpoint tests, smoke tests для sitemap/feed/cart/order, CI та staging verification.

## Completed

* ✅ Проведено UX/UI та CRO-аудит.
* ✅ Зафіксовано поділ CRO-реалізації на окремі PR.
* ✅ Product purchase clarity — PR #16.
* ✅ Nova Poshta-only checkout cleanup — PR #15.
* ✅ Confirmation preference і primary checkout CTA — PR #17.
* ✅ Головне й додаткові фото під час створення товару — PR #18.
* ✅ Storefront product gallery — PR #19.
* ✅ Free-shipping order notifications — PR #20.
* ✅ Cart CTA і актуальні contact details — PR #21.
* ✅ Cart quantity stepper і primary product CTA — PR #22.
* ✅ Уточнено: автоматичного правила передоплати за кількістю товарів не буде.
* ✅ Уточнено формат free-shipping notification для email і Telegram.
* ✅ Filters, mobile filters і public type GET.
* ✅ Landing route, dynamic sitemap і feeds.
* ✅ Product not-found і availability/cart guards.
* ✅ Product/Breadcrumb structured data.
* ✅ Global metadata cleanup і noindex для cart/order.
* ✅ Staging workflow.

## Deferred

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
