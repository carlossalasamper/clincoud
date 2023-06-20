import { RequestHandler } from "express";

export default interface SerializedRoute {
  path: string;
  method: "get" | "post" | "put" | "patch" | "delete";
  handlers: RequestHandler[];
}
