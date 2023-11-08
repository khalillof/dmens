"use strict";
import mongoose from 'mongoose';
import { Svc, envs } from '../../common/index.js'
import { IConfigProps, IConfigPropsParameters, IDbModel} from '../../interfaces/index.js'
import passport from 'passport';
import passportLocalMongoose from 'passport-local-mongoose';
import { PassportStrategies } from './strategies.js';
import { ConfigProps } from './config.props.js';
import { autopopulatePlugin } from './autopopulate.js';

export class DbModel implements IDbModel {

  constructor(_config: IConfigPropsParameters | IConfigProps ) {
    this.config = (_config instanceof ConfigProps) ? _config: new ConfigProps(_config);
    const {name,schemaObj,schemaOptions} =this.config;
    
    this.name = name;

    let _schema = new mongoose.Schema(schemaObj,schemaOptions ).plugin(autopopulatePlugin);

    if (this.name === 'account') {
      _schema?.plugin(passportLocalMongoose);
      const Account: any = mongoose.model(this.name, _schema);
      //passport.use(new Strategy(User.authenticate()));
      //local strategy
      passport.use(Account.createStrategy());
      passport.serializeUser(Account.serializeUser());
      passport.deserializeUser(Account.deserializeUser());
      // extras
      // strategy jwt || az
      passport.use(PassportStrategies.getAuthStrategy());

      // assign
      this.model = Account;
    } else {
      this.model = mongoose.model(this.name, _schema);
    }

    // add to db store
     Svc.db.add(this);
  }

  readonly name:string
  readonly config:IConfigProps
  readonly model?: mongoose.Model<any>;
  count: number = 0;


  async initPostDatabaseSeeding() {
    // count
    this.count = await this.model!.count()

    // create document watcher to notify you on document changes so you can update documents count property
    this.model!.watch().on('change', async change => {
      this.count = await this.model?.count() ?? 0;
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

    let _configDb = Svc.db.get('config')!;

    if (!_configDb) {
      envs.throwErr(`config model not present on the database, could not create config entry for model :${this.name}`)
    }
    let one = await _configDb.findOne({ name: this.name });

    if (one) {
      await _configDb.putById(one._id,this.config.getProps!()); // update config
      envs.logLine('config entery already on database so it has been updated : name: '+ this.name)
    } else {
      let rst = await _configDb.create(this.config.getProps!());
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

  async findById(id: string) {
    return await this.model!.findById(id);
  }
  async findOne(query: Record<string, any>) {
    return await this.model!.findOne(query);
  }
  async create(obj: object) {
    return await this.model?.create(obj);
  }

  async putById(id: string, objFields: Record<string, any>) {
    return await this.model?.findByIdAndUpdate(id, objFields);
  }

  async deleteById(id: string) {
    return await this.model?.findByIdAndDelete(id);
  }
  async deleteByQuery(query: Record<string, any>) {
    return await this.model?.findOneAndDelete(query);
  }
  async patchById(objFields: any) {
    return await this.model?.findOneAndUpdate(objFields._id, objFields);
  }
}
