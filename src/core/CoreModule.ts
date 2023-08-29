import { ILoggerToken } from "./domain";
import { IConfigRepositoryToken } from "./domain/IConfigRepository";
import { Logger } from "./infrastructure";
import LocalConfigRepository from "./infrastructure/LocalConfigRepository";
import {
  DevelopmentErrorMiddleware,
  NotFoundMiddleware,
  ProductionErrorMiddleware,
} from "./presentation";
import { module } from "inversify-sugar";

@module({
  providers: [
    {
      provide: ILoggerToken,
      useClass: Logger,
      scope: "Transient",
      isGlobal: true,
    },
    {
      provide: IConfigRepositoryToken,
      useClass: LocalConfigRepository,
      isGlobal: true,
    },
    NotFoundMiddleware,
    DevelopmentErrorMiddleware,
    ProductionErrorMiddleware,
  ],
  exports: [
    NotFoundMiddleware,
    DevelopmentErrorMiddleware,
    ProductionErrorMiddleware,
  ],
})
export default class CoreModule {}
