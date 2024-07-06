"use strict";
import mongoose from 'mongoose';
import { envs } from '../../common/index.js'
import { Store} from '../../services/index.js';
import { IModelConfig, IModelConfigParameters, IModelDb} from '../../interfaces/index.js'
import passport from 'passport';
import passportLocalMongoose from 'passport-local-mongoose';
import { ModelConfig } from './model.config.js';
import { autopopulatePlugin } from './autopopulate.js';

export class ModelDb implements IModelDb {

  constructor(_config: IModelConfigParameters | IModelConfig) {

    this.config = (_config instanceof ModelConfig) ? _config: new ModelConfig(_config);
    const {name,schemaObj,schemaOptions} =this.config;
    
    this.name = name;

    let _schema:any = new mongoose.Schema(schemaObj,schemaOptions ).plugin(autopopulatePlugin);

    if (this.name === 'account') {
      _schema?.plugin(passportLocalMongoose);
      const Account:any = mongoose.model(this.name, _schema);

      //local strategy
      passport.use(Account.createStrategy());
      passport.serializeUser(Account.serializeUser());
      passport.deserializeUser(Account.deserializeUser());

      // assign
      this.model = Account;
    } else {
        this.model = mongoose.model(this.name, _schema); 
    }

    // add to db store
     Store.db.add(this);
  }

  readonly name:string
  readonly config:IModelConfig
  readonly model?: mongoose.Model<any>;
  count: number = 0;


  async initPostDatabaseSeeding() {
    // count
    this.count = await this.model!.countDocuments()

    // create document watcher to notify you on document changes so you can update documents count property
    this.model!.watch().on('change', async change => {
      this.count = await this.model?.countDocuments() ?? 0;
      console.log('number of documents counted are :' + this.count)
      //console.log(JSON.stringify(change))
    })
    //console.log(`Number of documents on database for :( ${this.name} ) is ${this.count}`)
    console.log(`Finished creating databse event on change for model :( ${this.name} )`)
  }

  async createConfig() {

    if (this.name === "config") {
      return;
    }

    let _configDb = Store.db.get('config')!;

    if (!_configDb) {
      envs.throwErr(`config model not present on the database, could not create config entry for model :${this.name}`)
    }
    let one = await _configDb.model?.findOne({ name: this.name });

    if (one) {
      await _configDb.model?.findByIdAndUpdate(one._id,this.config.getProps!()); // update config
      envs.logLine('config entery already on database so it has been updated : name: '+ this.name)
    } else {
      let rst = await _configDb.model?.create(this.config.getProps!());
      envs.logLine(`created config entry for model name : ${rst.name}`)
    }
  }

  // sort, use 1 for asc and -1 for dec
  async Tolist(filter: Record<string, any>, limit: 25, page: 1, sort: 1) {

    return await this.model!.find(filter)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ 'createdAt': sort })
      .exec();
    // .skip(settings.limit * settings.page)

  }

}
