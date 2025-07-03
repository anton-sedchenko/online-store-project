export const getImageUrl = (img) => {
    if (!img) return "/fallback.jpg";
    const base = import.meta.env.VITE_APP_API_URL;
    return base.endsWith("/")
        ? `${base}static/${img}`
        : `${base}/static/${img}`;
};
