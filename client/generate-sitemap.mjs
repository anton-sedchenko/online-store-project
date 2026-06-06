import fs from "fs";

const SITE_URL = "https://charivna-craft.com.ua";
const API_URL = process.env.VITE_APP_API_URL || "";

if (!API_URL) {
    console.error("❌ Не знайдено VITE_APP_API_URL. Перевір client/.env");
    process.exit(1);
}

const staticPages = [
    {
        url: "/",
        changefreq: "weekly",
        priority: "1.0",
    },
    {
        url: "/contacts",
        changefreq: "monthly",
        priority: "0.6",
    },
    {
        url: "/delivery-payment",
        changefreq: "monthly",
        priority: "0.6",
    },
    {
        url: "/return-policy",
        changefreq: "monthly",
        priority: "0.5",
    },
    {
        url: "/oferta",
        changefreq: "monthly",
        priority: "0.4",
    },
    {
        url: "/privacy",
        changefreq: "monthly",
        priority: "0.4",
    },
    {
        url: "/blog",
        changefreq: "weekly",
        priority: "0.7",
    },
];

function escapeXml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&apos;");
}

function normalizeApiUrl(path) {
    const cleanBase = API_URL.replace(/\/$/, "");
    const baseHasApi = /\/api$/.test(cleanBase);

    if (baseHasApi) {
        return `${cleanBase}${path}`;
    }

    return `${cleanBase}/api${path}`;
}

function urlBlock({ url, changefreq, priority, lastmod }) {
    return `    <url>
        <loc>${escapeXml(SITE_URL + url)}</loc>
        ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}
        <changefreq>${changefreq}</changefreq>
        <priority>${priority}</priority>
    </url>`;
}

async function fetchAllProducts() {
    const limit = 100;
    let page = 1;
    let allProducts = [];
    let total = 0;

    do {
        const url = normalizeApiUrl(`/product?page=${page}&limit=${limit}`);
        console.log(`Завантажую товари: ${url}`);

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Помилка API товарів: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        const rows = Array.isArray(data.rows)
            ? data.rows
            : Array.isArray(data)
                ? data
                : [];

        total = data.count || rows.length;

        allProducts = [...allProducts, ...rows];
        page += 1;
    } while (allProducts.length < total);

    return allProducts;
}

async function generateSitemap() {
    const today = new Date().toISOString().split("T")[0];

    const products = await fetchAllProducts();

    const productPages = products
        .filter((product) => product.slug)
        .map((product) => ({
            url: `/product/${product.slug}`,
            changefreq: "weekly",
            priority: "0.8",
            lastmod: product.updatedAt
                ? new Date(product.updatedAt).toISOString().split("T")[0]
                : today,
        }));

    const pages = [
        ...staticPages.map((page) => ({
            ...page,
            lastmod: today,
        })),
        ...productPages,
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(urlBlock).join("\n")}
</urlset>
`;

    fs.writeFileSync("./public/sitemap.xml", sitemap, "utf8");

    console.log(`✅ sitemap.xml створено. Сторінок: ${pages.length}`);
    console.log(`📄 Шлях: client/public/sitemap.xml`);
}

generateSitemap().catch((error) => {
    console.error("❌ Не вдалося створити sitemap.xml");
    console.error(error);
    process.exit(1);
});