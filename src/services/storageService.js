const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

export const uploadFile = (file, path, onProgress) => {
  return new Promise((resolve, reject) => {
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      reject(new Error('Cloudinary configuration is missing in .env'));
      return;
    }

    const xhr = new XMLHttpRequest();
    xhr.open('POST', CLOUDINARY_URL, true);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        const progress = (e.loaded / e.total) * 100;
        onProgress(progress);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response.secure_url);
        } catch (err) {
          reject(new Error('Failed to parse Cloudinary response'));
        }
      } else {
        reject(new Error(`Cloudinary Upload Failed: ${xhr.responseText}`));
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network error during upload to Cloudinary. Check your adblocker or connection.'));
    };

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    // Organize images into folders matching the original Firebase path structure
    formData.append('folder', `dakshayani/${path.split('/')[0]}`);

    xhr.send(formData);
  });
};

export const deleteFile = async (url) => {
  // Cloudinary requires authenticated backend signatures to delete images.
  // For a frontend-only app using unsigned uploads, deletion is typically a no-op 
  // or deferred. Storage space on Cloudinary is generous.
  console.log('Skipping cloudinary image deletion from frontend to ensure security: ', url);
  return Promise.resolve();
};

export const uploadProductImages = async (files, productId, onProgress) => {
  const urls = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const path = `products/${productId}/${Date.now()}_${file.name}`;
    const url = await uploadFile(file, path, (p) => {
      if (onProgress) onProgress(((i / files.length) * 100) + (p / files.length));
    });
    urls.push(url);
  }
  return urls;
};

export const uploadCategoryImage = async (file, categoryId) => {
  const path = `categories/${categoryId}/${Date.now()}_${file.name}`;
  return await uploadFile(file, path);
};

export const uploadGalleryPhoto = async (file) => {
  const path = `gallery/${Date.now()}_${file.name}`;
  return await uploadFile(file, path);
};

export const uploadOfferBanner = async (file, offerId) => {
  const path = `offers/${offerId}/${Date.now()}_${file.name}`;
  return await uploadFile(file, path);
};
