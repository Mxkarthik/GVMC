const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const uploadImage = async (
    file,
    {
        folder = "portfolio-cms",
        transformation = [],
    } = {}
) => {
    return new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                transformation,
            },
            (error, result) => {

                if (error) {
                    return reject(error);
                }

                resolve({
                    url: result.secure_url,
                    publicId: result.public_id,
                    width: result.width,
                    height: result.height,
                    format: result.format,
                    bytes: result.bytes,
                });

            }
        );

        streamifier
            .createReadStream(file.buffer)
            .pipe(stream);

    });
};

module.exports = uploadImage;