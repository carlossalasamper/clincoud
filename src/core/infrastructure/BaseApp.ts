import express from "express";
import Router from "express-promise-router";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { inject, injectable, multiInject } from "inversify";
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
import getAllMetadata from "../../utils/getAllMetadata";
import ControllerMetadata, {
  controllerMetadataKeys,
} from "../presentation/types/ControllerMetadata";
import { container } from "../../ioc";

@injectable()
export default abstract class BaseApp implements IInitializable {
  @inject(PortToken) private readonly port!: string;
  @inject(ILoggerToken) private readonly logger!: ILogger;
  @inject(IConfigRepositoryToken)
  private readonly configService!: IConfigRepository;
  @multiInject(ControllerToken)
  private readonly controllers!: Controller[];
  @inject(NotFoundMiddleware)
  private readonly notFoundMiddleware!: NotFoundMiddleware;
  @inject(DevelopmentErrorMiddleware)
  private readonly developmentErrorMiddleware!: DevelopmentErrorMiddleware;
  @inject(ProductionErrorMiddleware)
  private readonly productionErrorMiddleware!: ProductionErrorMiddleware;

  protected app: express.Application = express();
  protected apiRouter = Router();

  public initialize(): void | Promise<void> {
    this.setup();

    this.app.listen(this.port, () => {
      this.logger.info(`App running on port :${this.port}`);

      this.onInitialized();
    });
  }

  abstract onInitialized(): void;

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

    // API
    this.controllers.forEach((controller) => {
      const metadata = getAllMetadata<ControllerMetadata>(
        controller,
        controllerMetadataKeys
      );
      const middlewares = metadata.middlewares.map((middleware) =>
        container.get<Middleware>(middleware)
      );
      const lateMiddlewares = metadata.lateMiddlewares.map((middleware) =>
        container.get<Middleware>(middleware)
      );
      const apiConfig = this.configService.config.api[
        metadata.api
      ] as AppApiConfig;

      this.apiRouter[metadata.method](
        `/v1${apiConfig.path}${metadata.path}`,
        ...middlewares.map((middleware) => middleware.handler.bind(middleware)),
        controller.handler.bind(controller),
        ...lateMiddlewares.map((middleware) =>
          middleware.handler.bind(middleware)
        )
      );
    });
    this.app.use(this.apiRouter);
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
