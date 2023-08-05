import { injectable } from "inversify";
import ControllerMetadata, {
  ControllerMetadataArgs,
} from "../types/ControllerMetadata";
import { Controller } from "../types";
import InjectableType, {
  InjectableTypeKey,
} from "../../../ioc/types/InjectableType";
import { Constructor } from "../../../common";

export default function controller({
  method,
  api,
  path = "",
  middlewares = [],
  lateMiddlewares = [],
}: ControllerMetadataArgs) {
  return (target: Constructor<Controller>) => {
    const metadata = {
      method: method.toLowerCase(),
      api,
      path,
      middlewares,
      lateMiddlewares,
    } as ControllerMetadata;

    injectable()(target);

    for (const key in metadata) {
      if (metadata.hasOwnProperty(key)) {
        Reflect.defineMetadata(
          key,
          metadata[key as keyof ControllerMetadata],
          target.prototype
        );
      }
    }

    Reflect.defineMetadata(
      InjectableTypeKey,
      InjectableType.Controller,
      target.prototype
    );
  };
}
