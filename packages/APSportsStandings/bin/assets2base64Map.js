const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../assets/img');

const base64Encode = file =>
  Buffer.from(fs.readFileSync(file)).toString('base64');

const imgStart = 'data:image/png;base64,';

fs.readdir(dir, (er, files) => {
  if (er) {
    console.error('Could not list the directory.', er);
    process.exit(1);
  }

  const imageMap = {};

  files.forEach(file => {
    const imagePath = path.join(dir, file);
    const fileParts = file.split('.');
    const ext = fileParts.pop();
    const assetName = fileParts.join('.');

    if (ext === 'png') {
      imageMap[assetName] = { uri: imgStart + base64Encode(imagePath) };
    }
  });

  fs.writeFile(
    path.join(__dirname, '../assets/map.json'),
    JSON.stringify(imageMap, null, 2),
    { encoding: 'utf8', flag: 'w' },
    err => {
      if (err) {
        console.error('Could not write assets file.', err);
        process.exit(1);
      }

      console.log('Assets encoded!');
    }
  );
});
