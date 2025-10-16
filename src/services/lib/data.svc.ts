
import mongoose from 'mongoose';
import {appData, envs,asyncCallback} from '../../common/index.js';
import seeds from '../seeds.json' with { type: "json" } ;
import {posts} from './posts.js'
import {  init_models} from '../../models/index.js';


export async function dbInit(): Promise<void> {
  try {
    envs.logLine(`📡 Connecting to MongoDB: ${envs.databaseUrl()}`);
    await mongoose.connect(envs.databaseUrl());
    console.log('✅ Successfully connected to MongoDB');

    envs.logLine('🔧 Initializing models...');
    await init_models();

    const registeredModels = Object.keys(mongoose.models);
    envs.logLine(`📦 Models registered: ${registeredModels.join(', ')}`);
    envs.logLine(`🧠 AppData size: ${appData.size}`);

    if (envs.isDevelopment){
    envs.logLine('🌱 Starting database seeding...');
    const seeder = new ClientSeedDatabase();
    await seeder.init();

    envs.logLine('🎉Database Seeding complete....');
  }
  
  } catch (err: any) {
    console.error('❌ Error during DB init:', err);
    process.exit(1);
  }
}

export class ClientSeedDatabase {
  private accountsCache: mongoose.Types.ObjectId[] = [];

  async init(): Promise<void> {

    await this.addAccounts();
    await this.addCategories(),
    await this.addContacts(),
    await this.addMessages()
    await this.addPosts();
    await this.addComments();
    
    envs.logLine('Finished database seeding!');
  }


  private async addAccounts(): Promise<void> {
    const result = await this.saver('account', seeds.accounts);
    this.accountsCache = result.map((doc: any) => doc._id);
  }

  private async addContacts(): Promise<void> {
    await this.saver('contact', seeds.contacts);
  }

  private async addCategories(): Promise<void> {
    await this.saver('category', seeds.categories);
  }

  private async addMessages(): Promise<void> {
    const authorsIds = await this.getUsersIDs();
    const messages = structuredClone(seeds.messages);

    this.loopOverSequence(authorsIds.length, messages.length, (i, j) => {
      messages[j].recipient = authorsIds[i] as any;
      messages[j].sender = authorsIds[i] as any;
    });

    await this.saver('message', messages);
  }

  private async addPosts(): Promise<void> {
    const authorIds = await this.getUsersIDs();
    const categoryIds = await this.getIDs('category');

    if (!authorIds.length || !categoryIds.length) {
      console.warn('Post seed skipped: missing authors or categories');
      return;
    }

    const postData = structuredClone(posts);

    this.loopOverSequence(authorIds.length, postData.length, (i, j) => {
      postData[j].author = authorIds[i] as any;
      postData[j].publisheDate = new Date();
    });

    this.loopOverSequence(categoryIds.length, postData.length, (i, j) => {
      postData[j].category  = categoryIds[i] as any;
    });

    await this.saver('post', postData);
  }

  private async addComments(): Promise<void> {
    const authorIds = await this.getUsersIDs();
    const  postIds = await this.getIDs('post');

    if (!authorIds.length || !postIds.length) {
      console.warn('Comment seed skipped: missing authors or posts');
      return;
    }

    const comments = structuredClone(seeds.comments);

    this.loopOverSequence(authorIds.length, comments.length, (i, j) => {
      comments[j].user = authorIds[i] as any;
    });

    this.loopOverSequence(postIds.length, comments.length, (i, j) => {
      comments[j].modelid = postIds[i] as any;
    });

    await this.saver('comment', comments);
  }

  private async getUsersIDs(): Promise<mongoose.Types.ObjectId[]> {
    return this.accountsCache.length
      ? this.accountsCache
      : await this.getIDs('account');
  }

  private async getIDs(modelName: string, filter: Record<string, any> = {}): Promise<mongoose.Types.ObjectId[]> {
    const model = mongoose.models[modelName];
    if (!model) return [];
    const docs = await model.find(filter).select('_id').lean();
    return docs.map((doc: any) => doc._id);
  }

  private async saver(modelName: string, dataArray: Record<string, any>[]): Promise<Document[]> {
    const model = mongoose.models[modelName];
    if (!model) {
      console.error(`Model ${modelName} not found.`);
      return [];
    }

    try {
      const count = await model.countDocuments();
      if (count > 0) {
        console.log(`${modelName}: already seeded`);
        return [];
      }

      const results = await Promise.allSettled(
        dataArray.map(data => new model(data).save())
      );

      const successful = results
        .filter(r => r.status === 'fulfilled')
        .map(r => (r as PromiseFulfilledResult<Document>).value);

      const failed = results.filter(r => r.status === 'rejected');
      if (failed.length) {
        console.error(`${failed.length} ${modelName} items failed to seed`);
      }

      console.log(`Finished seeding ${modelName}`);
      return successful;
    } catch (err) {
      console.error(`Error seeding ${modelName}:`, err);
      return [];
    }
  }

  private loopOverSequence(idLen: number, itemLen: number, callback: (idIndex: number, itemIndex: number) => void): void {
    if (!idLen || !itemLen) return;

    let i = 0;
    for (let j = 0; j < itemLen; j++) {
      callback(i, j);
      i = (i + 1) % idLen;
    }
  }

  private randomObject<T>(arr: T[]): T | null {
    if (!arr.length) return null;
    const i = Math.floor(Math.random() * arr.length);
    return arr[i];
  }
}