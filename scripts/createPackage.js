
import fs from 'fs';
import path,{ dirname, } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));


//const glob = require('glob');

async function cleanDirectoryOrCreateOne(dirPath){ // be carefull
  const dirP = path.resolve(__dirname, dirPath);

 if (fs.existsSync(dirP)) {

    console.log('found dir will be empty :',dirP)
    // Synchronous deletion
  
   fs.rm(dirP, { recursive: true},(err)=>{
    if(err){
     throw err
    }else{
      console.log('dir deleted and new one will be created :')
       fs.mkdirSync(dirP);
    }
  
   });
  
 console.log('Directory cleaned successfully.');

} else {
  console.log('The directory does NOT exist. will be creacted');
  fs.mkdirSync(dirP);
  console.log(`Directory "${dirP}" created successfully.`);
}

}

async function copyFile(file,to='../dist/') {
  const srcPath = path.resolve(__dirname, file);
  const distPath = path.resolve(__dirname, to, path.basename(file));

  fs.copyFileSync(srcPath, distPath);
}
// copy files from src to dis
async function copyDirectory(dirPath) {
  const srcDir = path.resolve(__dirname, dirPath);
  const destDir = path.resolve(__dirname, '../dist/');

  try {
    fs.cpSync(srcDir, destDir, { recursive: true });
    console.log('Success! Directory copied.');
    // debug only
    //console.log(`Copyied files src : ${srcDir} , >>> To dist : ${destDir}`);
} catch (err) {
    console.error(err);
}
}

//function typescriptCopy(from, to) {
//  const files = glob.sync('**/*.d.ts', { cwd: from });
//  const cmds = files.map(file => fs.copyFile(path.resolve(from, file), path.resolve(to, file)));
//  return Promise.all(cmds);
//}

async function createPackageFile() {

  const packageData = fs.readFileSync(path.resolve(__dirname, '../package.json'), 'utf8');
  const { jest, scripts, devDependencies, ...packageDataOther } = JSON.parse(
    packageData,
  );
  const newPackageData = {
    ...packageDataOther,
    main: './index.js',
    module: './es/index.js',
    private: false,
  };
  const distPath = path.resolve(__dirname, '../dist/package.json');

  fs.writeFileSync(distPath, JSON.stringify(newPackageData, null, 2), 'utf8');
  console.log(`Created package.json in ${distPath}`);

  return newPackageData;
}

async function prepend(file, string) {
  const data = fs.readFileSync(file, 'utf8');
  fs.writeFileSync(file, string + data, 'utf8');
}

async function addLicense(packageData) {
  const license = `/** @license ${packageData.name} v${packageData.version}
 *
 * This source code is licensed under the ${packageData.license} license found in the
 * LICENSE file in the root directory of this source tree.
 */
`;

 // await Promise.all(
 //   [
 //     //'../dist/cjs/index.js',
 //     '../dist-ts/index.js',
 //   ].map(file => prepend(path.resolve(__dirname, file), license)),
 // );

}

async function deleteSecretsFiles(){
    // delete .env.test or .env if found
    const envPath = path.resolve(__dirname, '../dist/.env');
    const env_testPath = path.resolve(__dirname, '../dist/.env.test');

 for ( let f of [envPath,env_testPath]){

      if (fs.existsSync(f)) {
        console.log('enviroments file found : ',f)
     // Synchronous deletion of file
      fs.rmSync(f);
   }
  }
  console.log('successfully cleaned enviroments files')
}
async function run() {
  // directory content will be deleted if die exist or ne one will be created
  //await cleanDirectoryOrCreateOne('../dist/')

  //copy dist-ts to dist
 //await copyDirectory('../dist-ts/')

 
 //await copyFile('../src/models/lib/az-config.json','../dist/models/lib/');
 await copyFile('../src/services/seeds.json','../dist/services/');
 
 let addFiles = ['../README.md', '../CHANGELOG.md', '../LICENSE.md'];

 // add extra files
  await Promise.all(addFiles.map(file => copyFile(file))).then(()=> console.log('successfully copied',addFiles));


  const packageData = await createPackageFile();
  await addLicense(packageData);

  // TypeScript - We don't have any typescript definitions yet, but if someone wants to add them, this will make our life easier.
 /**
  const from = path.resolve(__dirname, '../src');
  await Promise.all([
    typescriptCopy(from, path.resolve(__dirname, '../dist')),
    typescriptCopy(from, path.resolve(__dirname, '../dist/es')),
  ]);
  **/

}

run();
