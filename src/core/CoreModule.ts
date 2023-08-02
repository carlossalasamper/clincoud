import container from "../container";
import {
  IDatabaseService,
  IDatabaseServiceToken,
  MongooseDatabaseService,
} from "../database";
import {
  IConfigRepository,
  IConfigRepositoryToken,
  ILogger,
  ILoggerToken,
} from "./domain";
import { Logger } from "./infrastructure";
import LocalConfigRepository from "./infrastructure/LocalConfigRepository";
import {
  DevelopmentErrorMiddleware,
  NotFoundMiddleware,
  ProductionErrorMiddleware,
  RequestValidator,
} from "./presentation";

container.bind<ILogger>(ILoggerToken).to(Logger);

container.bind(RequestValidator).toSelf().inSingletonScope();

container
  .bind<IDatabaseService>(IDatabaseServiceToken)
  .to(MongooseDatabaseService)
  .inRequestScope();
container
  .bind<IConfigRepository>(IConfigRepositoryToken)
  .to(LocalConfigRepository)
  .inSingletonScope();

container.bind(NotFoundMiddleware).toSelf().inSingletonScope();
container.bind(DevelopmentErrorMiddleware).toSelf().inSingletonScope();
container.bind(ProductionErrorMiddleware).toSelf().inSingletonScope();
