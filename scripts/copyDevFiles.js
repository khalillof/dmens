const path = require('path');
const fs = require('fs');

async function copyFile(file,to='../dist/') {
  const srcPath = path.resolve(__dirname, file);
  const distPath = path.resolve(__dirname, to, path.basename(file));

  fs.copyFileSync(srcPath, distPath);
}

async function run (){
  //await copyFile('../src/models/lib/az-config.json','../dist/models/lib/');
  await copyFile('../src/services/seeds.json','../dist/services/');
  await copyFile('../.env.test');

  console.log('successfully copied dev files')
}

run();