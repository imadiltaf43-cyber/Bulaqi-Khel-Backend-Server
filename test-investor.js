const Investor = require('./models/Investor');

async function main() {
  const doc = new Investor({
    fullName: 'Test',
    email: 'test@example.com',
    investmentDate: '',
    investmentAmount: '',
    ownershipPercentage: ''
  });

  try {
    await doc.save();
    console.log('saved');
  } catch (err) {
    console.log('name:', err.name);
    console.log('message:', err.message);
    console.log('errors:', JSON.stringify(err.errors, null, 2));
  }
}

main();
