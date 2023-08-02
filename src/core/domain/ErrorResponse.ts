import ErrorIssue from "./ErrorIssue";
import HttpError from "./HttpError";
import HttpStatusCode, { HttpStatusCodeName } from "./HttpStatusCode";

export default class ErrorResponse {
  url: string;
  referer: string | null;
  statusCode: HttpStatusCode;
  statusName: HttpStatusCodeName;
  stack: string | null;
  issues: ErrorIssue[];

  private readonly defaultError = new HttpError(
    HttpStatusCode.InternalServerError
  );

  constructor({
    httpError,
    url,
    referer,
  }: {
    httpError: HttpError;
    url: string;
    referer: string | undefined;
  }) {
    this.url = url;
    this.referer = referer || null;
    this.statusCode =
      httpError.statusCode || httpError.status || this.defaultError.statusCode;
    this.statusName = Object.keys(HttpStatusCode).find(
      (key) =>
        HttpStatusCode[key as HttpStatusCodeName] === httpError.statusCode
    ) as HttpStatusCodeName;
    this.stack = httpError.stack || null;
    this.issues = httpError.issues
      ? httpError.issues
      : [
          {
            key: "main",
            message: httpError.message || this.statusName,
            tags: [],
          },
        ];
  }

  public toPlain(): Record<string, unknown> {
    return {
      url: this.url,
      referer: this.referer,
      statusCode: this.statusCode,
      statusName: this.statusName,
      stack: this.stack,
      issues: this.issues,
    };
  }
}
