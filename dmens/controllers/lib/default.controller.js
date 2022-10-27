import { dbStore, logger, responce, Assert } from '../../common/index.js';
export class DefaultController {
    db;
    responce;
    log;
    constructor(name) {
        this.db = dbStore[name];
        this.responce = responce;
        this.log = logger;
    }
    static async createInstance(svcName) {
        return new this(svcName);
    }
    async count(req, res, next) {
        let num = await this.db.model?.countDocuments(req.query);
        this.responce(res).data(num);
    }
    isSafeString(str, res) {
        Assert.string(str);
        Assert.safeString(str);
    }
    async search(req, res, next) {
        if (!req.query) {
            return this.responce(res).data([]);
        }
        // extract key value from request.query object
        let key = Object.keys(req.query)[0];
        let value = req.query[key];
        // chech string is safe
        this.isSafeString(value, res);
        // the following three lines validate the reqested Key is actually present in the model schema properties
        let iskeyInModel = this.db.model?.schema.pathType(key);
        if ("real nested virtual".indexOf(iskeyInModel) === -1) {
            return this.responce(res).data([]);
        }
        // const docs = await this.db.model?.find({ [key]: { $regex: value } });
        const docs = await this.db.Tolist({ [key]: new RegExp(`${value}`, 'i') });
        this.responce(res).data(docs);
    }
    getQueryData(req) {
        if (req.query) {
            let filter = req.query;
            const limit = (filter && filter.limit) ? parseInt(filter.limit) : 10;
            const page = (filter && filter.page) ? parseInt(filter.page) : 1;
            const sort = (filter && filter.sort && (filter.sort === '1' || filter.sort === '-1')) ? parseInt(filter.sort) : 1;
            page && (delete filter['page']);
            page && (delete filter['limit']);
            page && (delete filter['sort']);
            return { filter, limit, page, sort };
        }
        else {
            return {};
        }
    }
    async list(req, res, next) {
        const { filter, limit, page, sort } = this.getQueryData(req);
        let items = await this.db.Tolist(filter, limit, page, sort);
        this.responce(res).data(items);
    }
    async getOne(req, res, next) {
        let q = req.params['id'] ? { _id: req.params['id'] } : req.query;
        if (!q) {
            return this.responce(res).badRequest();
        }
        let item = await this.db.findOne(q);
        this.responce(res).data(item);
    }
    async post(req, res, next) {
        let item = await this.db.create(req.body);
        console.log('document Created :', item);
        this.responce(res).data(item);
    }
    async patch(req, res, next) {
        await this.db.patchById(req.params['id'], req.body);
        this.responce(res).success();
    }
    async put(req, res, next) {
        await this.db.putById(req.params['id'], req.body);
        this.responce(res).success();
    }
    async delete(req, res, next) {
        let item = await this.db.deleteById(req.params['id']);
        console.warn(`item deleted by user: \n ${req.user} \nItem deleted :\n${item}`);
        this.responce(res).success();
    }
    ////// helpers ================================
    tryCatchActions(actionName) {
        return async (req, res, next) => {
            try {
                let self = this;
                await self[actionName](req, res, next);
                return;
            }
            catch (err) {
                this.responce(res).error(err);
            }
        };
    }
}
