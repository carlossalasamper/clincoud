/* eslint-disable @typescript-eslint/no-explicit-any */
import { Constructor } from "../common";
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
import registerProviders from "./registerProviders";
import InjectableType, { InjectableTypeKey } from "./types/InjectableType";
import ModuleMetadata, { moduleMetadataKeys } from "./types/ModuleMetadata";

export default function registerModules(Module: Constructor, isRoot = false) {
  const logger = container.get<ILogger>(ILoggerToken);

  logger.prefix = "@module";

  const metadata = getAllMetadata<ModuleMetadata>(
    Module.prototype,
    moduleMetadataKeys
  );

  registerProviders(metadata.providers);

  if (metadata.imports.length > 0) {
    for (const item of metadata.imports) {
      const injectableType: InjectableType = Reflect.getMetadata(
        InjectableTypeKey,
        item.prototype
      );

      if (injectableType === InjectableType.Module) {
        registerModules(item);
      } else {
        // TODO: Handle other injectable types
      }
    }
  }

  if (metadata.controllers.length > 0) {
    registerControllers(metadata.controllers);
  }

  if (!isRoot) {
    logger.success(`${Module.name} imported successfully.`);
  }
}

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
