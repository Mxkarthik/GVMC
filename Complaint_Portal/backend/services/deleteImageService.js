const cloudinary = require("../config/cloudinary");

const deleteImage = async (publicId) => {

    if (!publicId) return;

    const result = await cloudinary.uploader.destroy(publicId);
    return result;

};

module.exports = deleteImage;