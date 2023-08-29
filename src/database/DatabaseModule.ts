import { module } from "inversify-sugar";
import { IDatabaseServiceToken } from "./domain";
import { MongooseDatabaseService } from "./infrastructure";

@module({
  providers: [
    {
      provide: IDatabaseServiceToken,
      useClass: MongooseDatabaseService,
    },
  ],
  exports: [IDatabaseServiceToken],
})
export default class DatabaseModule {}
