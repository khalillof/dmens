import express from 'express'
import { ISvc} from '../services/ISvc.services';

export interface IController {

    ToList(req: express.Request, res: express.Response, next:express.NextFunction):Promise<void>;
    getById(req: express.Request, res: express.Response, next:express.NextFunction):Promise<void>;
    create(req: express.Request, res: express.Response, next: express.NextFunction):Promise<void>;
    patch(req: express.Request, res: express.Response, next: express.NextFunction):Promise<void>;
    put(req: express.Request, res: express.Response, next:express.NextFunction):Promise<void>;
    remove(req: express.Request, res: express.Response, next:express.NextFunction):Promise<void>;
    ////// helpers
    extractId(req: express.Request, res: express.Response, next: express.NextFunction) :Promise<void>;
};