import { NextFunction, Request, Response } from "express";

export default interface Middleware<
  RequestType = Request,
  ResponseType = Response
> {
  handler: (
    req: RequestType,
    res: ResponseType,
    next: NextFunction
  ) => Promise<void> | void;
}
