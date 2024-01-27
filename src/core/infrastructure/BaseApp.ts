import express from "express";
import Router from "express-promise-router";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { injectable, optional } from "inversify-sugar";
import { IInitializable, PortToken } from "../../common";
import { ILogger, ILoggerToken } from "../domain/ILogger";
import {
  Controller,
  ControllerToken,
  DevelopmentErrorMiddleware,
  Middleware,
  NotFoundMiddleware,
  ProductionErrorMiddleware,
} from "../presentation";
import {
  AppApiConfig,
  IConfigRepository,
  IConfigRepositoryToken,
} from "../domain";
import ControllerMetadata, {
  controllerMetadataKeys,
} from "../presentation/types/ControllerMetadata";
import { getModuleContainer, imported, provided } from "inversify-sugar";
import getAllMetadata from "../../utils/getAllMetadata";
import getMiddleware from "../../utils/getMiddleware";
import AsyncExitHook from "async-exit-hook";
import { InversifySugar } from "inversify-sugar";
import Logger from "./implementations/Logger";

export const AppToken = Symbol("App");

@injectable()
export default abstract class BaseApp implements IInitializable {
  protected readonly appLogger = new Logger();

  @provided(PortToken) private readonly port!: string;
  @provided(ILoggerToken) private readonly controllerLogger!: ILogger;
  @provided(IConfigRepositoryToken)
  private readonly configService!: IConfigRepository;
  @imported(ControllerToken)
  @optional()
  private readonly controllers!: Controller[];
  @imported(NotFoundMiddleware)
  private readonly notFoundMiddleware!: NotFoundMiddleware;
  @imported(DevelopmentErrorMiddleware)
  private readonly developmentErrorMiddleware!: DevelopmentErrorMiddleware;
  @imported(ProductionErrorMiddleware)
  private readonly productionErrorMiddleware!: ProductionErrorMiddleware;

  protected app: express.Application = express();
  protected server!: ReturnType<express.Application["listen"]>;
  protected apiRouter = Router();

  public initialize(): void | Promise<void> {
    this.appLogger.prefix = "App";
    this.controllerLogger.prefix = "@controller";

    this.setup();

    this.server = this.app.listen(this.port, () => {
      this.appLogger.info(`App running on port :${this.port}`);

      this.onInitialized();
    });

    AsyncExitHook((callback) => {
      this.server.close(() => {
        this.appLogger.info("Server closed.");

        InversifySugar.reset().then(() => {
          callback();
          process.exit(0);
        });
      });

      setTimeout(() => {
        this.appLogger.error("Timeout. Forcing shutdown.");
        process.exit(1);
      }, 5000);
    });
  }

  abstract onInitialized(): void;

  useMiddlewares(): Middleware[] {
    return [];
  }

  useLateMiddlewares(): Middleware[] {
    return [];
  }

  private setup() {
    // Global middlewares
    this.app.use(cors({ ...this.configService.config.security.cors }));
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use(function (_req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "Origin,X-Requested-With,Content-Type,Accept,Authorization"
      );
      next();
    });

    // Documentation
    this.app.use(
      "/docs",
      swaggerUi.serve,
      swaggerUi.setup(this.configService.config.documentation.swaggerDocument)
    );

    this.useMiddlewares().forEach((middleware) => {
      this.app.use(middleware.handler.bind(middleware));
    });

    // API
    this.controllers.forEach((controller) => {
      const metadata = getAllMetadata<ControllerMetadata>(
        controller,
        controllerMetadataKeys
      );

      if (!metadata.module) {
        throw new Error(
          `The controller ${controller.constructor.name} does not belong to any module.`
        );
      }

      const controllerContainer = getModuleContainer(metadata.module);
      const middlewares = metadata.middlewares.map((middleware) =>
        getMiddleware(controllerContainer, middleware)
      );
      const lateMiddlewares = metadata.lateMiddlewares.map((middleware) =>
        getMiddleware(controllerContainer, middleware)
      );
      const apiConfig = this.configService.config.api[
        metadata.api
      ] as AppApiConfig;

      this.apiRouter[metadata.method](
        `${apiConfig.path}${metadata.path}`,
        ...middlewares.map((middleware) => middleware.handler.bind(middleware)),
        controller.handler.bind(controller),
        ...lateMiddlewares.map((middleware) =>
          middleware.handler.bind(middleware)
        )
      );

      this.controllerLogger.success(
        `${metadata.method.toUpperCase()} ${apiConfig.path}${metadata.path}`
      );
    });
    this.app.use(this.apiRouter);

    this.useLateMiddlewares().forEach((middleware) => {
      this.app.use(middleware.handler.bind(middleware));
    });

    this.app.use(this.notFoundMiddleware.handler.bind(this.notFoundMiddleware));

    // Error handler
    this.app.use(
      process.env.NODE_ENV === "production"
        ? this.productionErrorMiddleware.execute.bind(
            this.productionErrorMiddleware
          )
        : this.developmentErrorMiddleware.execute.bind(
            this.developmentErrorMiddleware
          )
    );
  }
}
