import { keys } from "ts-transformer-keys";
import API from "../../domain/API";
import { Newable } from "inversify-sugar";
import MiddlewareRef from "./MiddlewareRef";

export interface ControllerMetadataArgs {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  api: keyof API;
  path?: string;
  middlewares?: MiddlewareRef[];
  lateMiddlewares?: MiddlewareRef[];
}

type ControllerMetadata = Omit<ControllerMetadataArgs, "method"> & {
  method: "get" | "post" | "put" | "delete" | "patch";
  api: keyof API;
  path: string;
  middlewares: MiddlewareRef[];
  lateMiddlewares: MiddlewareRef[];
  module: Newable | null;
};

export default ControllerMetadata;

export const controllerModuleKey = "module";

export const controllerMetadataKeys = keys<ControllerMetadata>();
