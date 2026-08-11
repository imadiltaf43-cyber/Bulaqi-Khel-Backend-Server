const http = require('http');

const payload = JSON.stringify({
  email: 'unitedbulaqikhelenterprises1@gmail.com',
  password: 'ubkeadmin1122'
});

const req = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload)
  }
}, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('status', res.statusCode);
    console.log(data);
  });
});

req.on('error', (err) => {
  console.error(err);
});

req.write(payload);
req.end();
