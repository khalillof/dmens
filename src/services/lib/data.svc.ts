
import mongoose from 'mongoose';
import {appData, envs,asyncCallback} from '../../common';
import seeds from '../seeds.json' ;
import {posts} from './posts.js'
import {  init_models} from '../../models';

/////////////////
const dbOptions = {
  //rejectUnauthorized: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  //retryWrites: false
};

export async function dbInit() {
    try {

      envs.logLine('db connction string :' + envs.databaseUrl());

      await mongoose.connect(envs.databaseUrl())
      console.log("Successfully Connected to db!");

      // Create Configration - Account - default directory  db models and routes
    await  init_models()

     envs.logLine(`Numbers of models on the database are : ${appData.size}`);

    } catch (err: any) {
      console.error(err);
      process.exit(1);
    }
}

export class ClientSeedDatabase {

    async init(dev=envs.isDevelopment) {
        envs.logLine('started database seeding ..!');
       if(dev){
        await this.addAccounts();
        await this.addCateories();
        await this.addContacts();
        await this.addmessages();
        await this.addPosts();
        await this.addComments(); 
       }else{
        await this.addAccounts();
       }
        envs.logLine('finished database seeding ..!');
    }
    accountsCache: any[] = [];


    async addAccounts() {
        this.saver('account', seeds.accounts)
    }

    async addContacts() {
        return await this.saver('contact', seeds.contacts)
    }
    async addCateories() {
        return await this.saver('category', seeds.categories);
    }

    async addPosts() {

        const [authors_Ids, catIds] = await Promise.all([this.getUsersIDs(), this.getIDs('category')])
        let ppps = posts;
        if (authors_Ids && catIds) {
            // loop over userids
            this.loopOverSequence(authors_Ids.length, ppps.length, (IDindex: number, itemIndex: number) => {
                ppps[itemIndex].author = authors_Ids![IDindex];
                ppps[itemIndex].publisheDate = new Date()
            })
            // loop over category ids
            this.loopOverSequence(catIds.length, ppps.length, (IDindex: number, itemIndex: number) => {
                ppps[itemIndex].category = catIds![IDindex];
            })
        } else {
            console.log('post seed did not succeed no authors ids or categoty ids')
        }
        await this.saver('post', ppps)

    }

    async addComments() {
        const [authors_ids, posts_ids] = await Promise.all([this.getUsersIDs(), this.getIDs('post')])

        let comments = seeds.comments
        if (authors_ids && posts_ids) {
            // loop over autherIds
            this.loopOverSequence(authors_ids.length, comments.length, (IDindex: number, itemIndex: number) => {
                comments[itemIndex].user = authors_ids![IDindex];
            })
            // loop over post ids
            this.loopOverSequence(posts_ids.length, comments.length, (IDindex: number, itemIndex: number) => {
                comments[itemIndex].modelid = posts_ids[IDindex]
            })


        } else {
            console.log('comments seed did not succeed no authors or posts')
        }

        await this.saver('comment', comments);
    }

    addmessages() {
        return new Promise(async (resolve) => {
            let authors_ids = await this.getUsersIDs();

            let mms = seeds.messages;
            this.loopOverSequence(authors_ids.length, seeds.messages.length, (IDindex: number, itemIndex: number) => {

                mms[itemIndex].recipient = authors_ids![IDindex];
                mms[itemIndex].sender = authors_ids![IDindex];
                //return ms
            })
            resolve(await this.saver('message', mms))
        })
    }


    countDb(dbName: string, callback: asyncCallback) {
        return new Promise(async (resolve) => {
            let Db = mongoose.models[dbName]!;
            Db.estimatedDocumentCount().then( async (count: number) => {
                if (count === 0) {
                    callback && resolve(await callback(Db))
                } else if(count > 0) {
                    resolve(console.log(dbName + ' : already on database'))
                }
            }).catch((err:any)=> resolve(console.log(err.stack)));
        })
    }
    async getUsersIDs() {
        return this.accountsCache.length ? this.accountsCache.map((d: any) => d._id) : await this.getIDs('account');
    }

    async getIDs(name: string, filter?: {}) {
        return (await mongoose.models[name]?.find(filter!)!).map((md: any) => md._id);
    }

    async saver(dbName: string, objArr: any[]) {
        await this.countDb(dbName, async (db) => {
            await Promise.all(objArr.map(async (obj: any) => await new db(obj).save()))
            console.log('finished seeding ' + dbName)        
        })
    }

    logger(err: any, obj: any) {
        err ? console.log("seed  error :", err) : console.log(`added item to the collection`);
    }

    randomObject(objs: any[]) {
        let len = objs.length
        if (len === 0)
            return objs[0]

        let i = Math.floor(Math.random() * len) + 1;
        return objs[i]
    }

    // infinate loop over sequence of IDs to be maped to length of items length
    loopOverSequence(IdsLen: number, itemsLen: number, callback: Function) {
        let index = 0;
        let itemsIndex = 0;

        if (!IdsLen || !itemsLen || IdsLen === 0 || itemsLen === 0)
            return;

        while (itemsIndex < itemsLen) {
            callback(index, itemsIndex)
            index++
            itemsIndex++

            if (index >= IdsLen)
                index = 0
        }
    }
}