"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = uploadImage;
exports.generateSignedUrl = generateSignedUrl;
exports.base64 = base64;
const cloudinary = require("cloudinary").v2;
const uuid_1 = require("uuid"); // ✅ static import
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});
const FOLDER_MAP = {
    "1": "book",
    "2": "background",
    "3": "Artwork",
    "4": "AI_images",
};
/**
 * Upload ảnh (avatar, background, artwork)
 * Nếu Artwork → lưu 2 bản (Artwork, previews)
 */
async function uploadImage(base64, type, isBuy) {
    const folderName = FOLDER_MAP[String(type)];
    if (!folderName)
        throw new Error("Invalid type");
    const uniqueFileName = (0, uuid_1.v4)();
    if (type === 1 || type === 2 || type === 4) {
        return await cloudinary.uploader.upload(base64, {
            folder: folderName,
            public_id: uniqueFileName,
            overwrite: true,
            resource_type: "image",
        });
    }
    if (type === 3) {
        const image = await cloudinary.uploader.upload(base64, {
            folder: "Artwork",
            public_id: uniqueFileName,
            overwrite: true,
            resource_type: "image",
        });
        let preview = "";
        if (isBuy) {
            // Ảnh preview (có watermark)
            let preImage = await cloudinary.uploader.upload(base64, {
                folder: "previews",
                public_id: uniqueFileName,
                overwrite: true,
                resource_type: "image",
                transformation: [
                    {
                        overlay: "arthubIcon",
                        gravity: "center",
                        flags: "relative",
                        width: 0.5,
                        opacity: 36,
                        crop: "scale",
                    },
                ],
            });
            preview = preImage;
        }
        return { image, preview };
    }
}
function generateSignedUrl(publicId) {
    return cloudinary.utils.private_download_url(publicId, "jpg", {
        type: "private",
        expires_at: Math.floor(Date.now() / 1000) + 60,
    });
}
function base64(filePath) {
    let base64;
    if (filePath === null || filePath === "") {
        throw new Error("File path is empty");
    }
    else {
        base64 = `data:image/jpeg;base64${Buffer.from(filePath).toString("base64")}`;
        return base64;
    }
}
