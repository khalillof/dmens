
import {Model} from 'mongoose';
import {ISvc} from "./ISvc.services";

export class Svc implements ISvc {

  db:Model<any,any>;

    constructor(svc:Model<any,any>) {
        this.db = svc;
    }
   public static  async createInstance(data:Model<any,any>):Promise<ISvc>{
      var result = new Svc(data);
      return  await Promise.resolve(result);
      }
      
 async create(obj: any):Promise<any>{
  let res =this.db.create(obj)
  return  await Promise.resolve(res);
}

async getById(objId: string) {
    return await this.db.findOne({_id: objId});
}

async putById(objFields: any){
   return await this.db.findByIdAndUpdate(objFields._id, objFields);
}

async deleteById(objId: string) {
  return await this.db.deleteOne({_id: objId});
}

async Tolist(limit: number = 25, page: number = 0) {
    return  this.db.find()
        .limit(limit)
        .skip(limit * page)
        .exec();
}

async patchById(objFields: any) {
 return await this.db.findOneAndUpdate(objFields._id, objFields);
}
}

