import { exec } from 'child_process';


const ccmd = '';

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
