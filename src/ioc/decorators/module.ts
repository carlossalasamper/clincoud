import { injectable } from "inversify";
import ModuleMetadata, { ModuleMetadataArgs } from "../types/ModuleMetadata";
import { Constructor } from "../../common";
import InjectableType, { InjectableTypeKey } from "../types/InjectableType";

export default function module({
  imports = [],
  controllers = [],
  providers = [],
}: ModuleMetadataArgs) {
  return (target: Constructor) => {
    const metadata = {
      imports,
      controllers,
      providers,
    } as ModuleMetadata;

    injectable()(target);

    for (const key in metadata) {
      if (metadata.hasOwnProperty(key)) {
        Reflect.defineMetadata(
          key,
          metadata[key as keyof ModuleMetadata],
          target.prototype
        );
      }
    }

    Reflect.defineMetadata(
      InjectableTypeKey,
      InjectableType.Module,
      target.prototype
    );
  };
}
