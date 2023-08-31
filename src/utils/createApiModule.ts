import { DynamicModule, Newable, NewableModule } from "inversify-sugar";
import { Controller, ControllerToken } from "../core";
import { controllerModuleKey } from "../core/presentation/types/ControllerMetadata";

export default function createApiModule(
  Module: NewableModule,
  ...Controllers: Newable<Controller>[]
): DynamicModule {
  Controllers.forEach((Controller) => {
    Reflect.defineMetadata(controllerModuleKey, Module, Controller.prototype);
  });

  return {
    module: Module,
    providers: Controllers.map((Controller) => ({
      provide: ControllerToken,
      useClass: Controller,
    })),
  };
}
