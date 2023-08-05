/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction } from "express";
import ErrorIssue from "../../domain/ErrorIssue";
import HttpError from "../../domain/HttpError";
import HttpStatusCode from "../../domain/HttpStatusCode";
import { ZodError, ZodSchema } from "zod";
import { Request, Response } from "express";
import { injectable } from "inversify";
import { RequestValidation } from "../types";

@injectable()
export default class Validator {
  validate = <T = Record<string, unknown>>(
    schema: ZodSchema,
    data: T,
    tags: string[] = ["validation"]
  ) => {
    const errorIssues: Array<ErrorIssue> = [];
    const parsed = schema.safeParse(data);

    if (!parsed.success) {
      errorIssues.push(...this.mapZodErrorToErrorIssues(parsed.error, tags));
    }

    return errorIssues;
  };

  validateMiddleware =
    (validation: RequestValidation) =>
    (req: Request, _res: Response, next: NextFunction) => {
      const errorIssues: Array<ErrorIssue> = [];

      if (validation.params) {
        errorIssues.push(
          ...this.validate(validation.params, req.params, ["params"])
        );
      }
      if (validation.query) {
        errorIssues.push(
          ...this.validate(validation.query, req.query, ["query"])
        );
      }
      if (validation.body) {
        errorIssues.push(...this.validate(validation.body, req.body, ["body"]));
      }

      if (errorIssues.length > 0) {
        next(new HttpError(HttpStatusCode.BadRequest, undefined, errorIssues));
      } else {
        next();
      }
    };

  private mapZodErrorToErrorIssues = (
    error: ZodError,
    tags: string[] = []
  ): ErrorIssue[] =>
    error.issues.map((issue) => ({
      key: issue.path.join("."),
      message: issue.message,
      tags,
    }));
}
