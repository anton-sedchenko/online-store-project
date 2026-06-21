# Charivna Craft — Design & Content Roadmap

* **ChatGPT-проєкт:** Charivna Design & Контент
* **Останнє оновлення:** 2026-06-21
* **Пов’язані документи:** [`MASTER_PLAN.md`](./MASTER_PLAN.md), [`DECISIONS.md`](./DECISIONS.md), [`WORKFLOW.md`](./WORKFLOW.md)

## Основні цілі

* Єдиний візуальний стиль.
* Довіра до бренду.
* Правдиве представлення товару.
* Читабельний блог.
* Якісні мобільні сторінки.
* Оптимізовані зображення.
* Краща конверсія.

## Next actions

### 1. ⏭ Блог і статті

Провести дизайн-аудит:

* ширина текстової колонки;
* font size;
* line height;
* H1;
* H2;
* H3;
* абзаци;
* списки;
* цитати;
* таблиці;
* відступи;
* breadcrumbs;
* author/date block;
* tags/categories;
* table of contents;
* CTA;
* related articles;
* mobile layout;
* accessibility;
* contrast;
* keyboard navigation.

### 2. ⏭ Шаблон статті

Запроєктувати reusable layout:

1. breadcrumbs;
2. category/tag;
3. H1;
4. короткий вступ;
5. author/editor/date;
6. hero image;
7. table of contents;
8. article content;
9. supporting images;
10. CTA або релевантні товари;
11. author/editor bio;
12. related articles;
13. footer/navigation.

Шаблон має дозволяти додавати нову статтю без ручного створення дизайну кожного разу.

### 3. ⏭ Сторінка списку статей

Перевірити:

* картки;
* співвідношення сторін зображень;
* назви;
* excerpt;
* категорії;
* дату;
* автора;
* hover/focus;
* pagination;
* mobile grid;
* empty/loading/error states.

### 4. ⏭ Авторський блок

Підготувати дизайн для:

* фото;
* ім’я;
* роль;
* коротка біографія;
* author page link;
* reviewed by;
* дата оновлення.

### 5. 🔍 Related articles

Порівняти:

* slider;
* grid із трьох карток;
* mobile swipe;
* релевантні статті;
* останні статті як fallback.

Обрати рішення після перевірки UX і performance.

### 6. ⏭ Фото товарів

Правила:

* товар має відповідати реальному виробу;
* зберігати форму, колір, текстуру;
* показувати нитки й шви там, де вони реально помітні;
* правильно відображати закінчення шнура;
* не приховувати конструктивні деталі;
* не створювати оманливу «ідеальну» версію;
* оновлювати фото поступово;
* створювати lifestyle photos без зміни самого товару.

### 7. ⏭ Зображення для статей

* Релевантність темі.
* Єдиний стиль.
* Без випадкових stock clichés.
* Responsive sizes.
* WebP/AVIF, якщо підтримується.
* Compression.
* Meaningful alt.
* Social sharing crop.
* Mobile crop.

### 8. 🔍 Інші дизайн-задачі

* Аудит каталогу.
* Картки товарів.
* Status labels.
* Фільтри.
* Cart.
* Checkout.
* Trust blocks.
* Buttons.
* Forms.
* 404.
* Footer/header consistency.

## Найближчий порядок

1. ⏭ Аудит BlogList.
2. ⏭ Аудит ArticlePage.
3. ⏭ Wireframe шаблону статті.
4. ⏭ Author block.
5. ⏭ Related articles.
6. ⏭ Mobile review.
7. ⏭ Image guidelines.
8. 🟡 Реалізація окремим PR після погодження.

## Completed

* ✅ Зафіксовано правила правдивого представлення товарів на фото.
* ✅ Зафіксовано потребу в reusable шаблоні статті.
* ✅ Зафіксовано дизайн-напрями для BlogList, ArticlePage, author block і related articles.

## Deferred

* 🧊 Повний redesign магазину без окремого погодження.
* 🧊 Масові заміни товарних фото без поетапного review.
* 🧊 Зміни checkout UI без узгодження з технічним і комерційним напрямами.
