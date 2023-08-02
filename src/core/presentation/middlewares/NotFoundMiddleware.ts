import { injectable } from "inversify";
import Middleware from "../types/Middleware";
import { NextFunction, Request, Response } from "express";
import HttpError from "../../domain/HttpError";
import HttpStatusCode from "../../domain/HttpStatusCode";

@injectable()
export default class NotFoundMiddleware implements Middleware {
  public handler = (_req: Request, _res: Response, next: NextFunction) => {
    next(new HttpError(HttpStatusCode.NotFound));
  };
}
