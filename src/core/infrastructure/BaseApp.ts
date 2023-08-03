import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { inject, injectable, multiInject } from "inversify";
import { IInitializable, PortToken } from "../../common";
import { ILogger, ILoggerToken } from "../domain/ILogger";
import {
  ControllerToken,
  DecoratedController,
  DevelopmentErrorMiddleware,
  NotFoundMiddleware,
  ProductionErrorMiddleware,
} from "../presentation";
import {
  AppApiConfig,
  IConfigRepository,
  IConfigRepositoryToken,
} from "../domain";

@injectable()
export default abstract class BaseApp implements IInitializable {
  @inject(PortToken) private readonly port!: string;
  @inject(ILoggerToken) private readonly logger!: ILogger;
  @inject(IConfigRepositoryToken)
  private readonly configService!: IConfigRepository;
  @multiInject(ControllerToken)
  private readonly controllers!: DecoratedController[];
  @inject(NotFoundMiddleware)
  private readonly notFoundMiddleware!: NotFoundMiddleware;
  @inject(DevelopmentErrorMiddleware)
  private readonly developmentErrorMiddleware!: DevelopmentErrorMiddleware;
  @inject(ProductionErrorMiddleware)
  private readonly productionErrorMiddleware!: ProductionErrorMiddleware;

  protected app: express.Application = express();

  public initialize(): void | Promise<void> {
    this.setup();

    this.app.listen(this.port, () => {
      this.logger.info(`(Express) READY ON ${this.port}`);

      this.onInitialized();
    });
  }

  abstract onInitialized(): void;

  private setup() {
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
      const apiConfig = this.configService.config.api[
        controller.api
      ] as AppApiConfig;

      this.app[controller.method](
        `/v1${apiConfig.path}${controller.path}`,
        ...controller.middlewares.map((middleware) =>
          middleware.handler.bind(middleware)
        ),
        controller.handler,
        ...controller.lateMiddlewares.map((middleware) =>
          middleware.handler.bind(middleware)
        )
      );
    });

    // Error handling
    this.app.use(this.notFoundMiddleware.handler.bind(this.notFoundMiddleware));
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
