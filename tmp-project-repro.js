const http = require('http');
const fs = require('fs');
const path = require('path');

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhNTlmYmQ0YWFiZjcwNzdjMDU2NWMyYSIsInJvbGUiOiJTdXBlciBBZG1pbiIsImlhdCI6MTc4NDYzODMwNiwiZXhwIjoxNzg0NjM5MjA2fQ.wkqIh5o4p3VPAhRtuqPII_Ar8PRV1MaFL-13ntQBxWA';
const boundary = '----boundary-test';
const filePath = path.join(__dirname, 'tmp-test.png');
fs.writeFileSync(filePath, Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQABAA4N3wz/AAAAAElFTkSuQmCC', 'base64'));

const fileBuffer = fs.readFileSync(filePath);
const fileName = 'sample.png';
const fileContentType = 'image/png';

const bodyParts = [
  `--${boundary}`,
  'Content-Disposition: form-data; name="projectName"',
  '',
  'Test Project',
  `--${boundary}`,
  'Content-Disposition: form-data; name="category"',
  '',
  'Mining',
  `--${boundary}`,
  'Content-Disposition: form-data; name="description"',
  '',
  'A test project',
  `--${boundary}`,
  'Content-Disposition: form-data; name="gallery"; filename="sample.png"',
  `Content-Type: ${fileContentType}`,
  '',
  fileBuffer.toString('binary'),
  `--${boundary}--`,
  ''
];

const body = bodyParts.join('\r\n');
const req = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/api/projects',
  method: 'POST',
  headers: {
    Authorization: 'Bearer ' + token,
    'Content-Type': `multipart/form-data; boundary=${boundary}`,
    'Content-Length': Buffer.byteLength(body, 'binary')
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('status', res.statusCode);
    console.log(data);
    fs.unlinkSync(filePath);
  });
});

req.on('error', (err) => {
  console.error(err);
  fs.unlinkSync(filePath);
  process.exit(1);
});

req.write(body, 'binary');
req.end();
