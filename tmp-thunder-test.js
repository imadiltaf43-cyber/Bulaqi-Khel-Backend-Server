const http = require('http');
const fs = require('fs');
const path = require('path');

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IjZhNTlmYmQ0YWFiZjcwNzdjMDU2NWMyYSIsInJvbGUiOiJTdXBlciBBZG1pbiIsImlhdCI6MTc4NTE1NDU0MCwiZXhwIjoxNzg1MTU1NDQwfQ.nErP-7RE848MHhB3PDsFmM9p55PNaCXTx8NDZKSIccg';
const boundary = '----boundary-thunder';
const filePath = path.join(__dirname, 'tmp-thunder.png');
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQABAA4N3wz/AAAAAElFTkSuQmCC', 'base64');
fs.writeFileSync(filePath, png);

const body = [
  `--${boundary}`,
  'Content-Disposition: form-data; name="projectName"',
  '',
  'Thunder Project',
  `--${boundary}`,
  'Content-Disposition: form-data; name="category"',
  '',
  'Mining',
  `--${boundary}`,
  'Content-Disposition: form-data; name="description"',
  '',
  'Created from thunder-style request',
  `--${boundary}--`,
  ''
].join('\r\n');

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
    console.log('STATUS', res.statusCode);
    console.log('HEADERS', JSON.stringify(res.headers, null, 2));
    console.log('BODY', data);
    fs.unlinkSync(filePath);
  });
});

req.on('error', (err) => {
  console.error(err);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
});

req.write(body, 'binary');
req.end();
