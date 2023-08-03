/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { Container } from "inversify";
import { Controller, ControllerConfig, ControllerToken } from "./core";

const container = new Container();

export function registerControllers(
  controllerClasses: {
    new (...args: any[]): Controller;
  }[]
) {
  controllerClasses.forEach((controller) => {
    const { config } = controller as unknown as { config: ControllerConfig };

    console.log(
      `Controller ${controller.name} registered for ${config.method} ${config.api}${config.path}`
    );

    container
      .bind<Controller>(ControllerToken)
      .to(controller)
      .inSingletonScope();
  });
}

export default container;
