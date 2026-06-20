# Charivna Craft — Repository Instructions

## Project overview

Charivna Craft is a Ukrainian e-commerce website for handmade cord products.

Main stack:

* Frontend: React, Vite, React Router, MobX, React-Bootstrap, SCSS
* Backend: Node.js, Express, Sequelize, PostgreSQL
* Frontend hosting: Vercel
* Backend and database hosting: Railway
* Production domain: https://charivna-craft.com.ua

The repository contains:

* `client/` — frontend
* `server/` — backend
* `client/vercel.json` — Vercel rewrites and redirects
* backend routes for `/gmc.xml`, `/rozetka.xml`, and `/sitemap.xml`

## General working rules

1. Read the relevant files and understand the existing implementation before editing.
2. Make the smallest safe change that fully solves the task.
3. Do not refactor unrelated code.
4. Do not rename, move, or delete unrelated files.
5. Preserve the current coding style and formatting.
6. Do not introduce new dependencies unless they are clearly necessary.
7. Do not expose secrets, tokens, database credentials, or environment variables.
8. Do not edit production data directly.
9. Do not run destructive database commands.
10. Do not merge directly into `main`.
11. Do not deploy directly to production.
12. Create changes in a separate branch and prepare a pull request for review.
13. Clearly list all changed files and explain every meaningful change.
14. If requirements are ambiguous or the change may affect production data, feeds, routing, orders, authentication, or payments, stop and ask for confirmation.

## Required checks

For frontend changes, run:

```bash
cd client
npm run lint
npm run build
```

For backend changes:

* verify that the server starts;
* verify the relevant route or endpoint;
* check the health endpoint where possible;
* report if no automated test or lint command exists.

Before completing work, verify that unrelated files were not changed.

## SEO requirements

Every new public SEO page must have:

* a unique `<title>`;
* a unique meta description;
* one clear `<h1>`;
* a self-referencing canonical URL;
* meaningful visible text;
* correct internal links;
* an appropriate robots directive;
* relevant structured data where applicable;
* inclusion in the sitemap when the page should be indexed.

Avoid creating pages that compete for the same search intent.

Do not copy `Product` structured data to category or landing pages. Use suitable schema types such as:

* `CollectionPage`
* `ItemList`
* `BreadcrumbList`
* `FAQPage`, only when the FAQ is visible on the page
* `BlogPosting`, for articles

Unknown, removed, or unavailable product pages must not display a fake product with a zero price. Their visible page must be treated as not found and use `noindex, nofollow`.

## Routing requirements

React routes are defined in:

* `client/src/routes.js`
* `client/src/components/AppRouter.jsx`
* route constants may be defined in `client/src/utils/consts.js`

When adding a new public route:

1. add the route consistently;
2. check direct navigation and browser refresh;
3. check the Vercel SPA fallback;
4. add the page to the sitemap when it should be indexed;
5. verify that the route does not interfere with `/gmc.xml`, `/rozetka.xml`, `/sitemap.xml`, product routes, blog routes, or password reset routes.

Preserve the order of specific Vercel rewrites before the catch-all SPA rewrite.

## Marketplace feed safety

Changes to the following product fields may affect Google Merchant Center or Rozetka:

* slug
* title
* description
* price
* availability
* images
* category
* brand
* product code
* Rozetka category ID
* marketplace parameters

Before changing any of these:

1. inspect `/gmc.xml`;
2. inspect `/rozetka.xml`;
3. preserve valid product URLs;
4. add a permanent redirect when an indexed product slug changes;
5. do not add discontinued product categories back to the feeds.

Do not change feed filtering or marketplace mappings unless the task explicitly requires it.

## Database safety

Never:

* delete products directly from production without explicit approval;
* modify production records as part of a code task;
* run broad `UPDATE`, `DELETE`, `DROP`, `TRUNCATE`, or destructive migration commands;
* assume that staging and production databases contain the same data.

For schema changes:

1. explain the migration;
2. describe rollback steps;
3. test against staging first;
4. wait for approval before production deployment.

## Deployment workflow

Preferred workflow:

1. start from the latest `main`;
2. create a dedicated feature branch;
3. implement only the approved task;
4. run available checks;
5. inspect the final diff;
6. create a pull request;
7. provide a summary and testing checklist;
8. wait for human review and approval;
9. do not merge or deploy automatically.

For backend or database changes, staging verification is required before production.

## Current product logic

The main catalog currently loads products and applies some filtering and pagination on the frontend.

Do not replace this logic during an unrelated task.

A future planned improvement is to move scalable filtering and pagination to the backend and expose useful filter state through URLs.

## Communication format

At the end of every coding task, report:

1. Summary
2. Changed files
3. Checks performed
4. Results
5. Manual testing steps
6. Risks or limitations
7. Whether a pull request was created

If checks fail, do not hide the failure. Explain the exact reason.
