import { NextFunction, Request, Response } from "express";

export const ControllerToken = Symbol("Controller");

type Controller<RequestType = Request, ResponseType = Response> = {
  handler: (
    req: RequestType,
    res: ResponseType,
    next: NextFunction
  ) => Promise<void>;
};

export default Controller;
