/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { Container } from "inversify";
import {
  Controller,
  ControllerConfig,
  ControllerToken,
  DecoratedController,
} from "./core";

const container = new Container();

export function registerControllers(
  controllerClasses: {
    new (...args: any[]): DecoratedController;
    config: ControllerConfig;
  }[]
) {
  controllerClasses.forEach((controller) => {
    const { config } = controller;

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
