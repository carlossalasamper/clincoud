import { RequestHandler } from "express";

export default interface Middleware {
  handler: RequestHandler;
}
