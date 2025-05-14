import fs from 'fs';
import path,{ dirname, } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

async function cleanDirectoryOrCreateOne(dirPath){ // be carefull
  const dirP = path.resolve(__dirname, dirPath);
 try{
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

//fs.mkdirSync(dirP);
} else {
  console.log('The directory does NOT exist. will be creacted');
  fs.mkdirSync(dirP);
  console.log(`Directory "${dirP}" created successfully.`);
}

}catch(err){
  console.error(err)
}
}

// directory content will be deleted if die exist or ne one will be created
cleanDirectoryOrCreateOne('../dist/')
