/* eslint-disable @typescript-eslint/no-explicit-any */
import { injectable } from "inversify";
import ControllerConfig from "../types/ControllerConfig";

export default function controller(config: ControllerConfig) {
  return <T extends { new (...args: any[]): object }>(constructor: T) => {
    const c = class extends constructor {
      method = config.method.toLowerCase();
      api = config.api;
      path = config.path || "";
    };

    injectable()(c);

    return c;
  };
}
