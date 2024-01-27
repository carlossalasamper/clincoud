import ControllerMetadata, {
  ControllerMetadataArgs,
} from "../types/ControllerMetadata";
import { AnyController } from "../types";
import { Newable, injectable } from "inversify-sugar";

export default function controller({
  method,
  api,
  path = "",
  middlewares = [],
  lateMiddlewares = [],
}: ControllerMetadataArgs) {
  return (target: Newable<AnyController>) => {
    const metadata: ControllerMetadata = {
      method: method.toLowerCase() as ControllerMetadata["method"],
      api,
      path,
      middlewares,
      lateMiddlewares,
      module: null,
    };

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
  };
}
