"use strict";
const mongoose =require('mongoose');
const { config } =require('../../bin/config');
const { loadJsons }=require('../../models/load.jsons');
/////////////////
const dbOptions ={
      rejectUnauthorized: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      //useFindAndModify : false, // are not supported any more
      //useCreateIndex : true, // are not supported any more

    };

 async function dbInit(){
  console.log("=========== db initiation started ===============")
 await dbConnect(config.mongoUrl.dev,dbOptions).then( async ()=>{

  return await loadJsons().then((data) => {
    console.log('total models : ' + data.length);

  }).catch((err) => {
    console.error(err);
  });
 });

 return await Promise.resolve(console.log("=========== db initiation finished ==============="))
}
async function dbConnect (dbURL, options){
  mongoose.connect(dbURL, options); 
  mongoose.connection
  .on('error', error => console.log(error) )
  .on('open', () => console.log("Successfully Connected to db!"));
   mongoose.Promise = global.Promise;

  return await Promise.resolve(console.log('db connection established'))
}

//=================================================================
async function dbConnectWithReTry (dbURL, options) {
  var db = await mongoose.createConnection(dbURL, options);

  db.on('error', function (err) {
      // If first connect fails because mongod is down, try again later.
      // This is only needed for first connect, not for runtime reconnects.
      // See: https://github.com/Automattic/mongoose/issues/5169
      if (err) {
          console.log(new Date(), String(err));

          // Wait for a bit, then try to connect again
          setTimeout(function () {
              console.log("Retrying first connect...");
              db.openUri(dbURL).catch(() => {});
              // Why the empty catch?
              // Well, errors thrown by db.open() will also be passed to .on('error'),
              // so we can handle them there, no need to log anything in the catch here.
              // But we still need this empty catch to avoid unhandled rejections.
          }, 3 * 1000);

      } else {
          // Some other error occurred.  Log it.
          console.error(new Date(), String(err));
      }
  });

  db.once('open', function () {
      console.log("Connection to db established.");
  });

  return db;
}


exports.dbInit = dbInit;

