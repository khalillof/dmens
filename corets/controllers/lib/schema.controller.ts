import express from 'express';
import { DefaultRoutesConfig } from '../../routes';
import AssertionError from '../../common/customTypes/assertionError';
import fs from 'fs';
import path from 'path'
import { JsonLoad } from '../../models/json.load'
import { dbStore } from '../../common/customTypes/types.config';
const upload_url = path.resolve(__dirname, '../../models/schema/uploads');

export class SchemaController {

    constructor() {
        this.db = dbStore['setting'] ? dbStore['setting'] : null;
    }
    db: any

    pre(req: express.Request, res: express.Response, next: express.NextFunction) {

        let content = req.header('content-type');

        if (content === 'application/json') { //if(content.startsWith('multipart/form-data'))
            let content = req.body;
            req.body = {};
            req.body.json = content;
            this.schema(req, res, next)
        } else {
            next()
        }
    }
    // was moved here to resolve the issue of module exports inside circular dependency between DefaultController and DefaultRoutesConfig
    async schema(req: express.Request, res: express.Response, next: express.NextFunction) {

        if (req.body.json) {
            let filepath = path.join(upload_url + 'schema.' + Date.now() + '.json');

            await JsonLoad.loadFromData(req.body.json)
            let name = req.body.json.name.toLowerCase();
            await DefaultRoutesConfig.instance(name.toLowerCase(), this)

            //stringify JSON Object
            let jsonContent = JSON.stringify(req.body.json);

            fs.writeFile(filepath, jsonContent, 'utf8', function (err) {
                if (err) {
                    console.log(err);
                    res.json({ success: false, message: 'operation faild' })
                } else {
                    console.log('wrote new file to :' + filepath);
                    res.json({ success: true, message: 'operation successfull' })
                }

            });

        }
        else if (req.file) {
            let file = req.file;
            console.log("json file saved on :" + file.path);
            res.json({ success: true, message: 'operation successfully executed' })
        } else {
            res.json({ success: false, message: 'operation unsuccessfull, expected json file' })
        }
    }


    static async createInstance() {
        return await Promise.resolve(new SchemaController());
    }

    async list(req: express.Request, res: express.Response, next: express.NextFunction) {
        let items = await this.db.Tolist(20, 0);
        res.json({ success: true, items: items })
    }

    async getById(req: express.Request, res: express.Response, next: express.NextFunction) {
        let item = await this.db.getById(req.params.id);
        res.json({ success: true, item: item })
    }

    async create(req: express.Request, res: express.Response, next: express.NextFunction) {
        let item = await this.db.create(...req.body);
        console.log('document Created :', item);
        res.json({ success: true, id: item.id });
    }

    async patch(req: express.Request, res: express.Response, next: express.NextFunction) {
        await this.db.patchById(req.params.Id, ...req.body);
        this.sendJson({ "status": "OK" }, 204, res);
    }

    async put(req: express.Request, res: express.Response, next: express.NextFunction) {
        await this.db.putById(req.params.Id, ...req.body);
        this.sendJson({ "status": "OK" }, 204, res);
    }
    async remove(req: express.Request, res: express.Response, next: express.NextFunction) {
        await this.db.deleteById(req.params.id);
        this.sendJson({ "status": "OK" }, 204, res);
    }
    ////// helpers ================================
    async tryCatchRes(res: express.Response, funToFire: Function) {
        try {
            // fire only - res
            await funToFire()
        } catch (err: any) {
            if (err instanceof AssertionError) {
                console.error(err.stack)
                res.json({ success: false, error: err.message })
            } else {
                console.error(err.stack);
                res.json({ success: false, error: "operation faild error!!" })
            }
        }
    }
    extractId(req: express.Request, res: express.Response, next: express.NextFunction) {
        req.body.id = req.params.id;
        next();
    }
    sendJson(obj: any, status: any, res: express.Response) {
        res.setHeader('Content-Type', 'application/json');
        res.status(status).json(obj);
    }


    resultCb = {
        res: (res: express.Response, next: express.NextFunction, callback?: any) => {
            return {
                cb: (err: any, obj: any, info: any) => {
                    if (err)
                        res.json({ success: false, message: 'operation Unsuccessful!', err: info || err })
                    else if (obj) {
                        typeof callback === 'function' ? callback(obj) : res.json({ success: true, message: 'operation Successful!' })
                    }
                    else if (!err && !obj) {
                        res.json({ success: false, message: 'operation Unsuccessful!', err: info || err || 'error' })
                    }
                }
            }
        }
    }
}