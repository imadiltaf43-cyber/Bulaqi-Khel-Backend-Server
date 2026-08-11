const http = require('http');

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhNTlmYmQ0YWFiZjcwNzdjMDU2NWMyYSIsInJvbGUiOiJTdXBlciBBZG1pbiIsImlhdCI6MTc4NDYzODMwNiwiZXhwIjoxNzg0NjM5MjA2fQ.wkqIh5o4p3VPAhRtuqPII_Ar8PRV1MaFL-13ntQBxWA';
const boundary = '----boundary';

const parts = [
  '--' + boundary,
  'Content-Disposition: form-data; name="fullName"',
  '',
  'Test Investor',
  '--' + boundary,
  'Content-Disposition: form-data; name="email"',
  '',
  'test@example.com',
  '--' + boundary,
  'Content-Disposition: form-data; name="companyName"',
  '',
  'Test Co',
  '--' + boundary,
  'Content-Disposition: form-data; name="investorType"',
  '',
  'Individual',
  '--' + boundary,
  'Content-Disposition: form-data; name="phone"',
  '',
  '123',
  '--' + boundary,
  'Content-Disposition: form-data; name="country"',
  '',
  'PK',
  '--' + boundary,
  'Content-Disposition: form-data; name="city"',
  '',
  'Islamabad',
  '--' + boundary,
  'Content-Disposition: form-data; name="address"',
  '',
  'Test',
  '--' + boundary,
  'Content-Disposition: form-data; name="investmentAmount"',
  '',
  '1000',
  '--' + boundary,
  'Content-Disposition: form-data; name="investmentCategory"',
  '',
  'Mining',
  '--' + boundary,
  'Content-Disposition: form-data; name="ownershipPercentage"',
  '',
  '10',
  '--' + boundary,
  'Content-Disposition: form-data; name="investmentDate"',
  '',
  '2026-07-21',
  '--' + boundary,
  'Content-Disposition: form-data; name="status"',
  '',
  'Active',
  '--' + boundary,
  'Content-Disposition: form-data; name="remarks"',
  '',
  'Test',
  '--' + boundary,
  'Content-Disposition: form-data; name="logo"',
  '',
  '',
  '--' + boundary + '--',
  ''
];

const body = parts.join('\r\n');

const req = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/api/investors',
  method: 'POST',
  headers: {
    Authorization: 'Bearer ' + token,
    'Content-Type': 'multipart/form-data; boundary=' + boundary,
    'Content-Length': Buffer.byteLength(body)
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('status', res.statusCode);
    console.log(data);
  });
});

req.on('error', (err) => {
  console.error(err);
  process.exit(1);
});

req.write(body);
req.end();
