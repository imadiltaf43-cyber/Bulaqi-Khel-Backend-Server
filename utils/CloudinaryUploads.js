const cloudinary = require("../config/cloudinary");
const fs = require("fs");

const uploadFiles = async (files, folder) => {
  const uploaded = [];

  if (!files || files.length === 0) return uploaded;

  for (const file of files) {
    const resourceType =
      file.mimetype === "application/pdf"
        ? "raw"
        : "image";

    const result = await cloudinary.uploader.upload(file.path, {
      folder,
      resource_type: resourceType,
    });

    uploaded.push({
      url: result.secure_url,
      public_id: result.public_id,
      resource_type: result.resource_type,
    });

    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
  }

  return uploaded;
};

const deleteFiles = async (files = []) => {
  if (!files.length) return;

  for (const file of files) {
    if (!file.public_id) continue;

    await cloudinary.uploader.destroy(file.public_id, {
      resource_type: file.resource_type || "image",
    });
  }
};

module.exports = {
  uploadFiles,
  deleteFiles,
};