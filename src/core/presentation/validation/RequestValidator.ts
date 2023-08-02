/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction } from "express";
import ErrorIssue from "../../domain/ErrorIssue";
import HttpError from "../../domain/HttpError";
import HttpStatusCode from "../../domain/HttpStatusCode";
import { ZodError } from "zod";
import { Request, Response } from "express";
import Middleware from "../types/Middleware";
import { injectable } from "inversify";
import { RequestValidation } from "../types";

@injectable()
export default class RequestValidator {
  public middleware<SchemasType extends RequestValidation<any, any, any>>(
    schemas: SchemasType
  ): Middleware {
    return new RequestValidatorMiddleware(schemas);
  }
}

class RequestValidatorMiddleware<
  SchemasType extends RequestValidation<any, any, any>
> implements Middleware
{
  constructor(private readonly schemas: SchemasType) {}

  handler = (req: Request, _res: Response, next: NextFunction) => {
    const { params, query, body } = this.schemas;
    const errorIssues: Array<ErrorIssue> = [];

    if (params) {
      const parsed = params.safeParse(req.params);
      if (!parsed.success) {
        errorIssues.push(
          ...this.mapZodErrorToErrorIssues(parsed.error, "params")
        );
      }
    }
    if (query) {
      const parsed = query.safeParse(req.query);
      if (!parsed.success) {
        errorIssues.push(
          ...this.mapZodErrorToErrorIssues(parsed.error, "query")
        );
      }
    }
    if (body) {
      const parsed = body.safeParse(req.body);
      if (!parsed.success) {
        errorIssues.push(
          ...this.mapZodErrorToErrorIssues(parsed.error, "body")
        );
      }
    }

    if (errorIssues.length > 0) {
      next(new HttpError(HttpStatusCode.BadRequest, undefined, errorIssues));
    } else {
      next();
    }
  };

  private mapZodErrorToErrorIssues = (
    error: ZodError,
    tag: keyof RequestValidation
  ): ErrorIssue[] =>
    error.issues.map((issue) => ({
      key: issue.path.join("."),
      message: issue.message,
      tags: [tag],
    }));
}
