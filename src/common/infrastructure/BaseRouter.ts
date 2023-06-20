import { Router } from "express";
import SerializedRoute from "./types/SerializedRoute";
import { injectable } from "inversify";

@injectable()
export default abstract class BaseRouter {
  abstract get routes(): SerializedRoute[];
  public readonly router;
  public path = "";

  constructor() {
    this.router = Router();
  }

  public register() {
    this.routes.forEach(({ path, method, handlers }) => {
      this.router[method](path, ...handlers);
    });
  }
}
