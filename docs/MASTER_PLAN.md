# Charivna Craft — Master Plan

* **Проєкт:** Charivna Craft
* **Production domain:** https://charivna-craft.com.ua
* **GitHub repository:** `anton-sedchenko/online-store-project`
* **Frontend hosting:** Vercel
* **Backend/database hosting:** Railway
* **Останнє оновлення:** 2026-06-27

Цей файл є головним документом для проєкту `Charivna Головний`. Він містить лише загальні пріоритети, статуси й залежності між напрямами. Технічні, SEO та дизайн-деталі ведуться у відповідних roadmap-файлах.

## Стратегічні цілі

1. Розвивати Charivna Craft як інтернет-магазин виробів зі шнура ручної роботи.
2. Підвищити довіру й конверсію магазину до активного нарощування SEO-трафіку.
3. Збільшувати органічний трафік через технічне SEO, landing pages, категорії й блог.
4. Підвищувати довіру через якісні фото, правдивий контент, авторство та прозору інформацію.
5. Поступово покращувати UX, швидкість, стабільність і масштабованість магазину.
6. Не повертати старі напрями на кшталт гіпсових фігурок, бісеру, браслетів і герданів.

## Current directions

### Технічна розробка

⏭ Основний контекст: [`TECHNICAL_ROADMAP.md`](./TECHNICAL_ROADMAP.md). Purchase-блок і базовий checkout cleanup завершені. Найближчі технічні зміни: галерея товару, order notifications, повноцінний success screen, картки товарів і головна сторінка. Технічні SEO-задачі, performance, feeds і тести залишаються в roadmap та виконуються окремими погодженими PR.

### SEO і блог

🟡 Основний контекст: [`SEO_BLOG_ROADMAP.md`](./SEO_BLOG_ROADMAP.md). Keyword research, контент-план, SEO briefs, оновлення статей та внутрішня перелінковка залишаються важливими, але активне масштабування SEO-трафіку має йти після базових покращень довіри та конверсії магазину.

### Дизайн і контент

⏭ Основний контекст: [`DESIGN_CONTENT_ROADMAP.md`](./DESIGN_CONTENT_ROADMAP.md). Product purchase clarity, Nova Poshta-only checkout і confirmation preference завершені. Наступний дизайн-блок — `Product gallery`.

### Комерційний розвиток

🔍 Напрям охоплює Merchant Center, Rozetka, органічний трафік, конверсію, повторні покупки й довгострокову можливість тематичних рекламних інтеграцій у блозі. Будь-які зміни, що впливають на feeds, товари, URL або checkout, потребують окремого погодження.

## Next actions

1. ⏭ Покращити галерею товару: більше фото, thumbnails, mobile swipe і keyboard accessibility.
2. ⏭ Додати коректне відображення безкоштовної доставки в Telegram та email на основі фактичної суми замовлення.
3. ⏭ Замінити коротку автозакривну модалку повноцінним order success screen.
4. ⏭ Переробити ієрархію карток товарів і перевірити mobile grid.
5. ⏭ Оновити перший екран головної: компактний header, hero, CTA, trust strip і категорії.

## Completed

* ✅ Проведено read-only UX/UI та CRO-аудит головної сторінки, шаблону товару, карток товарів і desktop/mobile-станів.
* ✅ Product purchase clarity і trust-card сторінки товару.
* ✅ Nova Poshta-only checkout і видалення Укрпошти з актуальних текстів.
* ✅ Confirmation preference «Не зв’язуватися для підтвердження замовлення».
* ✅ Помітна primary CTA «Підтвердити замовлення».
* ✅ Налаштування Google Search Console.
* ✅ Актуалізація контактів.
* ✅ Видалення старого Merchant Center контенту про неактуальні товари.
* ✅ Робота маршрутів `/gmc.xml`, `/rozetka.xml`, `/sitemap.xml`.
* ✅ Власна сторінка товару, якого не знайдено.
* ✅ Фільтри за категорією, типом виробу та кольором.
* ✅ Мобільні фільтри.
* ✅ SEO landing page `/koshyky-dlia-zberihannia`.
* ✅ Базові Product/Breadcrumb/Organization structured data.
* ✅ Виправлення статусів:
  * `IN_STOCK`;
  * `MADE_TO_ORDER`;
  * `OUT_OF_STOCK`.
* ✅ Серверна й frontend-перевірка додавання товару до кошика.
* ✅ Відновлення staging-середовища.
* ✅ Синхронізація staging із main.
* ✅ Очищення глобальних SEO fallback metadata.
* ✅ Видалення застарілого `meta keywords`.
* ✅ `noindex, nofollow` для кошика та checkout.

Пов’язані PR:

* PR #7 — логіка статусів наявності.
* PR #9 — глобальні SEO metadata та noindex.
* PR #10 — синхронізація main → staging.
* PR #15 — Nova Poshta-only delivery cleanup.
* PR #16 — Product purchase clarity.
* PR #17 — confirmation preference і primary checkout CTA.

## Deferred

* 🧊 Масштабний перехід фільтрації та пагінації на backend.
* 🧊 Повноцінна автоматизація тестів.
* 🧊 Окреме DIY-медіа або піддомен.
* 🧊 Монетизація блогу рекламними публікаціями.
* 🧊 Повний редизайн або ребрендинг магазину.
* 🧊 Зміна логотипу без окремого погодження.

## Правила оновлення MASTER PLAN

* Не дублювати всю технічну деталізацію.
* Після завершення великої задачі змінювати статус.
* Додавати посилання на PR.
* Не змінювати затверджені пріоритети без рішення користувача.
* Зберігати максимум 5 найближчих загальних задач.
