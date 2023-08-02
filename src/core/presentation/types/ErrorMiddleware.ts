import { ErrorRequestHandler } from "express";

export default interface ErrorMiddleware {
  execute: ErrorRequestHandler;
}
