/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AppApiConfig,
  AppConfig,
  AppConfigToken,
  Controller,
  ControllerMetadata,
  ControllerToken,
  ILogger,
  ILoggerToken,
} from "../core";
import { controllerMetadataKeys } from "../core/presentation/types/ControllerMetadata";
import getAllMetadata from "../utils/getAllMetadata";
import container from "./container";

const registerControllers = (
  controllerClasses: {
    new (...args: any[]): Controller;
  }[]
) => {
  const appConfig = container.get<AppConfig>(AppConfigToken);
  const logger = container.get<ILogger>(ILoggerToken);

  logger.prefix = "@controller";

  controllerClasses.forEach((controllerClass) => {
    const metadata = getAllMetadata<ControllerMetadata>(
      controllerClass.prototype,
      controllerMetadataKeys
    );
    const apiConfig = appConfig.api[metadata.api] as AppApiConfig;

    logger.success(
      `${metadata.method.toUpperCase()} ${apiConfig.path}${metadata.path}`
    );

    container
      .bind<Controller>(ControllerToken)
      .to(controllerClass)
      .inSingletonScope();
  });
};

export default registerControllers;
