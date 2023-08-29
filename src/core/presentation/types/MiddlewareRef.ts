import { Newable } from "inversify-sugar";
import Middleware from "./Middleware";

export type MiddlewareRefSource = "provided" | "imported";

export type NewableMiddlewareRef = Newable<Middleware>;

export type MiddlewareRefObject = {
  class: NewableMiddlewareRef;
  source: MiddlewareRefSource;
};

type MiddlewareRef = NewableMiddlewareRef | MiddlewareRefObject;

export default MiddlewareRef;
