import { exec } from 'child_process';


const ccmd = 
` 
envFile=/home/node/app/.env

touch $envFile

cat << EOF > $envFile
PORT=$PORT
NODE_ENV=$NODE_ENV
ADMIN_EMAIL=$ADMIN_EMAIL
ADMIN_USERNAME=$ADMIN_USERNAME
ADMIN_PASSWORD=$ADMIN_USERNAME
SECRET_KEY=$SECRET_KEY
JWT_SECRET=$JWT_SECRET
JWT_EXPIRATION=$JWT_EXPIRATION
JWT_REFRESH_EXPIRATION=$JWT_REFRESH_EXPIRATION
ISSUER=$ISSUER
AUDIENCE=$AUDIENCE
GCP_MAP_API_KEY=$GCP_MAP_API_KEY
DATABASE_URL=$DATABASE_URL
SCHEMA_DIR=$SCHEMA_DIR
IMAGES_UPLOAD_DIR=$IMAGES_UPLOAD_DIR
CORES_DMAINS=$CORES_DMAINS
STATIC_URL=$STATIC_URL
EOF
sleep 2

echo "printing the first two line from the .env file"
head -7 $envFile
`;

execShellAsync(ccmd).then((out)=>{
    console.log('command run successfully ============================')
    console.log(out)
    console.log('======================================================')
});

//execShellAsync(ccmd);


function execShell(cmd:string, options:any) {
    return exec(cmd,options, (error, stdout, stderr) => {
        if (error) {
            console.warn(error);
          } else if (stdout) {
            console.log(stdout); 
          } else {
            console.log(stderr);
          }
          return stdout ? true : false;
    });
}

async function execShellAsync(cmd:string, options={ maxBuffer: 1024 * 500 }) {

    return new Promise((resolve, reject) => {
        exec(cmd, options, (error, stdout, stderr) => {
          if (error) {
            console.warn(error);
          } else if (stdout) {
            console.log(stdout); 
          } else {
            console.log(stderr);
          }
          resolve(stdout ? true : false);
        });
      });
}

async function checkGitExists() {
    return new Promise<boolean>((resolve) => {
        exec('git --version', (err) => resolve(!err));
    });
}

export {execShell, execShellAsync, checkGitExists}
