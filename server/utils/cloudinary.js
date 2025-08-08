const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

function extractPublicId(url) {
    try {
        const u = new URL(url);
        const parts = u.pathname.split('/'); // ["","<res>","upload","v123","folder","img.jpg"]
        const file = parts.pop(); // "img.jpg"
        // забираємо все після "upload" і до файлу як шлях
        const uploadIndex = parts.findIndex(p => p === 'upload');
        const folders = parts.slice(uploadIndex + 2); // пропускаємо "upload","v123"
        return `${folders.join('/')}/${file.split('.')[0]}`.replace(/^\/+/, '');
    } catch {
        return null;
    }
}

module.exports = {
    cloudinary,
    extractPublicId
};
