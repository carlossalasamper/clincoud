/* eslint-disable no-console */
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
              mongoose.connection.on("connected", () => {
                console.log("[Mongoose] Connected.");
              });
              await mongoose.connect(uri, options);
            }

            return mongoose.connection;
          },
          onDeactivation(injectable: () => Promise<mongoose.Connection>) {
            return new Promise<void>((presolve) => {
              injectable().then((connection) => {
                connection.close().then(() => {
                  console.log("[Mongoose] Connection closed.");
                  presolve();
                });
              });
            });
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
