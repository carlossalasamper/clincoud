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
    injectable()(constructor);

    container
      .bind<Controller>(ControllerToken)
      .to(constructor)
      .inSingletonScope();

    return class extends constructor {
      method = config.method.toLowerCase();
      api = config.api;
      path = config.path || "";
    };
  };
}
