import { DynamicModule, module } from "inversify-sugar";
import MongooseConnectionToken from "./MongooseConnectionToken";
import mongoose from "mongoose";
import { MongooseConnectionConfig } from "./types";
import MongooseConnectionConfigToken from "./MongooseConnectionConfigToken";

@module({})
export default class MongooseModule {
  static forRoot(config: MongooseConnectionConfig): DynamicModule {
    const { uri, options } = config;

    return {
      module: MongooseModule,
      providers: [
        {
          provide: MongooseConnectionToken,
          useAsyncFactory: () => async () => {
            if (!mongoose.connection || mongoose.connection.readyState === 0) {
              await mongoose.connect(uri, options);
            }

            return mongoose.connection;
          },
          isGlobal: true,
        },
        {
          provide: MongooseConnectionConfigToken,
          useValue: config,
          isGlobal: true,
        },
      ],
    };
  }
}
