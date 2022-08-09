import { Model } from 'mongoose'
import { dbStore } from '../../common/index.js';
import seeds from '../seeds.json' assert {type: 'json'};

type dbCallback = {
    (db: Model<any>): Promise<any>;
}
export class ClientSeedDatabase {

    async init() {
        await this.addRoles().then(() => console.log('finished seeding roles'))
            .then(async () => await this.addAccounts().then(() => console.log('finished seeding Accounts'))
                .then(async () => await this.addCateories().then(() => console.log('finished seeding categoriess'))))

        await this.addContacts();
        console.log('finished seeding contacts')

        setTimeout(async () => await this.addPosts().then(() => console.log('finished seeding posts')), 2000)
        setTimeout(async () => await this.addComments().then(() => console.log('finished seeding comments')), 3000)

        setTimeout(async () => await this.addmessages().then(() => console.log('finished seeding messages'))
            .then(() => console.log('finished database seeding .........!')), 4000)

    }
    accountsCache: any[] = [];
    async getUsersIDs() {
        return this.accountsCache.length && this.accountsCache || await this.getIDs('account');
    }
    async addRoles() {
        await this.countDb('role', async (Db) => await this.saver(seeds.roles, Db));
    }
    async addAccounts() {
       this.countDb('account', async (Db: any) => {

            const roles =  await dbStore['role'].model!.find( { name: { $in: ["admin", "user"] } } )
       
            if (roles) {
                for (let i = 0; i < seeds.accounts.length; i++) {
                    let user = seeds.accounts[i];
                    user.roles = roles;
                    let ut = await Db.register!(user, "password");
                    this.accountsCache.push(ut._id);
                }
            }
            else
                console.log(' roles are not ready for accounts creations')


        })
    }

    async addContacts() {
        let contacts = seeds.contacts.map((p) => { p.contactType = this.randomObject(seeds.contacttypes!); return p; })
        await this.countDb('contact', async (Db) => await this.saver(contacts, Db))
    }
    async addCateories() {
        await this.countDb('category', async (Db) => await this.saver(seeds.categories, Db));
    }
    async addPosts() {
        const authors_Ids = await this.getUsersIDs();
        const catIds = await this.getIDs('category');

        if (authors_Ids.length && authors_Ids.length) {
            let posts = seeds.posts.map((p) => {
                p.publisheDate = new Date();
                p.author = this.randomObject(authors_Ids!);
                p.category = this.randomObject(catIds!);
                return p;
            })

            await this.countDb('post', async (Db) => await this.saver(posts, Db))
        } else {
            console.log(' errros no authors for posts seeds')
        }


    }
    async addComments() {
        let authors_ids = await this.getUsersIDs();
        let posts_ids = await this.getIDs('post');

        if (authors_ids.length && posts_ids.length) {

            seeds.comments.forEach(async comm => {
                comm.author = this.randomObject(authors_ids!);
                comm.post_id = this.randomObject(posts_ids!);
                //return comm;
            })
            await this.countDb('comment', async (Db) => await this.saver(seeds.comments, Db));
        } else {
            console.log('comments seed did not succeed no authors or posts')
        }
    }
    async addmessages() {
        let authors_ids = await this.getUsersIDs();

        seeds.messages.forEach(ms => {
            ms.recipient = this.randomObject(authors_ids!);
            ms.sender = this.randomObject(authors_ids!);
        })

        await this.countDb('message', async (Db) => await this.saver(seeds.messages, Db));
    }

    async countDb(dbName: string, callback: dbCallback) {
        let Db = dbStore[dbName].model!;
        Db.estimatedDocumentCount(async (err: any, count: number) => {
            if (!err && count === 0) {
                callback && await callback(Db)
            } else if (err) {
                console.log(err.stack)
            }
        });

    }
    async getIDs(name: string, filter?: {}) {
        return (await dbStore[name].model?.find(filter!))!.map((com: any) => com._id);
    }
    async saver(objArr: any[], db: Model<any>) {
        objArr.forEach(async (obj) => await new db(obj).save(this.logger));
    }

    logger(err: any, obj: any) {
        err ? console.log("seed  error :", err) : console.log(`added item to the collection`);
    }

    randomObject(objs: any[]) {
        if (objs.length === 0)
            return objs[0]
        let i = this.randomInt(0, objs.length);
        return objs[i]
    }
    randomInt(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    }

}