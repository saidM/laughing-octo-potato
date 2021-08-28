const fs = require('fs');

const [, , token] = process.argv;
if (typeof token === 'undefined') {
  console.log('Missing token');
  return;
}
const content = `BRIDGE_TOKEN=${token}`;

fs.writeFile('.env', content, (err) => {
  if (err) throw err;
  console.log('Installation completed! You can start your bridge by running: npm start adminplus');
});
