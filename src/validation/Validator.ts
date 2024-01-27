/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request } from "express";
import ErrorIssue from "../core/domain/ErrorIssue";
import HttpError from "../core/domain/HttpError";
import HttpStatusCode from "../core/domain/HttpStatusCode";
import { ZodError, ZodSchema } from "zod";
import { Response } from "express";
import { injectable } from "inversify-sugar";
import { RequestValidation } from "./presentation";
import ValidatedRequest from "./presentation/types/ValidatedRequest";

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
      const validatedRequest = req as ValidatedRequest;

      if (validation.params) {
        const paramsErrors = this.validate(validation.params, req.params, [
          "params",
        ]);

        errorIssues.push(...paramsErrors);

        if (paramsErrors.length === 0) {
          validatedRequest.validatedParams = req.params;
        }
      }
      if (validation.query) {
        const queryErrors = this.validate(
          validation.query,
          validation.queryTransform
            ? validation.queryTransform(req.query)
            : req.query,
          ["query"]
        );

        errorIssues.push(...queryErrors);

        if (queryErrors.length === 0) {
          validatedRequest.validatedQuery =
            validation.queryTransform?.(req.query) || req.query;
        }
      }
      if (validation.body) {
        const bodyErrors = this.validate(validation.body, req.body, ["body"]);

        errorIssues.push(...bodyErrors);

        if (bodyErrors.length === 0) {
          validatedRequest.validatedBody = req.body;
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
    tags: string[] = []
  ): ErrorIssue[] =>
    error.issues.map((issue) => ({
      key: issue.path.join("."),
      message: issue.message,
      tags,
    }));
}
