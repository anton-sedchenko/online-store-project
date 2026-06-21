# Charivna Craft — Workflow

* **Останнє оновлення:** 2026-06-21
* **Пов’язані документи:** [`MASTER_PLAN.md`](./MASTER_PLAN.md), [`DECISIONS.md`](./DECISIONS.md), [`TECHNICAL_ROADMAP.md`](./TECHNICAL_ROADMAP.md), [`SEO_BLOG_ROADMAP.md`](./SEO_BLOG_ROADMAP.md), [`DESIGN_CONTENT_ROADMAP.md`](./DESIGN_CONTENT_ROADMAP.md), [`AGENTS.md`](../AGENTS.md)

## На початку нового чату

Для `Charivna Головний` читати:

* [`MASTER_PLAN.md`](./MASTER_PLAN.md);
* [`DECISIONS.md`](./DECISIONS.md);
* [`WORKFLOW.md`](./WORKFLOW.md).

Для `Charivna Технічка`:

* [`MASTER_PLAN.md`](./MASTER_PLAN.md);
* [`TECHNICAL_ROADMAP.md`](./TECHNICAL_ROADMAP.md);
* [`DECISIONS.md`](./DECISIONS.md);
* [`WORKFLOW.md`](./WORKFLOW.md);
* [`AGENTS.md`](../AGENTS.md).

Для `Charivna SEO і Блог`:

* [`MASTER_PLAN.md`](./MASTER_PLAN.md);
* [`SEO_BLOG_ROADMAP.md`](./SEO_BLOG_ROADMAP.md);
* [`DECISIONS.md`](./DECISIONS.md);
* [`WORKFLOW.md`](./WORKFLOW.md).

Для `Charivna Design & Контент`:

* [`MASTER_PLAN.md`](./MASTER_PLAN.md);
* [`DESIGN_CONTENT_ROADMAP.md`](./DESIGN_CONTENT_ROADMAP.md);
* [`DECISIONS.md`](./DECISIONS.md);
* [`WORKFLOW.md`](./WORKFLOW.md).

## Для кожної задачі

1. Уточнити scope.
2. Перевірити відповідний roadmap.
3. Перевірити залежності з іншими напрямами.
4. Отримати підтвердження користувача.
5. Створити окрему задачу Codex.
6. Створити feature branch.
7. Створити PR.
8. Перевірити diff.
9. Перевірити Preview/staging.
10. Merge лише після підтвердження.
11. Перевірити production.
12. Синхронізувати staging.
13. Оновити roadmap/status/decision log.

## Документування

Після завершення задачі:

* перемістити її у Completed;
* додати PR;
* зафіксувати нове рішення;
* оновити «Next»;
* не дублювати деталі в усіх документах;
* master містить summary, roadmap містить деталі.

## Конфлікти

Якщо технічна, SEO або дизайн-задача впливає на інший напрям:

* не виконувати мовчки;
* описати залежність;
* погодити scope;
* оновити обидва відповідні roadmap лише після рішення.

## Completed

* ✅ Зафіксовано базовий workflow для чотирьох ChatGPT-проєктів.
* ✅ Зафіксовано правило: merge і production verification не виконуються автоматично.

## Next actions

* ⏭ Під час наступних задач підтримувати roadmap/status/decision log актуальними.
* ⏭ У PR явно вказувати, якщо зміни впливають на затверджений план.

## Deferred

* 🧊 Автоматизація повного release workflow без ручного підтвердження.
