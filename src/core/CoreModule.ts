import container from "../ioc/container";
import {
  IDatabaseService,
  IDatabaseServiceToken,
  MongooseDatabaseService,
} from "../database";
import IConfigRepository, {
  IConfigRepositoryToken,
} from "./domain/IConfigRepository";
import { ILogger, ILoggerToken } from "./domain/ILogger";
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
