import { logger, responce, Assert, Svc } from '../../common/index.js';
export class DefaultController {
    db;
    responce;
    log;
    constructor(name) {
        this.db = Svc.db.get(name);
        this.responce = responce;
        this.log = logger;
    }
    async count(req, res, next) {
        let num = await this.db.model?.countDocuments(req.query);
        this.responce(res).data(num);
    }
    async form(req, res, next) {
        let _form = await this.db.config.genForm();
        this.responce(res).data(_form);
    }
    async route(req, res, next) {
        let routes = this.db.config.getRoutes();
        this.responce(res).data(routes);
    }
    async search(req, res, next) {
        if (!req.query) {
            return this.responce(res).data([]);
        }
        // extract key value from request.query object
        let key = Object.keys(req.query)[0];
        let value = req.query[key];
        // chech string is safe
        Assert.iSafeString(value);
        // the following three lines validate the reqested Key is actually present in the model schema properties
        let iskeyInModel = this.db.model?.schema.pathType(key);
        if ("real nested virtual".indexOf(iskeyInModel) === -1) {
            return this.responce(res).data([]);
        }
        const docs = await this.db.Tolist({ [key]: new RegExp(`${value}`, 'i') });
        this.responce(res).data(docs);
    }
    getQueryData(filter) {
        if (!filter) {
            return {};
        }
        let _limit = filter['limit'], _page = filter['page'], _sort = filter['sort'], _total = filter['total'];
        const limit = _limit ? Number(_limit) : 5;
        const page = _page ? Number(_page) : 1;
        const sort = (_sort && (_sort === "1" || _sort === "-1")) ? Number(_sort) : 1;
        const total = _total ? Boolean(_total) : undefined;
        limit && (delete filter['limit']);
        page && (delete filter['page']);
        sort && (delete filter['sort']);
        total && (delete filter['total']);
        return { filter, limit, page, sort, total };
    }
    async list(req, res, next) {
        let { filter, limit, page, sort, total } = this.getQueryData(req.query);
        let items = await this.db.Tolist(filter, limit, page, sort);
        let _total = total ? await this.db.model?.countDocuments(filter) : undefined;
        // console.log(`filter = ${filter}, limit =${limit}, page =${page}, sort = ${sort}, total =${total}`)
        this.responce(res).data(items, undefined, _total);
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
    tryCatch(actionName) {
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
