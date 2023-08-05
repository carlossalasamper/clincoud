import { keys } from "ts-transformer-keys";
import API from "../../domain/API";
import Middleware from "./Middleware";
import Constructor from "../../../common/types/Constructor";

export interface ControllerMetadataArgs {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  api: keyof API;
  path?: string;
  middlewares?: Constructor<Middleware>[];
  lateMiddlewares?: Constructor<Middleware>[];
}

type ControllerMetadata = Omit<ControllerMetadataArgs, "method"> & {
  method: "get" | "post" | "put" | "delete" | "patch";
  api: keyof API;
  path: string;
  middlewares: Constructor<Middleware>[];
  lateMiddlewares: Constructor<Middleware>[];
};

export default ControllerMetadata;

export const controllerMetadataKeys = keys<ControllerMetadata>();
