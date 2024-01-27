/* eslint-disable @typescript-eslint/no-unused-vars */
import { injectable } from "inversify-sugar";
import { ErrorRequestHandler } from "express";
import HttpError from "../../domain/HttpError";
import ErrorMiddleware from "../types/ErrorMiddleware";
import ErrorResponse from "../../domain/ErrorResponse";

@injectable()
export default class ProductionErrorMiddleware implements ErrorMiddleware {
  public execute: ErrorRequestHandler = async (
    httpError: HttpError,
    req,
    res,
    _next
  ) => {
    const url = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
    const referer = req.get("referer");
    const response = new ErrorResponse({
      httpError: { ...httpError, stack: undefined },
      url,
      referer,
    });

    res.status(response.statusCode).json(response.toPlain());
  };
}
