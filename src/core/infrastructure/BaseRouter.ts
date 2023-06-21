import { Router } from "express";
import { injectable } from "inversify";
import { SerializedRoute } from ".";

@injectable()
export default abstract class BaseRouter {
  abstract get routes(): SerializedRoute[];
  public readonly router: Router;
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
