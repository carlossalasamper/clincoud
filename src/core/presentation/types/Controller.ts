import { RequestHandler } from "express";
import ControllerConfig from "./ControllerConfig";
import Middleware from "./Middleware";

export const ControllerToken = Symbol();

type Controller = {
  handler: RequestHandler;
  get middlewares(): Middleware[];
  get lateMiddlewares(): Middleware[];
};

type DecoratedController = Controller & {
  api: ControllerConfig["api"];
  method: "get" | "post" | "put" | "delete" | "patch";
  path: string;
};

export default Controller;

export { DecoratedController };
