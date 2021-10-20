import {Model} from 'mongoose';
export interface ISvc {
   
    db:Model<any,any>;
    
    //create: (resource: any) => Promise<any>,
    create <Tentity>(resource: Tentity):Promise<Tentity> ;
    putById: (resourceId: any) => Promise<string>;
    getById: (resourceId: any) => Promise<any>;
    deleteById: (resourceId: any) => Promise<string>;
    patchById: (resourceId: any) => Promise<string>;
    Tolist<Tentity>(limit: number, page: number): Promise<Tentity[]>;
}