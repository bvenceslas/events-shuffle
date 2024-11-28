import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
let mongod: MongoMemoryServer;

export const rootMongooseTestModule = (options: MongooseModuleOptions = {}) =>
  MongooseModule.forRootAsync({
    useFactory: async () => {
      mongod = await MongoMemoryServer.create();
      const mongoUri = mongod.getUri();
      return {
        uri: mongoUri,
        ...options,
      };
    },
  });

export const closeInMongodConnection = async (): Promise<boolean> => {
  let closed = false;
  if (mongod) {
    try {
      closed = await mongod.stop();
      return closed;
    } catch (err) {
      console.log('error closing connection to mongo: ', JSON.stringify(err));
    }
  }
  return closed;
};
