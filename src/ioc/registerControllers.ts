/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import {
  AppApiConfig,
  AppConfig,
  AppConfigToken,
  Controller,
  ControllerConfig,
  ControllerToken,
} from "../core";
import container from "./container";

const registerControllers = (
  controllerClasses: {
    new (...args: any[]): Controller;
  }[]
) => {
  controllerClasses.forEach((controller) => {
    const { config } = controller as unknown as { config: ControllerConfig };
    const appConfig = container.get<AppConfig>(AppConfigToken);
    const apiConfig = appConfig.api[config.api] as AppApiConfig;

    console.log(
      `Controller registered: ${config.method} ${apiConfig.path}${config.path}`
    );

    container
      .bind<Controller>(ControllerToken)
      .to(controller)
      .inSingletonScope();
  });
};

export default registerControllers;
