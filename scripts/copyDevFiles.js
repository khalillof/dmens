import fs from 'fs';
import path,{ dirname, } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

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