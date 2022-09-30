import { dbStore, logger, responce } from '../../common/index.js';
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
    async list(req, res, next) {
        let items = await this.db.Tolist(20, 0, req.query);
        this.responce(res).data(items);
    }
    async findById(req, res, next) {
        let item = await this.db.findById(req.params['id']);
        this.responce(res).data(item);
    }
    async findOne(req, res, next) {
        let item = await this.db.findOne(req.query);
        this.responce(res).data(item);
    }
    async create(req, res, next) {
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
    async remove(req, res, next) {
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
