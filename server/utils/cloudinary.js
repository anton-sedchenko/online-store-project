const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

function extractPublicId(url) {
    try {
        const parts = url.split('/');
        const fileWithExt = parts.pop();
        const folder = parts.pop();
        const publicId = `${folder}/${fileWithExt.split('.')[0]}`;
        return publicId;
    } catch {
        return null;
    }
}

module.exports = {
    cloudinary,
    extractPublicId
};
