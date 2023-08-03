/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { injectable } from "inversify";
import ControllerConfig from "../types/ControllerConfig";
import { Controller, ControllerToken } from "../types";
import container from "../../../container";

export default function controller(config: ControllerConfig) {
  return <
    T extends {
      new (...args: any[]): {
        handler: Controller["handler"];
        middlewares: Controller["middlewares"];
        lateMiddlewares: Controller["lateMiddlewares"];
      };
    }
  >(
    constructor: T
  ) => {
    const classExtended = class extends constructor {
      method = config.method.toLowerCase();
      api = config.api;
      path = config.path || "";
    };

    injectable()(classExtended);

    console.log(
      `Controller ${classExtended.name} registered for ${config.method} ${config.api}${config.path}`
    );

    container
      .bind<Controller>(ControllerToken)
      .to(classExtended)
      .inSingletonScope();

    return classExtended;
  };
}
