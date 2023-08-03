/* eslint-disable @typescript-eslint/no-explicit-any */
import { injectable } from "inversify";
import ControllerConfig from "../types/ControllerConfig";
import { Controller } from "../types";

export default function controller({ method, api, path }: ControllerConfig) {
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
    const config = {
      method: method.toLowerCase(),
      api,
      path: path || "",
    };
    injectable()(constructor);

    return class extends constructor {
      static controllerName = constructor.name;
      static config = config;

      method = config.method;
      api = config.api;
      path = config.path;
    };
  };
}
