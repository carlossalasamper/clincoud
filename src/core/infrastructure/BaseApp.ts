import express from "express";
import { inject, injectable } from "inversify";
import { IInitializable, ILogger, ILoggerToken } from "../domain";

@injectable()
export default abstract class BaseApp implements IInitializable {
  @inject("Port") private readonly port!: string;
  @inject(ILoggerToken) private readonly logger!: ILogger;

  protected app: express.Application;

  constructor() {
    this.app = express();
  }

  public initialize(): void | Promise<void> {
    this.setup();

    this.app.listen(this.port, () => {
      this.logger.info(`(Express) READY ON ${this.port}`);

      this.onInitialized();
    });
  }

  abstract setup(): void;

  abstract onInitialized(): void;
}
