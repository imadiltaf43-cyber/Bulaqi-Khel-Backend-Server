const { uploadFiles } = require('./utils/CloudinaryUploads');
const fs = require('fs');
const path = require('path');

const pngBuffer = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQABAA4N3wz/AAAAAElFTkSuQmCC',
  'base64'
);

(async () => {
  const tmp = path.join(__dirname, 'tmp-test.png');
  fs.writeFileSync(tmp, pngBuffer);

  try {
    const result = await uploadFiles([{ path: tmp }], 'United-Bulaqi-Khel/Test');
    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    console.error('UPLOAD_ERROR');
    console.error(err && err.message);
    console.error(err && err.stack);
  } finally {
    if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
  }
})();
