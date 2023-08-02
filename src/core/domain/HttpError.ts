import ErrorIssue from "./ErrorIssue";
import HttpStatusCode from "./HttpStatusCode";

export default class HttpError {
  status: HttpStatusCode;
  statusCode: HttpStatusCode;
  stack: string | undefined;
  message: string | undefined;
  issues?: ErrorIssue[];

  constructor(
    statusCode: HttpStatusCode,
    message?: string,
    issues?: ErrorIssue[]
  ) {
    this.status = statusCode;
    this.statusCode = statusCode;
    this.message = message;
    this.stack = new Error().stack;
    this.issues = issues;
  }
}
