/* eslint-disable @typescript-eslint/no-explicit-any */
import { injectable } from "inversify";
import ControllerConfig from "../types/ControllerConfig";
import { Controller } from "../types";

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

    return class extends constructor {
      static config = config;

      method = config.method.toLowerCase();
      api = config.api;
      path = config.path || "";
    };
  };
}
