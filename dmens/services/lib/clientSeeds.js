import { dbStore } from '../../common/index.js';
import seeds from '../seeds.json' assert { type: 'json' };
export class ClientSeedDatabase {
    async init() {
        console.log('started database seeding ...................................!');
        await this.addRoles(),
            await this.addCateories(),
            await this.addAccounts(),
            await this.addContacts();
        await this.addmessages();
        await this.addPosts();
        await this.addComments();
        console.log('finished database seeding ...................................!');
    }
    accountsCache = [];
    async addRoles() {
        await this.saver('role', seeds.roles);
    }
    async addAccounts() {
        await this.countDb('account', async (Db) => {
            const roles = await dbStore['role'].model.find({ name: { $in: ["admin", "user"] } });
            if (roles) {
                await Promise.all(seeds.accounts.map(async (account) => {
                    account.roles = roles;
                    let ut = await Db.model.register(account, "password");
                    this.accountsCache.push(ut);
                }));
                console.log('finished seeding accounts');
            }
            else {
                console.log(' roles are not ready for accounts creations');
            }
        });
    }
    async addContacts() {
        return await this.saver('contact', seeds.contacts);
    }
    async addCateories() {
        return await this.saver('category', seeds.categories);
    }
    async addPosts() {
        const [authors_Ids, catIds] = await Promise.all([this.getUsersIDs(), this.getIDs('category')]);
        let ppps = seeds.posts;
        if (authors_Ids && catIds) {
            // loop over userids
            this.loopOverSequence(authors_Ids.length, ppps.length, (IDindex, itemIndex) => {
                ppps[itemIndex].author = authors_Ids[IDindex];
                ppps[itemIndex].publisheDate = new Date();
            });
            // loop over category ids
            this.loopOverSequence(catIds.length, ppps.length, (IDindex, itemIndex) => {
                ppps[itemIndex].category = catIds[IDindex];
            });
        }
        else {
            console.log('post seed did not succeed no authors ids or categoty ids');
        }
        await this.saver('post', ppps);
    }
    async addComments() {
        const [authors_ids, posts_ids] = await Promise.all([this.getUsersIDs(), this.getIDs('post')]);
        let comments = seeds.comments;
        if (authors_ids && posts_ids) {
            // loop over autherIds
            this.loopOverSequence(authors_ids.length, comments.length, (IDindex, itemIndex) => {
                comments[itemIndex].author = authors_ids[IDindex];
            });
            // loop over post ids
            this.loopOverSequence(posts_ids.length, comments.length, (IDindex, itemIndex) => {
                comments[itemIndex].model_id = posts_ids[IDindex];
            });
        }
        else {
            console.log('comments seed did not succeed no authors or posts');
        }
        await this.saver('comment', comments);
    }
    addmessages() {
        return new Promise(async (resolve) => {
            let authors_ids = await this.getUsersIDs();
            let mms = seeds.messages;
            this.loopOverSequence(authors_ids.length, seeds.messages.length, (IDindex, itemIndex) => {
                mms[itemIndex].recipient = authors_ids[IDindex];
                mms[itemIndex].sender = authors_ids[IDindex];
                //return ms
            });
            resolve(await this.saver('message', mms));
        });
    }
    countDb(dbName, callback) {
        return new Promise(async (resolve) => {
            let Db = dbStore[dbName];
            Db.model.estimatedDocumentCount(async (err, count) => {
                if (!err && count === 0) {
                    callback && resolve(await callback(Db));
                }
                else if (err) {
                    resolve(console.log(err.stack));
                }
                else {
                    resolve(console.log(dbName + ' : already on database'));
                }
            });
        });
    }
    async getUsersIDs() {
        return this.accountsCache.length ? this.accountsCache.map((d) => d._id) : await this.getIDs('account');
    }
    async getIDs(name, filter) {
        return (await dbStore[name].model?.find(filter)).map((md) => md._id);
    }
    async saver(dbName, objArr) {
        await this.countDb(dbName, async (db) => {
            await Promise.all(objArr.map(async (obj) => await new db.model(obj).save()));
            console.log('finished seeding ' + dbName);
        });
    }
    logger(err, obj) {
        err ? console.log("seed  error :", err) : console.log(`added item to the collection`);
    }
    randomObject(objs) {
        let len = objs.length;
        if (len === 0)
            return objs[0];
        let i = Math.floor(Math.random() * len) + 1;
        return objs[i];
    }
    // infinate loop over sequence of IDs to be maped to length of items length
    loopOverSequence(IdsLen, itemsLen, callback) {
        let index = 0;
        let itemsIndex = 0;
        if (!IdsLen || !itemsLen || IdsLen === 0 || itemsLen === 0)
            return;
        while (itemsIndex < itemsLen) {
            callback(index, itemsIndex);
            index++;
            itemsIndex++;
            if (index >= IdsLen)
                index = 0;
        }
    }
}
